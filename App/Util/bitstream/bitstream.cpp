#include <cstddef>
#include <emscripten.h>
#include <emscripten/bind.h>

#include "bitstream.h"
#include <iostream>
#include <vector>
#include <cstring>
#include <cassert>

#define ROUND_BITS_UP(x) ((x + 7) & ~7)
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

using namespace emscripten;

typedef uint32_t U32;

class BitStream
{
public:
    enum BitType
    {
        BS_BITS = 3,
        BS_PACKEDBITS,
        BS_BITARRAY,
        BS_STRING,
        BS_F32
    };

    BitStream(unsigned char *buffer, unsigned int bufferSize, BitStreamMode initMode, unsigned int byteAligned = 1)
        : data(buffer), maxSize(bufferSize), mode(initMode), byteAlignedMode(byteAligned), cursor(), errorFlags(0)
    {
        std::memset(data, 0, bufferSize);
        std::cout << "Initialized BitStream...\n";
    }

    void setByteAlignment(int align)
    {
        byteAlignedMode = align;
        if (align)
            alignByte();
    }

    int getByteAlignment() const
    {
        return byteAlignedMode;
    }

    void writeBits(int numBits, unsigned int value)
    {
        if (errorFlags)
            return; // Do not proceed if error flag is set
        if (mode != Write)
        {
            assert(0);
            return;
        }

        assert(numBits <= 32);
        if (numBits == 0)
            return;

        if (byteAlignedMode)
        {
            if (numBits != 32)
            {
                int mask = (1 << numBits) - 1;
                value &= mask; // Apply bitmask
            }
            numBits = ROUND_BITS_UP(numBits);
            assert(this->cursor.bit == 0);
        }
        else
        {

            // Setup and do 32-bit copies
            {
                unsigned char *cursor_byte = this->data + this->cursor.byte;
                U32 *cursor_U32 = (U32 *)((size_t)cursor_byte & ~3);
                U32 cursor_U32_bit = this->cursor.bit + 8 * ((size_t)cursor_byte & 3);
                U32 old_mask = (1 << cursor_U32_bit) - 1;

                // Do shifted 32-bit masked copy
                if (cursor_U32_bit > 0)
                {
                    int max_bits_to_copy = 32 - cursor_U32_bit;

                    int bits_to_copy = (numBits < max_bits_to_copy) ? numBits : max_bits_to_copy;

                    *cursor_U32 = (*cursor_U32 & old_mask) | ((value & ((1 << bits_to_copy) - 1)) << cursor_U32_bit);

                    value >>= bits_to_copy;
                    cursor_U32_bit += bits_to_copy;

                    this->cursor.byte = (unsigned int)(((size_t)cursor_U32 + (cursor_U32_bit >> 3)) - (size_t)this->data);
                    this->cursor.bit = cursor_U32_bit & 7;

                    numBits -= bits_to_copy;

                    cursor_U32 += cursor_U32_bit >> 5;
                    cursor_U32_bit &= 31;
                    old_mask = (1 << cursor_U32_bit) - 1;
                }

                // Do 32-bit copy
                if (numBits == 32)
                {
                    assert(this->cursor.bit == 0);
                    assert(cursor_U32_bit == 0);

                    *cursor_U32 = value;
                    this->cursor.byte += 4;
                    numBits = 0;
                }
                // Do 32-bit masked copy
                else if (numBits)
                {
                    int bits_to_copy = numBits;

                    assert(this->cursor.bit == 0);
                    assert(cursor_U32_bit == 0);

                    // NOTE: 1 << bits_to_copy will overfloat the 32-bit integer when bits_to_copy is 32.
                    // That's why we have the "Do 32-bit copy" section above
                    *cursor_U32 = (value & ((1 << bits_to_copy) - 1));

                    cursor_U32_bit += bits_to_copy;

                    this->cursor.byte = (unsigned int)(((size_t)cursor_U32 + (cursor_U32_bit >> 3)) - (size_t)this->data);
                    this->cursor.bit = cursor_U32_bit & 7;

                    numBits -= bits_to_copy;
                }
            }

            // The other bsWrite functions assume that the next byte is zeroed out
            if (this->cursor.bit == 0)
                this->data[this->cursor.byte] = 0;

            // Only increase size if cursor is beyond it.
            // We don't want to increase the size when we're overwriting data in the middle!
            this->size = MAX(this->size, this->cursor.byte);

            assert(this->size <= this->maxSize);

            // Update the recorded bitlength of the stream.
            {
                unsigned int cursorBitPos;
                cursorBitPos = this->getCursorBitPosition();
                this->bitLength = MAX(this->bitLength, cursorBitPos);
            }
        }
    }

