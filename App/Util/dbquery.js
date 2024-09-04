const net = require('net');
const fs = require('fs');

// Define the end marker (as a string or hexadecimal)
const endMarker = '☻�∟☻�∟☻�∟';

// Convert end marker to Buffer
const endMarkerBuffer = Buffer.from(endMarker, 'utf8');

/** Sent to DB to open comms. len: 36
                                 /------\                                  /------\              */
const INITIATE_CONN = '0xf9000000a3740ccef7030800000060c0a05f080c61f8ffffffaba4938c313c0000cdcdcd';

/** ACK recieved from DBServer when it's ready. Len: 20 */
const DB_ACK = '0x8d0000000156002d020000002400000000060000';

/** send to ACK the connection. len: 36 */
const CL_RES = '0xf500000066a607c0f7031000000060c090fd0002000000162c68070c18ca000000cdcdcd'

/** DB is ready. len: 20 */
const DB_READY = '0x90000000028600570400000044000000000e0000';

/** Sent to DB to ACK it's readiness. len: 52 */
const READY_ACK = '0x960100000fe50d4ff7031800000060c090fd0004000000162ce8bf040cdb0f20000000603f000000000086ffffffbfe5764c0000';

/** packet sent by DBServer. Len 36
                      /------\                                   /--*\              /\ */
const x2 = '0x0b0100001d9602760600000064000000000b00000008000000c05f427301000009020018';

// packet sent before DBServer sends character data
const CONT_REQ = '0xd2010000b39d1216f7033000000060c0b0fd000e000000182c58d0bf0c0ca7fd0008000000f6031800000060f8ffffff7fa58b033094e1cc10860200';
//                          |------|                                                                                    |--|            |--|
const CHAR_REQ = '0xd2010000af3211a4f7033000000060c0b0fd000e000000182c58d0bf0c0ca7fd0008000000f6031800000060f8ffffff7fa51b023094e1cc10860100';

class DBQuery {
    /**
     * Function to handle the communication
     */
    static communicate2() {
        let PACKET_SIZE = 20;
        // Create a client socket for port 6997
        const client = new net.Socket();
        let charOutput = '';

        // Connect to the server on port 6997
        client.connect(6997, '127.0.0.1', () => {
            console.log('Connected to server on port 6997');

            // send initiate comms packet
            const packet = DBQuery.hexToBuffer(INITIATE_CONN);
            client.write(packet);
            console.log(`Sent initialise connection!`);
        });

        // Buffer to handle incoming data
        let buffer = Buffer.alloc(0);
        let readyforChar = false;

        client.on('data', (data) => {
            // Append new data to the buffer
            buffer = Buffer.concat([buffer, data]);
            let packet;
            // Process incoming packets
            while (buffer.length > 0) {
                if (buffer.length >= PACKET_SIZE && !readyforChar) {
                    packet = buffer.slice(0, PACKET_SIZE);
                    buffer = buffer.slice(PACKET_SIZE);
                    //console.log(`Received packet: ${packet.toString('hex')} : ${packet.toString()}`);
                } else if (buffer.length >= PACKET_SIZE) {
                    packet = buffer.slice(0, PACKET_SIZE);
                    buffer = buffer.slice(PACKET_SIZE);
                    //console.log(`Received packet...`);
                } else {
                    // Wait for more data to form a complete packet
                    break;
                }

                packet = buffer.slice(0, PACKET_SIZE);
                if (!readyforChar) {
                    if (packet.toString('hex') === DB_ACK.substring(2)) {
                        console.log(`Received DB_ACK: ${packet.toString('hex')} : ${packet.toString()}`);
                        let responseBuffer = DBQuery.hexToBuffer(CL_RES);
                        client.write(responseBuffer);
                        console.log(`***** Sent CL_RES!`);
                        PACKET_SIZE = 20;
                    }
                    if (packet.toString('hex') === DB_READY.substring(2)) {
                        console.log(`Received DB_ACK: ${packet.toString('hex')} : ${packet.toString()}`);
                        let responseBuffer = DBQuery.hexToBuffer(READY_ACK);
                        client.write(responseBuffer);
                        console.log(`***** Sent READY_ACK!`);
                        PACKET_SIZE = 36;
                    }

                    if (buffer.length > 36) {
                        // Prepare a new response packet
                        let responseBuffer = DBQuery.hexToBuffer(CONT_REQ);

                        // Send the new packet
                        client.write(responseBuffer);
                        //console.log(`Sent response: ${responseBuffer.toString('hex')} : ${responseBuffer.toString()}`);

                        console.log(`***** Sent for Char data!`);
                        PACKET_SIZE = 1200;
                        readyforChar = true;
                    }
                }

                if (readyforChar) { /* buffer.length > 1250  */
                    const str = buffer.toString();
                    charOutput += str;
                    console.log(`> ${str} <<<<EOP`);
                    //PACKET_SIZE = 20;
                    if (buffer.toString('hex').startsWith("90000000")) {
                        console.log("**** end packet found");
                        PACKET_SIZE = 20;
                    }
                }
                // Check if the end marker is in the buffer
                if (DBQuery.containsEndMarker(buffer)) {
                    // Extract data up to the end marker
                    const markerIndex = buffer.indexOf(endMarkerBuffer);
                    const dataUpToMarker = buffer.slice(0, markerIndex + endMarkerBuffer.length);

                    console.log('Received data up to end marker:', dataUpToMarker.toString('utf8'));

                    // Optionally remove the data up to and including the end marker
                    buffer = buffer.slice(markerIndex + endMarkerBuffer.length);

                    buffer = Buffer.alloc(0);
                    readyforChar = false;
                    //client.destroy();
                    console.log(`***** Char data:\n${charOutput}`);

                    // Process or handle the dataUpToMarker as needed
                    break;
                }
            }
        });

        client.on('error', (err) => {
            console.error(`Error: ${err.message}`);
        });

        client.on('close', () => {
            console.log('Connection closed');
        });
    }

