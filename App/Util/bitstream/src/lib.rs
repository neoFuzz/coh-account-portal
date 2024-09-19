mod utils;

use std::{
    cmp::{max, min},
    convert::TryInto,
};
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;
use web_sys::js_sys;

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
        bs.bs_write_bits(DATA_TYPE_BIT_LENGTH, BS_BITS);
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
        let last_byte_modified: usize =
            self.cursor.byte + Self::round_bits_up((self.cursor.bit + numbits as usize).try_into().unwrap()) as usize;

        // Only resize if absolutely necessary
        if last_byte_modified > self.size as usize {
            let new_size = last_byte_modified;
            let msg = format!("size: {} | Resizing from {} to {}", self.size, self.data.len(), new_size);
            Self::web_log(&msg.into());
            self.data.resize(new_size, 0);
            //self.size = new_size as u32;
        }

        // Setup and do 32-bit copies
        {
            let mut cursor_u32_bit: usize = self.cursor.bit as usize;
            let mut old_mask = (1 << cursor_u32_bit) - 1;

            // Calculate new byte offset
            let mut new_byte_offset = self.cursor.byte;

            // Do shifted 32-bit masked copy
            if cursor_u32_bit > 0 {
                let max_bits_to_copy = 32 - cursor_u32_bit;
                let bits_to_copy = min(numbits, max_bits_to_copy.try_into().unwrap());

                let mut current_value = u32::from_le_bytes([
                    self.data[new_byte_offset],
                    self.data.get(new_byte_offset + 1).copied().unwrap_or(0),
                    self.data.get(new_byte_offset + 2).copied().unwrap_or(0),
                    self.data.get(new_byte_offset + 3).copied().unwrap_or(0),
                ]);

                let new_val = (current_value & old_mask)
                    | ((val & ((1 << bits_to_copy) - 1)) << cursor_u32_bit);
                Self::write_u32_to_vec(
                    &mut self.data,
                    new_byte_offset,
                    new_val,
                    cursor_u32_bit as u32 + bits_to_copy,
                );

                val >>= bits_to_copy;
                cursor_u32_bit += bits_to_copy as usize;

                // Update the cursor
                new_byte_offset = self.cursor.byte + (cursor_u32_bit >> 3);
                if new_byte_offset >= self.data.len() {
                    panic!("Cursor byte position out of bounds");
                }

                // Update the cursor
                self.cursor.byte = new_byte_offset;
                self.cursor.bit = cursor_u32_bit & 7;

                numbits -= bits_to_copy;

                cursor_u32_bit %= 32;
                old_mask = (1 << cursor_u32_bit) - 1;
            }

            // Do 32-bit copy
            if numbits == 32 {
                debug_assert!(self.cursor.bit == 0);
                debug_assert!(cursor_u32_bit == 0);

                Self::write_u32_to_vec(&mut self.data, new_byte_offset, val, 32);
                new_byte_offset = self.cursor.byte + 4;
                if new_byte_offset > self.data.len() {
                    panic!("Cursor byte position out of bounds");
                }
                self.cursor.byte = new_byte_offset;
                numbits = 0;
            }
            // Do 32-bit masked copy
            else if numbits > 0 {
                let bits_to_copy = numbits;

                debug_assert!(self.cursor.bit == 0);
                debug_assert!(cursor_u32_bit == 0);

                let masked_val = val & ((1 << bits_to_copy) - 1);
                Self::write_u32_to_vec(&mut self.data, new_byte_offset, masked_val, bits_to_copy);

                cursor_u32_bit += bits_to_copy as usize;

                // Compute the new byte offset within the data vector
                new_byte_offset = self.cursor.byte + (cursor_u32_bit >> 3);
                if new_byte_offset > self.data.len() {
                    panic!("Cursor byte position out of bounds");
                }

                // Update the cursor.byte and cursor.bit fields
                self.cursor.byte = new_byte_offset;
                self.cursor.bit = cursor_u32_bit & 7;

                numbits -= bits_to_copy;
            }
        }

        // Only increase size if cursor is beyond it.
        self.size = max(self.size, self.cursor.byte.try_into().unwrap());

        // The other bsWrite functions assume that the next byte is zeroed out
        // Only zero out the next byte if we're not about to write to it
        if self.cursor.byte < self.data.len() && self.cursor.bit == 0 && numbits == 0 {
            self.data[self.cursor.byte] = 0;
        }

        debug_assert!(self.size <= self.max_size);

        // Update the recorded bitlength of the stream.
        let cursor_bit_pos = self.bs_get_cursor_bit_position();
        self.bit_length = max(self.bit_length, cursor_bit_pos);
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
    pub fn get_data_len(&mut self) -> u32 {
        self.data.len() as u32
    }

    #[wasm_bindgen]
    pub fn pkt_send_bits_pack(&mut self, minbits: u32, val: u32, debug: bool) {
        let message = format!("sending {} bits pack: {}", minbits, val);
        Self::web_log(&message);
        if debug {
            Self::bs_typed_write_bits_pack(self, minbits, val);
        } else {
            Self::bs_write_bits_pack(self, minbits, val);
        }
        let message = format!("** byte: {} | bit: {}", self.cursor.byte, self.cursor.bit);
        Self::web_log(&message);
    }

    fn web_log(message: &String) {
        web_sys::console::log_1(&message.into());
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
    pub fn to_hex_string(&self) -> String {
        let message1 = format!(
            "Data stats:\n size: {}\n bitlen: {}",
            self.size, self.bit_length
        );
        web_sys::console::log_1(&message1.into());

        self.data
            .iter()
            .map(|byte| format!("{:02x}", byte))
            .collect()
    }

    fn _write_u32_to_vec(data: &mut Vec<u8>, start: usize, value: u32) {
        let bytes = value.to_le_bytes();
        for i in 0..4 {
            // Resize only when writing beyond the current data length
            if start + i >= data.len() {
                let msg = format!(
                    "Resizing: Current length = {}, Needed = {}",
                    data.len(),
                    start + i + 1
                );
                Self::web_log(&msg.into());
                data.resize(start + i + 1, 0);
            }
            data[start + i] = bytes[i];
        }
    }

    // Helper function to write u32 to Vec<u8> without oversizing
    fn write_u32_to_vec(data: &mut Vec<u8>, start: usize, value: u32, bits_to_write: u32) {
        let bytes = value.to_le_bytes();
        let bytes_to_write = (bits_to_write + 7) / 8; // Round up to nearest byte
        for i in 0..bytes_to_write as usize {
            if start + i < data.len() {
                data[start + i] = bytes[i];
            } else {
                // This should rarely happen due to the earlier resize
                data.push(bytes[i]);
            }
        }
    }

    /**
     Returns a new Uint8Array from the BitStream internal data Vec<u8>.
     This method is useful for passing the data to WebAssembly modules.

     @returns {Uint8Array} The data stored in the BitStream.
    */
    #[wasm_bindgen]
    pub fn get_data_array(&self) -> js_sys::Uint8Array {
        js_sys::Uint8Array::from(&self.data[..])
    }
}

/*******************************************************
 * For WebAssembly compatibility
 *******************************************************/
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