    void typedWriteBitsPack(unsigned int minbits, unsigned int val)
    {
        this->writeBits(3, 4);
        this->writeBitsPack(5, minbits);
        this->writeBitsPack(minbits, val);
    }

    void writeBitsPack(int minbits, unsigned int val)
    {
        unsigned int bitmask;
        int success = 1;
        int one = minbits == 1;
        int measured_bits = count_bits(val);

        if (this->byteAlignedMode)
        {
            this->writeBits(32, val);
            return;
        }
        if (this->errorFlags)
        {
            return;
        }

        for (;;)
        {
            // Produce a minbits long mask that contains all 1's
            bitmask = (1 << minbits) - 1;

            // If the value to be written can be represented by minbits...
            if (val < bitmask || minbits >= 32)
            {
                // Write the value.
                this->writeBits(minbits, val);
                if (success)
                {
                    // g_packetsizes_success[measured_bits]++;
                }
                else
                {
                    // g_packetsizes_failed[measured_bits]++;
                }
                if (one)
                {
                    // g_packetsizes_one[measured_bits]++;
                }
                break;
            }
            this->writeBits(minbits, bitmask);
            minbits <<= 1;
            if (minbits > 32)
                minbits = 32;
            val -= bitmask;
            success = 0;
        }
    }

    unsigned int readBits(int numBits)
    {
        if (errorFlags)
            return 0;
        if (mode != Read)
        {
            assert(0);
            return 0;
        }

        if (byteAlignedMode)
        {
            numBits = ROUND_BITS_UP(numBits);
        }

        if ((cursor.byte << 3) + cursor.bit + numBits > bitLength)
        {
            assert(!"Read off of the end of the bitstream!");
            errorFlags = BSE_OVERRUN;
            return -1;
        }

        unsigned int value = 0;
        int in_bits, curr_shift = 0, bits;

        assert(numBits <= 32);
        if (numBits == 0)
            return 0;

        while (1)
        {
            in_bits = 8 - cursor.bit;
            bits = (numBits < in_bits) ? numBits : in_bits;
            value |= ((data[cursor.byte] >> cursor.bit) & ((1 << bits) - 1)) << curr_shift;
            cursor.bit += bits;
            if (cursor.bit >= 8)
            {
                cursor.bit = 0;
                cursor.byte++;
            }
            curr_shift += bits;
            numBits -= bits;
            if (numBits <= 0)
                break;
        }
        return value;
    }

    void alignByte()
    {
        if (cursor.bit)
        {
            cursor.byte++;
            if (mode == Write)
            {
                if (size < cursor.byte)
                { // Only increase size if cursor matches it, we don't want to increase the size when we're overwriting data in the middle!
                    size++;
                    bitLength += 8 - cursor.bit;
                    data[size] = 0; // Because the data might not be zeroed out to start with?
                }
            }
            cursor.bit = 0;
        }
    }

    unsigned int getBitLength() const
    {
        return bitLength;
    }

    unsigned int getLength() const
    {
        return ((cursor.byte << 3) + cursor.bit) >> 3;
    }

    unsigned int getCursorBitPosition() const
    {
        return (cursor.byte << 3) + cursor.bit;
    }

