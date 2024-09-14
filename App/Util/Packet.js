const { BitStream } = require('bit-stream');

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

        this.stream = new BitStream(0, bufferSize, 1472); // BitStream equivalent in JS, likely a buffer or similar stream structure
        this.userData = null;              // Reference to any object or data in JS
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
        pak.hasDebugInfo = true;
        //BitStream.pktSendBitsPack(pak, 1, 1116643494);
        //BitStream.pktSendBitsPack(pak, 1, 0);
        pak.stream.pkt_send_bits(1, 1, pak.hasDebugInfo);
        pak.stream.set_byte_aligned_mode(0);
        //pak.stream.pkt_send_bits(32, 1116643494, false);

        pak.stream.pkt_send_bits_pack(1, 8, pak.hasDebugInfo); // pktsendcmd

        pak.stream.pkt_send_bits(32, 3, pak.hasDebugInfo); // cookie_send
        pak.stream.pkt_send_bits(32, 1, pak.hasDebugInfo); // equal to last_cookie_recv

        //pak.stream.pkt_send_bits(1, 5, pak.hasDebugInfo);
        //BitStream.pktSendBitsPack(pak, 1, '\x05'); // net version /ba =0

        pak.stream.pkt_send_bits_pack(1, 11659888, pak.hasDebugInfo);
        pak.stream.pkt_send_bits_pack(1, list_id, pak.hasDebugInfo); //3
        pak.stream.pkt_send_bits_pack(1, cmd, pak.hasDebugInfo); // 16
        pak.stream.pkt_send_bits_pack(1, 1, pak.hasDebugInfo);  // Assuming this constant is needed in JS too
        pak.stream.pkt_send_bits_pack(1, container_id, pak.hasDebugInfo); // character container, like 2
    }
}

module.exports = Packet;
