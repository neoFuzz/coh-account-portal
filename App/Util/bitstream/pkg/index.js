
const bsModule = require('./bitstream.js');

const wasmModule = new bsModule();

// Export functions only when WASM is ready
module.exports = {
  BitStream: wasmModule.BitStream,
  BitStreamMode: wasmModule.BitStreamMode,
};