const BitStream = require('./BitStream');

function timerCpuTicks() {
    const hrTime = process.hrtime(); // [seconds, nanoseconds]
    const ticks = (hrTime[0] * 1e9 + hrTime[1]) & 0xffffffff; // Convert to nanoseconds and mask to 32-bit
    return ticks;
}

/**
 * @class Packet
 * @description Represents a packet in the game protocol.
 */
class Packet {
    constructor(bufferSize, size = 0) {
        this.UID = 0;                      // Unique across all links (for debugging purposes only)
        this.id = 0;                       // Unique across a single link
        this.truncatedID = 0;

        this.reliable = false;             // 1-bit flag
        this.hasDebugInfo = false;         // 1-bit flag
        this.inRetransmitQueue = false;    // 1-bit flag
        this.inSendQueue = false;          // 1-bit flag (for debugging only)
        this.compress = false;             // 1-bit flag (packet should be compressed)
        this.ordered = false;              // 1-bit flag (packet will be handled in order)
        this.ordered_id = 0;

        this.sib_id = 0;
        this.sib_count = 0;
        this.sib_partnum = 0;

        this.xferTime = 0;
        this.creationTime = 0;
        this.retransCount = 0;

        this.checksum = 0;
        this.stream = new BitStream(0, { byte: 0, bit: 0 }, bufferSize, size, 0, 0); // BitStream equivalent in JS, likely a buffer or similar stream structure
        this.userData = null;              // Reference to any object or data in JS
        this.delUserDataCallback = null;   // Function reference for cleanup
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

        // The line below assumes casting a function pointer (cb_func) to a 32-bit value
        // JavaScript does not have function pointers, so this needs to be handled based on your design
        //pktSendBitsPack(pak, 1, cb_func ? cb_func : 0);  // Handle cb_func appropriately
        /* 
        pktCreateEx(cmd=8) -> pktCreateImp -^ init, pv5 and buffer added
            pktSendCmd(link, pak, 8); x
                pktSendBitsPack(pak,1,8);
                pktSendBits(pak,32,3);
                pktSendBits(pak,32,1);
            -^
            
        */

        //BitStream.pktSendBitsPack(pak, 1, 1116643494);
        //BitStream.pktSendBitsPack(pak, 1, 0);
        pak.stream.byteAlignedMode = 0;

        BitStream.pktSendBitsPack(pak, 1, 8); // pktsendcmd

        BitStream.pktSendBits(pak, 32, 3); // cookie_send
        BitStream.pktSendBits(pak, 32, 1); // equal to last_cookie_recv

        //BitStream.pktSendBitsPack(pak, 1, '\x05'); // net version /ba =0

        BitStream.pktSendBitsPack(pak, 1, 11659888);
        BitStream.pktSendBitsPack(pak, 1, list_id); //3
        BitStream.pktSendBitsPack(pak, 1, cmd); // 16
        BitStream.pktSendBitsPack(pak, 1, 1);  // Assuming this constant is needed in JS too
        BitStream.pktSendBitsPack(pak, 1, container_id); // character container, like 2
    }
}

module.exports = Packet;
