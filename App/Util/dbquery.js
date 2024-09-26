const net = require('net');
const fs = require('fs');
const Packet = require("./Packet");
//const BitStream = require('bit-stream');

/** Sent to DB to open comms. len: 36 */
const INITIATE_CONN = '0xb1000000419805420200000000f9ffffff5369153c3c000000000000';

/** ACK recieved from DBServer when it's ready. Len: 20 */
const DB_ACK = '0x8d0000000156002d020000002400000000060000';

/** send to ACK the connection. len: 36 */
const CL_RES = '0x90000000028600570400000044000000000e0000'

// packet sent before DBServer sends character data /con 3
const CONT_REQ = '0xfe000000649207f40a00000000a70100008000000080ffffffffa75c0a40cf2900000000'; // packet data sent to DBServer containing request for container 3 (character)
//                  fe000000670a08350a00000000a70100008000000080ffffffffa79c1b40cf1900000000
//                          |------------------|                                            |--------------|
//nst char_req = '0x260100007ce508520c0000001c0a00000000270200008001000080ffffffffa7dc3640cf2900080000000000'//cont 3
/**
 * Class to handle DBQuery requests to the CoH DBServer
 */
class DBQuery {
    static cpacket_test(containerId) {
        let pak = new Packet(36,0);
        BitStream.init_bit_stream(pak.stream, Buffer.from('0'), 1472, 1, 1);
        pak.hasDebugInfo = 1;
        pak.reliable = 1; // not required but just in case
        pak.creationTime = Date.now();
        pak.dbAsyncContainerRequest(3, containerId, 16, null);

        const responseBuffer = Buffer.from(pak.stream.get_data_array());// DBQuery.hexToBuffer(CONT_REQ); // TODO: update variable to make it dynamic with the request
        console.log(`Node: 0x${responseBuffer.toString('hex')}\nCsrc: ${CONT_REQ}`)
    }

    /**
     * Function to handle the communication with DBServer
     */
    static communicate(containerId) {
        let PACKET_SIZE = 20;
        const client = new net.Socket();
        let charOutput = '';
        let buffer = Buffer.alloc(0);
        let readyforChar = false;
        let firstPacket = false;
        const endMarkerHex = '0xcba16a0000b01c'; // potential end markers '0x0200b01c0200b01c' '0x0200b01c0200b01c0200b01c0200b01c'; '0x7330315b305d2e633137363320320a00'
        const endMarkerBuffer = this.hexToBuffer(endMarkerHex);

        client.connect(6997, process.env.DBSERVER, () => {
            global.appLogger.info('DBQuery: Connected on port 6997');
            const packet = DBQuery.hexToBuffer(INITIATE_CONN);
            client.write(packet);
            global.appLogger.debug('DBQuery: Sent initialise packet!');
        });

        client.on('data', (data) => {
            buffer = Buffer.concat([buffer, data]);

            if (readyforChar) {
                // Process data in chunks of 1200 bytes or larger. The buffer ends up full at some point.
                while (buffer.length >= 1200) {
                    // Extract a packet of size 1252 bytes
                    PACKET_SIZE = 1252;
                    const packet = firstPacket ? buffer.slice(0, PACKET_SIZE) : buffer.slice(0, 1488);
                    let str = packet.toString()
                    let index = DBQuery.findDataEndings(str);

                    // Optionally check if the end marker is found in the remaining buffer
                    let markerIndex = buffer.indexOf(endMarkerBuffer);

                    ({ str, buffer, firstPacket, charOutput } = DBQuery.processPacket(
                        str, buffer, firstPacket, charOutput, PACKET_SIZE, index
                    ));

                    if (markerIndex !== -1) {
                        // cleans up a weird sequence in the data
                        charOutput = charOutput.replace(/\x00.*?a/g, '');

                        // Clean up the garbage data at the end
                        charOutput = charOutput.slice(0, charOutput.indexOf('\x0a\x00'));
                        buffer = buffer.slice(markerIndex + endMarkerBuffer.length); // Empties buffer

                        console.log("Character retrived: " + charOutput.substring(charOutput.indexOf("\nName"), charOutput.indexOf("\nName") + 20));

                        // Save charOutput to a file
                        DBQuery.saveToFile('output.txt', charOutput);

                        // Close the connection
                        client.destroy();
                        global.appLogger.info('DBQuery: Connection closed after receiving end marker.');
                        return;
                    }
                }

                // If buffer is less than 1252 bytes and no end marker, wait for more data
                //return;
            } else {
                // Process communication data packets
                while (buffer.length >= PACKET_SIZE) {
                    const packet = buffer.slice(0, PACKET_SIZE);
                    buffer = buffer.slice(PACKET_SIZE);

                    if (packet.toString('hex') === DB_ACK.substring(2)) {
                        global.appLogger.debug(`DBQuery: Received DB_ACK`);
                        const responseBuffer = DBQuery.hexToBuffer(CL_RES);
                        client.write(responseBuffer);
                        global.appLogger.debug('DBQuery: Sent CL_RES!');
                        PACKET_SIZE = 20;
                    }

                    if (buffer.length >= 20) {

                        let pak = new Packet(36);
                        BitStream.init_bit_stream(pak.stream, Buffer.from("\x00"), 1472, 1, 1);
                        pak.hasDebugInfo = 1;
                        pak.reliable = 1; // not required but just in case
                        pak.creationTime = Date.now();
                        pak.dbAsyncContainerRequest(3, containerId, 16, null);

                        const responseBuffer = Buffer.from(pak.stream.to_hex_string());// DBQuery.hexToBuffer(CONT_REQ); // TODO: update variable to make it dynamic with the request
                        console.log(`Node: 0x${responseBuffer.toString()}\nCsrc: ${CONT_REQ}`)
                        client.write(responseBuffer);
                        global.appLogger.info('DBQuery: Sent for Character data!');
                        PACKET_SIZE = 1252;
                        readyforChar = true;
                    }
                }
            }
        });

        client.on('error', (err) => {
            global.appLogger.error(`DBQuery: ${err.message}`);
        });

        client.on('close', () => {
            global.appLogger.info('DBQuery: Connection closed');
        });
    }

