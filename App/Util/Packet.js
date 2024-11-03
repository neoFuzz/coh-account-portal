//const Bitstream = require("./bitstream/pkg/bitstream.js"); // working
const { BitStream, BitStreamMode } = require('bit-stream');

/**
 * Represents a packet in the game protocol.
 * 
 * @typedef {Object} Packet
 * @property {number} UID - Unique across all links (for debugging purposes only)
 * @property {number} id - Unique across a single link
 * @property {boolean} reliable - 1-bit flag
 * @property {boolean} hasDebugInfo - 1-bit flag
 * @property {boolean} compress - 1-bit flag (packet should be compressed)
 * @property {number} creationTime - Timestamp of packet creation
 * @property {number} size - Size of the packet
 * @property {BitStream} stream - BitStream equivalent in JS, likely a buffer or similar stream structure
 * 
 * @class Packet
 */
class Packet {
    /**
     * Initializes a new instance of the Packet class.
     * 
     * @param {number} bufferSize - Size of the packet buffer
     * @param {number} size - Size of the packet
     */
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
     * Sends a container request to the database.
     * 
     * @param {number} list_id - The ID of the list to retrieve
     * @param {number} container_id - The ID of the container to retrieve
     * @param {number} cmd - The packet command to execute 
     * @param {number} cb_func - The callback function to execute
     * @returns {void}
     */
    dbAsyncContainerRequest(list_id, container_id, cmd, cb_func) {
        let pak = this;

        pak.hasDebugInfo = true;

        pak.stream.setByteAlignment(0);
        pak.stream.typedWriteBits(28, 0);

        pak.stream.typedWriteBitsPack(1, 8); // pktsendcmd 1 7
        pak.stream.typedWriteBits(1, 0);

        pak.stream.typedWriteBits(32, 3); // cookie_send
        pak.stream.typedWriteBits(32, 1); // equal to last_cookie_recv

        // This chain of functions has matching cursor positions as the the C source
        pak.stream.typedWriteBitsPack(1, cb_func); //     23 2 > 11159888
        pak.stream.typedWriteBitsPack(1, list_id); // 3   24 5
        pak.stream.typedWriteBitsPack(1, cmd);     // 16  26 4
        pak.stream.typedWriteBitsPack(1, 0);       //     27 7
        pak.stream.typedWriteBitsPack(1, container_id);// 29 2  character container, like 2

        pak.stream.typedWriteBits(1, 0);

    }

    /**
     * Initializes the BitStream with the given data.
     * 
     * @param {number[]} data - The data to initialize the BitStream with
     * @returns {void}
     */
    initBitStream(data) {
        this.stream = new BitStream(data, this.size, BitStreamMode.Write, 1);
    }
}

module.exports = Packet;