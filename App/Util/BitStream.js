const assert = require('assert');
const Packet = require("./Packet");

const BitStreamMode = {
    WRITE: 1,
    READ: 0
};

const ErrorFlags = {
    OVERFLOW: 'BSE_OVERFLOW'
};

class BitStream {
    /**
     * @param {number} mode Write mode
     * @param {Object} cursor 
     * @param {number} bufferSize 
     * @param {number} maxSize
     * @param {number} size  
     * @param {number} bitLength 
     * @param {number} byteAlignedMode  
     */
    constructor(mode, cursor = { byte: 0, bit: 0 }, bufferSize = 0, maxSize = 0, size = 0, bitLength = 0, byteAlignedMode = 0) {
        this.mode = mode;
        this.cursor = cursor;
        this.data = Buffer.alloc(bufferSize);
        this.size = size;
        this.maxSize = maxSize;
        this.bitLength = bitLength;
        this.userData = null;
        this.byteAlignedMode = byteAlignedMode;
        this.errorFlags = 0;
    }

    static get BSE_OVERFLOW() { return 1; }

    static ROUND_BITS_UP(bits) {
        return (bits + 7) & ~7;
    }

    static bsGetCursorBitPosition(bs) {
        return bs.cursor.byte * 8 + bs.cursor.bit;
    }

    /**
     * Write bits to the bitstream.
     * @param {number} numbits 
     * @param {number} val 
     */
    bsWriteBits(numbits, val) {
        if (this.errorFlags) {
            return;
        }

        if (this.mode != BitStreamMode.WRITE) {
            throw new Error('BitStream not in write mode');
        }
        if (numbits > 32)
            throw new Error('Cannot write more than 32 bits at a time');

        if (numbits === 0) return;

        if (this.byteAlignedMode) {
            if (numbits !== 32) {
                const mask = (1 << numbits) - 1;
                val &= mask;
            }
            numbits = BitStream.ROUND_BITS_UP(numbits);
            if (this.cursor.bit !== 0) throw new Error('Byte aligned write must be 32 bits wide');
        }

        // Ensure enough space
        const lastByteModified = this.cursor.byte + BitStream.ROUND_BITS_UP(this.cursor.bit + numbits);
        if (lastByteModified > this.maxSize) {
            this.resize(Math.max(this.maxSize * 2, lastByteModified));
        }

        // Write bits
        while (numbits > 0) {
            const availableBits = 8 - this.cursor.bit;
            const bitsToWrite = Math.min(availableBits, numbits);
            const mask = (1 << bitsToWrite) - 1;
            const shiftedVal = (val & mask) << this.cursor.bit;

            this.data[this.cursor.byte] |= shiftedVal;

            val >>= bitsToWrite;
            numbits -= bitsToWrite;
            this.cursor.bit += bitsToWrite;

            if (this.cursor.bit === 8) {
                this.cursor.byte++;
                this.cursor.bit = 0;
                if (numbits > 0) {
                    this.data[this.cursor.byte] = 0;
                }
            }
        }

        // Update size and bitLength
        this.size = Math.max(this.size, this.cursor.byte);
        this.bitLength = Math.max(this.bitLength, BitStream.bsGetCursorBitPosition(this));
    }

    resize(newSize) {
        const newBuffer = Buffer.alloc(newSize);
        this.data.copy(newBuffer);
        this.data = newBuffer;
        this.maxSize = newSize;
    }

    writeBitsToBuffer(numbits, val) {
        let cursorByte = this.cursor.byte;
        let cursorU32 = (cursorByte >>> 0) >>> 2; // Align to 32-bit word boundary
        let cursorU32Bit = (this.cursor.bit + 8 * (cursorByte & 3));
        let oldMask = (1 << cursorU32Bit) - 1;

        if (cursorU32Bit > 0) {
            const maxBitsToCopy = 32 - cursorU32Bit;
            const bitsToCopy = Math.min(numbits, maxBitsToCopy);

            this.data[cursorU32] = (this.data[cursorU32] & oldMask) | ((val & ((1 << bitsToCopy) - 1)) << cursorU32Bit);

            val >>= bitsToCopy;
            cursorU32Bit += bitsToCopy;

            this.cursor.byte = (cursorU32 + (cursorU32Bit >> 3));
            this.cursor.bit = cursorU32Bit & 7;

            numbits -= bitsToCopy;
            cursorU32 += cursorU32Bit >>> 5;
            cursorU32Bit &= 31;
            oldMask = (1 << cursorU32Bit) - 1;
        }

        if (numbits === 32) {
            if (this.cursor.bit !== 0 || cursorU32Bit !== 0) {
                throw new Error('Misalignment when writing 32 bits.');
            }

            this.data[cursorU32] = val;
            this.cursor.byte += 4;
            numbits = 0;
        } else if (numbits > 0) {
            const bitsToCopy = numbits;

            if (this.cursor.bit !== 0 || cursorU32Bit !== 0) {
                throw new Error('Misalignment when copying bits.');
            }

            this.data[cursorU32] = (val & ((1 << bitsToCopy) - 1));

            cursorU32Bit += bitsToCopy;
            this.cursor.byte = (cursorU32 + (cursorU32Bit >> 3));
            this.cursor.bit = cursorU32Bit & 7;

            numbits -= bitsToCopy;
        }

        if (this.cursor.bit === 0) {
            this.data[this.cursor.byte] = 0;
        }

        this.size = Math.max(this.size, this.cursor.byte);

        if (this.size > this.maxSize) {
            throw new Error('Stream size exceeds max size.');
        }

        this.bitLength = Math.max(this.bitLength, this.bsGetCursorBitPosition());
    }

