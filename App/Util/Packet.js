//const BitStream = require("./bitstream/bit-stream.js");
//import bitstream from "./bitstream/bit-stream.js";
//const  BitStream  = require('bit-stream');
const Bitstream = require("./bitstream/pkg/bitstream.js");

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
        /* 
        pktCreateEx(cmd=8) -> pktCreateImp -^ init, pv5 and buffer added
            pktSendCmd(link, pak, 8); x
                pktSendBitsPack(pak,1,8);
                    typedWrite
                        writebits 3,4 -> writebitspack 5,1 -> wbp 1,8
                bit 1 byte 7
                pktSendBits(pak,32,3); 8 1
                pktSendBits(pak,32,1); 14 3
            -^
            
        */
        pak.hasDebugInfo = true;

        pak.stream.set_byte_aligned_mode(0);
        //pak.stream.pkt_send_bits_pack(8, 254, true);
        //pak.stream.pkt_send_bits(1, 1, pak.hasDebugInfo);

        pak.stream.pkt_send_bits_pack(1, 8, pak.hasDebugInfo); // pktsendcmd bb 1 7

        pak.stream.pkt_send_bits(32, 3, pak.hasDebugInfo); // cookie_send
        pak.stream.pkt_send_bits(32, 1, pak.hasDebugInfo); // equal to last_cookie_recv

        // This chain of functions has matching cursor positions as the the C source
        pak.stream.pkt_send_bits_pack(1, cb_func, pak.hasDebugInfo); // 23 2 > 11159888
        pak.stream.pkt_send_bits_pack(1, list_id, pak.hasDebugInfo); //3   24 5
        pak.stream.pkt_send_bits_pack(1, cmd, pak.hasDebugInfo); // 16     26 4
        pak.stream.pkt_send_bits_pack(1, 1, pak.hasDebugInfo);  //         27 7
        pak.stream.pkt_send_bits_pack(1, container_id, pak.hasDebugInfo);//29 2  character container, like 2
    }

    async initBitStream() {
        const xmodule = await Bitstream();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for initialization
        const buffer = new Uint8Array(4);

        const bufferPointer = xmodule._malloc(buffer.length);
        xmodule.HEAPU8.set(buffer, bufferPointer);

        this.stream = new xmodule.BitStream(buffer, this.size, xmodule.BitStreamMode.Write, 1);
    }
}

module.exports = Packet;
