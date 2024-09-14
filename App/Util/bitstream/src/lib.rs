mod utils;

use std::{cmp::max, convert::TryInto};
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

const BITSTREAM_MODE_WRITE: u32 = 1;
const BITSTREAM_MODE_READ: u32 = 0;
const ERROR_FLAGS_OVERFLOW: u32 = 1;

/// Constants for bit lengths
const DATA_TYPE_BIT_LENGTH: u32 = 3;
const DATA_LENGTH_MIN_BITS: u32 = 5;
const BS_BITS: u32 = 3;

#[wasm_bindgen]
#[derive(Debug)]
#[repr(u8)]
pub enum BitStreamMode {
    Read = 0,
    Write = 1,
}

// Define the Cursor struct
#[derive(Debug, Clone, Copy)]
pub struct Cursor {
    pub byte: usize,
    pub bit: usize,
}

#[derive(Debug)]
#[wasm_bindgen]
pub struct BitStream {
    mode: u8,
    cursor: Cursor,
    data: Vec<u8>,
    size: u32,
    max_size: u32,
    bit_length: u32,
    error_flags: u32,
    byte_aligned_mode: u8,
}

#[wasm_bindgen]
impl BitStream {
    #[wasm_bindgen(constructor)]
    pub fn new(mode: u8, buffer_size: usize, max_size: u32) -> Self {
        set_panic_hook();
        BitStream {
            mode,
            cursor: Cursor { byte: 0, bit: 0 },
            data: vec![0; buffer_size], // buffer_size
            size: 0,
            max_size,
            bit_length: 0,
            error_flags: 0,
            byte_aligned_mode: 0,
        }
    }

    pub fn round_bits_up(bits: u32) -> u32 {
        (bits + 7) & !7
    }

    #[wasm_bindgen]
    pub fn init_bit_stream(
        bs: &mut BitStream,
        buffer: Vec<u8>,
        buffer_size: usize,
        init_mode: BitStreamMode,
        byte_aligned: u8,
    ) {
        // Initialize the BitStream struct
        bs.data = buffer;
        bs.max_size = buffer_size.try_into().unwrap();
        bs.mode = init_mode as u8;
        bs.byte_aligned_mode = byte_aligned;

        // Ensure the buffer is at least 4 bytes long
        if bs.data.len() >= 4 {
            // Zero out the first 4 bytes of the buffer
            bs.data[0] = 0;
            bs.data[1] = 0;
            bs.data[2] = 0;
            bs.data[3] = 0;
        } else {
            // If the buffer is smaller than 4 bytes, zero out as many bytes as possible
            for i in 0..bs.data.len() {
                bs.data[i] = 0;
            }
        }
    }

    /// Write bits with a type prefix and length encoding.
    pub fn bs_typed_write_bits(bs: &mut BitStream, numbits: u32, val: u32) {
        bs.bs_write_bits(3, BS_BITS);
        BitStream::bs_write_bits_pack(bs, DATA_LENGTH_MIN_BITS, numbits);
        bs.bs_write_bits(numbits.try_into().unwrap(), val);
    }

    #[wasm_bindgen]
    pub fn bs_write_bits(&mut self, mut numbits: u32, mut val: u32) {
        if self.error_flags != 0 {
            return;
        }

        if self.mode == BitStreamMode::Read as u8 {
            panic!("BitStream is not in write mode");
        }

        assert!(numbits <= 32);

        if numbits == 0 {
            return;
        }

        if self.byte_aligned_mode == 1 {
            if numbits != 32 {
                let mask = (1 << numbits) - 1;
                val &= mask;
            }
            numbits = Self::round_bits_up(numbits);
            assert_eq!(self.cursor.bit, 0);
        }

        // Ensure we have enough space
        let added: u32 = (self.cursor.bit + (numbits as usize) ).try_into().unwrap();
        let last_byte_modified: usize =
            self.cursor.byte + (Self::round_bits_up(added) as usize);

        if last_byte_modified > self.data.len() {
            let new_size = max(
                last_byte_modified,
                (self.data.len() * 2).try_into().unwrap(),
            );
            self.data.resize(new_size, 0);
            self.max_size = new_size as u32;
            //println!("Resizing from {} to {}", self.data.len(), new_size);
        }

        // Write bits
        while numbits > 0 {
            let bits_available = 8 - self.cursor.bit;
            let bits_to_write = numbits.min(bits_available as u32);
            let mask = ((1 << bits_to_write) - 1) << self.cursor.bit;
            let write_val = (val as u8 & ((1 << bits_to_write) - 1)) << self.cursor.bit;

            self.data[self.cursor.byte] &= !mask;
            self.data[self.cursor.byte] |= write_val;

            self.cursor.bit += bits_to_write as usize;
            if self.cursor.bit == 8 {
                self.cursor.byte += 1;
                self.cursor.bit = 0;
            }

            val >>= bits_to_write;
            numbits -= bits_to_write;
        }

        // Update size and bit_length
        self.size = max(self.size, self.cursor.byte.try_into().unwrap());
        let cursor_bit_pos = self.cursor.byte * 8 + self.cursor.bit as usize;
        self.bit_length = max(self.bit_length, cursor_bit_pos.try_into().unwrap());
    }