    static communicate() {
        let PACKET_SIZE = 20;
        const client = new net.Socket();
        let charOutput = '';
        let buffer = Buffer.alloc(0);
        let readyforChar = false;
        let firstPacket = false;
        const endMarkerHex = '0x7330315b305d2e6331373633';//'0x0200b01c0200b01c0200b01c0200b01c'; '0x7330315b305d2e633137363320320a00'
        const endMarkerBuffer = this.hexToBuffer(endMarkerHex);

        client.connect(6997, '127.0.0.1', () => {
            console.log('Connected to server on port 6997');
            const packet = DBQuery.hexToBuffer(INITIATE_CONN);
            client.write(packet);
            console.log('Sent initialise connection!');
        });

        client.on('data', (data) => {
            buffer = Buffer.concat([buffer, data]);

            if (readyforChar) {

                // Process data in chunks of up to 1252 bytes
                while (buffer.length >= 1200) {
                    // Extract a packet of size 1252 bytes
                    PACKET_SIZE = 1252;
                    const packet = firstPacket ? buffer.slice(0, PACKET_SIZE) : buffer.slice(0, 1488); //after the first packet: buffer.slice(0,1247)

                    // Log the size of the received packet
                    console.log(`Received packet of size: ${packet.length}`);
                    let str = packet.toString()

                    let index = DBQuery.findHexSequenceAtEnd(str, "73325b00");
                    if (index === -1) { index = DBQuery.findHexSequenceAtEnd(str, '003631'); }
                    if (index === -1) { index = DBQuery.findHexSequenceAtEnd(str, '00325b00'); }
                    if (index === -1) { index = DBQuery.findHexSequenceAtEnd(str, '005b00'); }

                    if (str.includes("AuthId")) {
                        str = str.substring(str.indexOf("AuthId")).slice(0, -1);
                        // Update the buffer to remove the processed packet
                        buffer = buffer.slice(1488);
                        firstPacket = true;
                        charOutput += str;
                    } else {
                        buffer = buffer.slice(PACKET_SIZE);
                        str = str.charCodeAt(str.length - 1) === 0 ? str.slice(18, index) : str.slice(18);
                        const dblNullIdx = DBQuery.findLastDoubleNullIndex(str);
                        str = str.substring(dblNullIdx);
                        str = str.replace(/^\x00+/, '').replace(/\x00+$/, '');
                        charOutput += str;
                    }

                    // Add the packet data to charOutput
                    //charOutput += str; //str.slice(21,-4)

                    // Optionally check if the end marker is found in the remaining buffer
                    let markerIndex = buffer.indexOf(endMarkerBuffer);
                    if (markerIndex !== -1) {
                        // Extract data up to but not including the end marker
                        charOutput += buffer.slice(0, markerIndex).toString();
                        buffer = buffer.slice(markerIndex + endMarkerBuffer.length);

                        // Save charOutput to a file
                        DBQuery.saveToFile('output.txt', charOutput);

                        // Close the connection
                        client.destroy();
                        console.log('Connection closed after receiving end marker.');
                        return;
                    }
                }

                // If buffer is less than 1252 bytes and no end marker, wait for more data
                return;
            } else {
                // Process communication data packets
                while (buffer.length >= PACKET_SIZE) {
                    const packet = buffer.slice(0, PACKET_SIZE);
                    buffer = buffer.slice(PACKET_SIZE);

                    if (packet.toString('hex') === DB_ACK.substring(2)) {
                        console.log(`Received DB_ACK: ${packet.toString('hex')} : ${packet.toString()}`);
                        const responseBuffer = DBQuery.hexToBuffer(CL_RES);
                        client.write(responseBuffer);
                        console.log('***** Sent CL_RES!');
                        PACKET_SIZE = 20;
                    } else if (packet.toString('hex') === DB_READY.substring(2)) {
                        console.log(`Received DB_READY: ${packet.toString('hex')} : ${packet.toString()}`);
                        const responseBuffer = DBQuery.hexToBuffer(READY_ACK);
                        client.write(responseBuffer);
                        console.log('***** Sent READY_ACK!');
                        PACKET_SIZE = 36;
                    }

                    if (buffer.length >= 36) {
                        const responseBuffer = DBQuery.hexToBuffer(CONT_REQ); // TODO: update variable to make it dynamic with the request
                        client.write(responseBuffer);
                        console.log('***** Sent for Char data!');
                        PACKET_SIZE = 1252;
                        readyforChar = true;
                    }
                }
            }
        });

        client.on('error', (err) => {
            console.error(`Error: ${err.message}`);
        });

        client.on('close', () => {
            console.log('Connection closed');
        });
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

    static containsEndMarker(buffer) {
        // Convert the buffer to a string for easier searching
        const dataString = buffer.toString('utf8');
        return dataString.includes(endMarker);
    }

    static saveToFile(filename, data) {
        fs.writeFile(filename, data, (err) => {
            if (err) {
                console.error(`Failed to write to file: ${err.message}`);
            } else {
                console.log(`Data successfully written to ${filename}`);
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
}

module.exports = DBQuery;