    handleMemoryOverflow(lastByteModified) {
        if (this.memAllocator) {
            this.memAllocator(this);
            if (lastByteModified >= this.maxSize) {
                throw new Error('Insufficient memory allocation.');
            }
        } else {
            this.errorFlags = ErrorFlags.OVERFLOW;
        }
    }

    /**
     * Get the current cursor position in the bitstream.
     * @returns {number}
     */
    bsGetCursorBitPosition() {
        return (this.cursor.byte * 8) + this.cursor.bit;
    }

    /**
     * Initialize the bitstream.
     * 
     * @param {Buffer} buffer 
     * @param {number} bufferSize 
     * @param {BitStreamMode} initMode 
     * @param {number} byteAligned 
     */
    initBitStream(buffer, bufferSize, initMode, byteAligned) {
        this.data.set(buffer);
        this.maxSize = bufferSize;
        this.mode = initMode;
        this.data[0] = 0;
        this.data[1] = 0;
        this.data[2] = 0;
        this.data[3] = 0;
        this.byteAlignedMode = byteAligned;
    }

    static pktSendBitsPack(pak, minbits, val) {
        if (pak.hasDebugInfo) {
            BitStream.bsTypedWriteBitsPack(pak.stream, minbits, val);
        } else {
            BitStream.bsWriteBitsPack(pak.stream, minbits, val);
        }
    }

    /**
     * 
     * @param {BitStream} bs The bitstream to write to
     * @param {number} minbits The minimum number of bits to write
     * @param {number} val The value to write
     */
    static bsTypedWriteBitsPack(bs, minbits, val) {
        bs.bsWriteBits(3, 4);
        BitStream.bsWriteBitsPack(bs, 5, minbits);
        BitStream.bsWriteBitsPack(bs, minbits, val);
    }

    static bsWriteBitsPack(bs, minbits, val) {
        let bitmask;
        let success = true;
        const one = minbits === 1;
        const measured_bits = BitStream.countBits(val);

        if (bs.byteAlignedMode) {
            bs.bsWriteBits(32, val);
            return;
        }
        if (bs.errorFlags) {
            return;
        }

        while (true) {
            bitmask = (1 << minbits) - 1;

            if (val < bitmask || minbits >= 32) {
                bs.bsWriteBits(minbits, val);
                if (success) {
                    g_packetsizes_success[measured_bits]++; // be more global?
                } else {
                    g_packetsizes_failed[measured_bits]++;
                }
                if (one) {
                    g_packetsizes_one[measured_bits]++;
                }
                break;
            }

            bs.bsWriteBits(minbits, bitmask);
            minbits <<= 1;
            if (minbits > 32) {
                minbits = 32;
            }
            val -= bitmask;
            success = false;
        }
    }

    static countBits(value) {
        if (value === 0) return 1;  // Match C version's behavior for 0
        return Math.floor(Math.log2(value)) + 1;
    }

    /**
     * 
     * @param {BitStream} bs 
     * @param {number} numbits 
     * @param {number} val 
     */
    static bsTypedWriteBits(bs, numbits, val) {
        bs.bsWriteBits(3, 3);
        BitStream.bsWriteBitsPack(bs, 5, numbits);
        bs.bsWriteBits(numbits, val);
    }

    /**
     * 
     * @param {Packet} pak 
     * @param {number} numbits 
     * @param {number} val 
     */
    static pktSendBits(pak, numbits, val) {
        if (pak.hasDebugInfo)
            BitStream.bsTypedWriteBits(pak.stream, numbits, val);
        else
            pak.stream.bsWriteBits(pak.stream, numbits, val);
    }
}

const g_packetsizes_success = new Array(33).fill(0);
const g_packetsizes_failed = new Array(33).fill(0);
const g_packetsizes_one = new Array(33).fill(0);

module.exports = BitStream;;