    /**
     * Function to process the received packet data
     *
     * @param {string} str - The packet data as a string
     * @param {Buffer} buffer - The remaining buffer data
     * @param {boolean} firstPacket - Flag indicating if it's the first packet
     * @param {string} charOutput - The accumulated character output
     * @param {number} PACKET_SIZE - The size of the packet
     * @param {number} index - The index of the data ending
     * @returns {Object} An object containing the updated values
     */
    static processPacket(str, buffer, firstPacket, charOutput, PACKET_SIZE, index) {
        if (str.includes("AuthId")) {
            str = str.substring(str.indexOf("AuthId")).slice(0, -1);
            buffer = buffer.slice(1488); // Update the buffer to remove the processed packet
            firstPacket = true;
            charOutput += str; // Add the packet data to charOutput
        } else {
            buffer = buffer.slice(PACKET_SIZE);
            str = str.charCodeAt(str.length - 1) === 0 ? str.slice(18, index) : str.slice(18);
            const dblNullIdx = this.findLastDoubleNullIndex(str);
            str = str.substring(dblNullIdx);
            str = str.replace(/^\x00+/, '').replace(/\x00+$/, '');
            charOutput += str; // Add the packet data to charOutput
        }
        return { str, buffer, firstPacket, charOutput };
    }

    /**
     * Function to convert a hex string to a Buffer
     * 
     * @param {string} hexString - The hex string to convert
     * @returns {Buffer} The converted Buffer
     */
    static hexToBuffer(hexString) {
        // Remove '0x' prefix if present
        if (hexString.startsWith('0x')) {
            hexString = hexString.slice(2);
        }
        // Ensure the hex string is even-length
        if (hexString.length % 2 !== 0) {
            hexString = '0' + hexString;
        }
        // Convert hex string to Buffer
        return Buffer.from(hexString, 'hex');
    }

    /**
     * Converts a Buffer to a hexadecimal string.
     * @param {Buffer} buffer - The buffer to convert.
     * @returns {string} - The hexadecimal string representation of the buffer.
     */
    static bufferToHex(buffer) {
        return buffer.toString('hex');
    }

    /**
     * Saves the given data to a file with the specified filename.
     * @param {string} filename - The name of the file to save the data to.
     * @param {string} data - The data to save to the file.
     */
    static saveToFile(filename, data) {
        fs.writeFile(filename, data, (err) => {
            if (err) {
                global.appLogger.error(`DBQuery: Failed to write to file: ${err.message}`);
            } else {
                global.appLogger.info(`DBQuery: Data successfully written to ${filename}`);
            }
        });
    }

    /**
     * Finds the last occurrence of two consecutive null characters (0x00 0x00) in a given string.
     * @param {string} str - The input string to search.
     * @returns {number} - The index of the last occurrence of two consecutive null characters, or -1 if not found.
     */
    static findLastDoubleNullIndex(str) {
        // Ensure we only work with the first 27 characters
        const substring = str.slice(0, 27);

        // Create a regular expression to find two consecutive null characters (0x00 0x00)
        const regex = /(\x00\x00)(?!.*(\x00\x00))/g;

        // Find all matches
        let match;
        let lastIndex = -1;
        while ((match = regex.exec(substring)) !== null) {
            lastIndex = match.index; // Update the index to the last match
        }

        return lastIndex;
    }

    /**
     * Finds the index of the given hex sequence at the end of the string.
     * 
     * @param {string} str - The input string to search.
     * @param {string} hexSequence - The hex sequence to find.
     * @returns {number} - The index of the hex sequence at the end of the string, or -1 if not found.
     */
    static findHexSequenceAtEnd(str, hexSequence) {
        // Convert hex sequence to a regular expression pattern
        const pattern = hexSequence.match(/.{1,2}/g).map(b => `\\x${b}`).join('');

        // Create a regex to match the hex sequence at the end of the string
        const regex = new RegExp(`${pattern}$`, 'i'); // '$' ensures it matches at the end

        // Execute the regex on the string
        const match = regex.exec(str);

        if (match) {
            // Return the index where the sequence starts if found
            return str.length - match[0].length;
        } else {
            return -1; // Sequence not found at the end
        }
    }

    /**
     * Finds the index of the end marker in the given string.
     * @param {string} string - The input string to search.
     * @returns {number} - The index of the end marker, or -1 if not found.
     */
    static findDataEndings(string) {
        let index = -1;
        index = DBQuery.findHexSequenceAtEnd(string, "73325b00");
        if (index === -1) { index = DBQuery.findHexSequenceAtEnd(string, '003631'); }
        if (index === -1) { index = DBQuery.findHexSequenceAtEnd(string, '00325b00'); }
        if (index === -1) { index = DBQuery.findHexSequenceAtEnd(string, '005b00'); }
        return index;
    }
}

module.exports = DBQuery;