    // Method to get the cursor bit position
    pub fn bs_get_cursor_bit_position(&self) -> u32 {
        ((self.cursor.byte << 3) + self.cursor.bit)
            .try_into()
            .unwrap()
    }

    fn bs_typed_write_bits_pack(bs: &mut BitStream, minbits: u32, val: u32) {
        bs.bs_write_bits(3, 4);
        Self::bs_write_bits_pack(bs, 5, minbits);
        Self::bs_write_bits_pack(bs, minbits, val);
    }

    fn bs_write_bits_pack(bs: &mut BitStream, mut minbits: u32, mut val: u32) {
        let mut bitmask: u32;
        let mut _success = true;
        let _one = minbits == 1;
        let _measured_bits = Self::count_bits(val);

        if bs.byte_aligned_mode == 1 {
            bs.bs_write_bits(32, val);
            return;
        }
        if bs.error_flags > 0 {
            return;
        }

        loop {
            bitmask = (1 << minbits) - 1;

            if val < bitmask || minbits >= 32 {
                bs.bs_write_bits(minbits.try_into().unwrap(), val);
                // Update statistics here
                break;
            }
            bs.bs_write_bits(minbits.try_into().unwrap(), bitmask);
            minbits <<= 1;
            if minbits > 32 {
                minbits = 32;
            }
            val -= bitmask;
            _success = false;
        }
    }

    /// Send bits to the bit stream
    #[wasm_bindgen]
    pub fn pkt_send_bits(&mut self, numbits: u32, val: u32, debug: bool) {
        if debug {
            Self::bs_typed_write_bits(self, numbits, val);
        } else {
            Self::bs_write_bits(self, numbits.try_into().unwrap(), val);
        }
    }

    #[wasm_bindgen]
    pub fn pkt_send_bits_pack(&mut self, minbits: u32, val: u32, debug: bool) {
        if debug {
            Self::bs_typed_write_bits_pack(self, minbits, val);
        } else {
            Self::bs_write_bits_pack(self, minbits, val);
        }
    }

    fn count_bits(val: u32) -> u32 {
        let mut bits = 0;
        let mut value = val;

        while value != 0 {
            value >>= 1;
            bits += 1;
        }

        if bits == 0 {
            bits = 1; // Ensure at least 1 bit is returned
        }

        bits
    }

    #[wasm_bindgen]
    pub fn byte_aligned_mode(&self) -> u8 {
        self.byte_aligned_mode
    }

    #[wasm_bindgen]
    pub fn set_byte_aligned_mode(&mut self, value: u8) {
        self.byte_aligned_mode = value;
    }

    #[wasm_bindgen]
    pub fn _to_hex_string(&self) -> String {
        let mut meaningful_data = self.data[..(self.size as usize)].to_vec();
        meaningful_data.reverse(); // Reverse to match little-endian representation
        
        // Trim leading zeros
        while meaningful_data.len() > 1 && meaningful_data[meaningful_data.len() - 1] == 0 {
            meaningful_data.pop();
        }

        let hex_string: String = meaningful_data.iter()
            .rev() // Reverse again to get correct order
            .map(|byte| format!("{:02x}", byte))
            .collect();

        format!("0x{}", hex_string)
    }

    #[wasm_bindgen]
    pub fn to_hex_string(&self) -> String {
        self.data[..self.size as usize]
            .iter()
            .map(|byte| format!("{:02x}", byte))
            .collect()
    }
}

// For WebAssembly compatibility
#[no_mangle]
pub extern "C" fn create_bitstream(capacity: usize) -> *mut BitStream {
    let bitstream = Box::new(BitStream::new(0, capacity, 1472));
    Box::into_raw(bitstream)
}

#[no_mangle]
pub extern "C" fn write_bits(ptr: *mut BitStream, numbits: u32, val: u32) {
    let bitstream = unsafe { &mut *ptr };
    bitstream.bs_write_bits(numbits, val);
}

#[no_mangle]
pub extern "C" fn get_hex_string(ptr: *mut BitStream) -> *mut u8 {
    let bitstream = unsafe { &*ptr };
    let hex_string = bitstream.to_hex_string();
    let mut vec = hex_string.into_bytes();
    vec.push(0); // Null-terminate the string
    let boxed_slice = vec.into_boxed_slice();
    Box::into_raw(boxed_slice) as *mut u8
}

#[no_mangle]
pub extern "C" fn free_bitstream(ptr: *mut BitStream) {
    unsafe {
        Box::from_raw(ptr);
    }
}

#[no_mangle]
pub extern "C" fn free_string(ptr: *mut u8) {
    unsafe {
        let _ = Box::from_raw(ptr);
    }
}
