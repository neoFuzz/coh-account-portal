//const BitStream = require("./bitstream/bit-stream.js");
//import bitstream from "./bitstream/bit-stream.js";
const { BitStream, BitStreamMode } = require('bit-stream');

//const Bitstream = require("./bitstream/pkg/bitstream.js"); // working

/**
 * @class Packet
 * @description Represents a packet in the game protocol.
 */
class Packet {
    constructor(bufferSize, size = 0) {
        this.UID = 0;                      // Unique across all links (for debugging purposes only)
        this.id = 0;                       // Unique across a single link

        this.reliable = false;             // 1-bit flag
        this.hasDebugInfo = false;         // 1-bit flag
        this.compress = false;             // 1-bit flag (packet should be compressed)
        this.creationTime = 0;
        this.size = bufferSize;

        this.stream = null; // BitStream equivalent in JS, likely a buffer or similar stream structure
    }

    /**
     * 
     * @param {number} list_id 
     * @param {number} container_id 
     * @param {number} cmd 
     * @param {number} cb_func 
     */
    dbAsyncContainerRequest(list_id, container_id, cmd, cb_func) {
        let pak = this;

        pak.hasDebugInfo = true;

        pak.stream.setByteAlignment(0);

        pak.stream.typedWriteBitsPack(1, 8); // pktsendcmd 1 7

        pak.stream.typedWriteBits(32, 3); // cookie_send
        pak.stream.typedWriteBits(32, 1); // equal to last_cookie_recv

        // This chain of functions has matching cursor positions as the the C source
        pak.stream.typedWriteBitsPack(1, cb_func); //     23 2 > 11159888
        pak.stream.typedWriteBitsPack(1, list_id); // 3   24 5
        pak.stream.typedWriteBitsPack(1, cmd);     // 16  26 4
        pak.stream.typedWriteBitsPack(1, 1);       //     27 7
        pak.stream.typedWriteBitsPack(1, container_id);// 29 2  character container, like 2
    }

    initBitStream(data) {
        this.stream = new BitStream(data, this.size, BitStreamMode.Write, 1);
    }
}

module.exports = Packet;