    void setCursorBitPosition(unsigned int position)
    {
        assert(position <= bitLength);
        cursor.byte = position >> 3;
        cursor.bit = position & 7;
    }

    unsigned int getEndOfStreamPosition() const
    {
        return maxSize * 8;
    }

    void setEndOfStreamPosition(unsigned int position)
    {
        maxSize = position / 8;
    }
    unsigned int getCursorByte() const
    {
        return cursor.byte;
    }
    unsigned int getCursorBit() const
    {
        return cursor.bit;
    }

private:
    unsigned char *data;
    unsigned int maxSize;
    BitStreamMode mode;
    unsigned int byteAlignedMode;
    // unsigned int cursor;
    int errorFlags;

    BitStreamCursor cursor;

    unsigned int size;      // current size of the bitstream stored in "data" (in bytes)
    unsigned int bitLength; // How many bits are there in this stream total? (derived from cursor position when appropriate)

    // Utility functions
    static inline int countBits(unsigned int val)
    {
        int bits = 0;
        do
        {
            val >>= 1;
            ++bits;
        } while (val);
        return bits;
    }
};

int main()
{
    // Example usage of BitStream class
    unsigned char buffer[1472];
    BitStream bitStream(buffer, sizeof(buffer), BitStreamMode::Write, 1);

    bitStream.setByteAlignment(0);       // Use un-aligned mode
    bitStream.typedWriteBitsPack(1, 8);  // pktsendcmd bb 1 7
    bitStream.typedWriteBitsPack(32, 3); // cookie_send
    bitStream.typedWriteBitsPack(32, 1); // equal to last_cookie_recv
    
    // This chain of functions has matching cursor positions as the the C source
    bitStream.typedWriteBitsPack(1, 11159888); // 23 2
    bitStream.typedWriteBitsPack(1, 3);  // list_id 3   24 5
    bitStream.typedWriteBitsPack(1, 16); // cmd 16     26 4
    bitStream.typedWriteBitsPack(1, 1);  //         27 7
    bitStream.typedWriteBitsPack(1, 2);  // 29 2  character container, container_id 2
    

    return 0;
}

EMSCRIPTEN_BINDINGS(bit_stream)
{
    emscripten::class_<BitStream>("BitStream")
        .constructor<unsigned char *, unsigned int, BitStreamMode, unsigned int>()
        .function("setByteAlignment", &BitStream::setByteAlignment)
        .function("getByteAlignment", &BitStream::getByteAlignment)
        .function("writeBits", &BitStream::writeBits)
        .function("readBits", &BitStream::readBits)
        .function("getBitLength", &BitStream::getBitLength)
        .function("getLength", &BitStream::getLength)
        .function("getCursorBitPosition", &BitStream::getCursorBitPosition)
        .function("setCursorBitPosition", &BitStream::setCursorBitPosition)
        .function("getEndOfStreamPosition", &BitStream::getEndOfStreamPosition)
        .function("setEndOfStreamPosition", &BitStream::setEndOfStreamPosition)
        .function("getCursorByte", &BitStream::getCursorByte)
        .function("getCursorBit", &BitStream::getCursorBit)
        .function("typedWriteBitsPack", &BitStream::typedWriteBitsPack)
        .function("writeBitsPack", &BitStream::writeBitsPack)
        .function("alignByte", &BitStream::alignByte);
    emscripten::enum_<BitStreamMode>("BitStreamMode")
        .value("Read", BitStreamMode::Read)
        .value("Write", BitStreamMode::Write);
}

/*/ Binding code
EMSCRIPTEN_BINDINGS(my_class_example) {
  class_<MyClass>("MyClass")
    .constructor<int, std::string>()
    .function("incrementX", &MyClass::incrementX)
    .property("x", &MyClass::getX, &MyClass::setX)
    .property("x_readonly", &MyClass::getX)
    .class_function("getStringFromInstance", &MyClass::getStringFromInstance)
    ;
}
*/