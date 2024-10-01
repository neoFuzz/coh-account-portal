
var Module = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;
  if (typeof __filename != 'undefined') _scriptName = _scriptName || __filename;
  return (
function(moduleArg = {}) {
  var moduleRtn;

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
var readyPromise = new Promise((resolve, reject) => {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});
["_memory","___indirect_function_table","onRuntimeInitialized"].forEach((prop) => {
  if (!Object.getOwnPropertyDescriptor(readyPromise, prop)) {
    Object.defineProperty(readyPromise, prop, {
      get: () => abort('You are getting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
      set: () => abort('You are setting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
    });
  }
});

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = true;
var ENVIRONMENT_IS_SHELL = false;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
}

if (ENVIRONMENT_IS_NODE) {
  // `require()` is no-op in an ESM module, use `createRequire()` to construct
  // the require()` function.  This is only necessary for multi-environment
  // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
  // TODO: Swap all `require()`'s with `import()`'s?

}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  if (typeof process == 'undefined' || !process.release || process.release.name !== 'node') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  var nodeVersion = process.versions.node;
  var numericVersion = nodeVersion.split('.').slice(0, 3);
  numericVersion = (numericVersion[0] * 10000) + (numericVersion[1] * 100) + (numericVersion[2].split('-')[0] * 1);
  var minVersion = 160000;
  if (numericVersion < 160000) {
    throw new Error('This emscripten-generated code requires node v16.0.0 (detected v' + nodeVersion + ')');
  }

  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('fs');
  var nodePath = require('path');

  scriptDirectory = __dirname + '/';

// include: node_shell_read.js
readBinary = (filename) => {
  // We need to re-wrap `file://` strings to URLs. Normalizing isn't
  // necessary in that case, the path should already be absolute.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  var ret = fs.readFileSync(filename);
  assert(ret.buffer);
  return ret;
};

readAsync = (filename, binary = true) => {
  // See the comment in the `readBinary` function.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filename, binary ? undefined : 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(binary ? data.buffer : data);
    });
  });
};
// end include: node_shell_read.js
  if (!Module['thisProgram'] && process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, '/');
  }

  arguments_ = process.argv.slice(2);

  // MODULARIZE will export the module in the proper place outside, we don't need to export here

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

} else
if (ENVIRONMENT_IS_SHELL) {

  if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof importScripts == 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
{
  throw new Error('environment detection error');
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used.
moduleOverrides = null;
checkIncomingModuleAPI();

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];legacyModuleProp('arguments', 'arguments_');

if (Module['thisProgram']) thisProgram = Module['thisProgram'];legacyModuleProp('thisProgram', 'thisProgram');

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] == 'undefined', 'Module.read option was removed');
assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
legacyModuleProp('asm', 'wasmExports');
legacyModuleProp('readAsync', 'readAsync');
legacyModuleProp('readBinary', 'readBinary');
legacyModuleProp('setWindowTitle', 'setWindowTitle');
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

assert(!ENVIRONMENT_IS_WEB, 'web environment detected but not enabled at build time.  Add `web` to `-sENVIRONMENT` to enable.');

assert(!ENVIRONMENT_IS_WORKER, 'worker environment detected but not enabled at build time.  Add `worker` to `-sENVIRONMENT` to enable.');

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary = Module['wasmBinary'];legacyModuleProp('wasmBinary', 'wasmBinary');

if (typeof WebAssembly != 'object') {
  err('no native wasm support detected');
}

// include: base64Utils.js
// Converts a string of base64 into a byte array (Uint8Array).
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE != 'undefined' && ENVIRONMENT_IS_NODE) {
    var buf = Buffer.from(s, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
  }

  var decoded = atob(s);
  var bytes = new Uint8Array(decoded.length);
  for (var i = 0 ; i < decoded.length ; ++i) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}
// end include: base64Utils.js
// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.

// Memory management

var HEAP,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

// include: runtime_shared.js
function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
}

// end include: runtime_shared.js
assert(!Module['STACK_SIZE'], 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')

assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
assert(!Module['INITIAL_MEMORY'], 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  
if (!Module['noFSInit'] && !FS.initialized)
  FS.init();
FS.ignorePermissions = false;

TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(() => {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err(`dependency: ${dep}`);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */
var isDataURI = (filename) => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');
// end include: URIUtils.js
function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

// include: runtime_exceptions.js
// end include: runtime_exceptions.js
function findWasmBinary() {
    var f = 'data:application/octet-stream;base64,AGFzbQEAAAABrwREYAF/AX9gAn9/AX9gAn9/AGADf39/AX9gAX8AYAABf2ADf39/AGAGf39/f39/AX9gAABgBH9/f38AYAV/f39/fwF/YAZ/f39/f38AYAR/f39/AX9gCH9/f39/f39/AX9gBX9/f39/AGAHf39/f39/fwBgB39/f39/f38Bf2AFf35+fn4AYAABfmAKf39/f39/f39/fwBgA39+fwF+YAV/f39/fgF/YAR/f39/AX5gBn9/f39+fwF/YAd/f39/f35+AX9gBX9/fn9/AGAEf35+fwBgCn9/f39/f39/f38Bf2AGf39/f35+AX9gBH5+fn4Bf2ACfH8BfGAEf39/fgF+YAZ/fH9/f38Bf2ACfn8Bf2ADf39/AX5gAn9/AX1gAn9/AXxgA39/fwF9YAN/f38BfGAMf39/f39/f39/f39/AX9gBX9/f398AX9gBn9/f398fwF/YAd/f39/fn5/AX9gC39/f39/f39/f39/AX9gD39/f39/f39/f39/f39/fwBgCH9/f39/f39/AGANf39/f39/f39/f39/fwBgAn9+AX9gAn9+AGACf30AYAJ/fABgAn5+AX9gA39+fgBgAn9/AX5gAn5+AX1gAn5+AXxgA39/fgBgA35/fwF/YAF8AX5gAn5/AX5gAX8BfmAGf39/fn9/AGAEf39+fwF+YAZ/f39/f34Bf2AIf39/f39/fn4Bf2AJf39/f39/f39/AX9gBX9/f35+AGAEf35/fwF/ArEGGwNlbnYWX2VtYmluZF9yZWdpc3Rlcl9jbGFzcwAuA2Vudg1fX2Fzc2VydF9mYWlsAAkDZW52FV9lbWJpbmRfcmVnaXN0ZXJfZW51bQAJA2VudhtfZW1iaW5kX3JlZ2lzdGVyX2VudW1fdmFsdWUABgNlbnYiX2VtYmluZF9yZWdpc3Rlcl9jbGFzc19jb25zdHJ1Y3RvcgALA2Vudh9fZW1iaW5kX3JlZ2lzdGVyX2NsYXNzX2Z1bmN0aW9uABMDZW52DV9lbXZhbF9kZWNyZWYABANlbnYRX2VtdmFsX3Rha2VfdmFsdWUAAQNlbnYVX2VtYmluZF9yZWdpc3Rlcl92b2lkAAIDZW52FV9lbWJpbmRfcmVnaXN0ZXJfYm9vbAAJA2VudhhfZW1iaW5kX3JlZ2lzdGVyX2ludGVnZXIADgNlbnYW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dGFja19nZXRfZW5kAKgPGV9lbXNjcmlwdGVuX3N0YWNrX3Jlc3RvcmUAqQ8XX2Vtc2NyaXB0ZW5fc3RhY2tfYWxsb2MAqg8cZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudACrDw5keW5DYWxsX3ZpaWppaQCxDwxkeW5DYWxsX2ppamkAsg8OZHluQ2FsbF9paWlpaWoAsw8PZHluQ2FsbF9paWlpaWpqALQPEGR5bkNhbGxfaWlpaWlpamoAtQ8JkgYBAEEBC5EDHiEkLC4wMjQ2ODo8PT5AQUJDREZHSFeQAZgBoAGmAa0BuAHNAdIB1wHcAeYBmgKbAp0CngKfAqECogKjAqQCqwKtAq8CsAKxArMCtQK0ArYCzwLRAtAC0gLbAtwC3gLfAuAC4QLiAuMC5ALpAusC7QLuAu8C8QLzAvIC9AKHA4kDiAOKA5gCmQLZAtoCrgSvBIUCgwKBArUEggK2BOQE5QTmBOcE6QTqBPEE8gTzBPQE9QT3BPgE+gT8BP0EggWDBYQFhgWHBbIFygXLBc4F9gG3CM4K5ArsCvgK5gvpC+0L8AvzC/YL+Av6C/wL/guADIIMhAyGDNkK3Qr0CokLiguLC4wLjQuOC48LkAuRC5IL3gmcC50LoAujC6QLpwuoC6oL0QvSC9UL1wvZC9sL3wvTC9QL1gvYC9oL3AvgC/8F8wr5CvoK+wr8Cv0K/gqAC4ELgwuEC4ULhguHC5MLlAuVC5YLlwuYC5kLmgurC6wLrguwC7ELsguzC7ULtgu3C7gLuQu6C7sLvAu9C74LvwvBC8MLxAvFC8YLyAvJC8oLywvMC80LzgvPC9AL/gWABoEGggaFBoYGhwaIBokGjQaJDI4GnAalBqgGqwauBrEGtAa5BrwGvwaKDMYG0AbVBtcG2QbbBt0G3wbjBuUG5waLDPgGgAeHB4kHiweNB5YHmAeMDJwHpQepB6sHrQevB7UHtweNDI8MwAfBB8IHwwfFB8cHygfkC+sL8Qv/C4MM9wv7C5AMkgzZB9oH2wfhB+MH5QfoB+cL7gv0C4EMhQz5C/0LlAyTDPUHlgyVDPsHlwyBCIQIhQiGCIcIiAiJCIoIiwiYDIwIjQiOCI8IkAiRCJIIkwiUCJkMlQiYCJkImgieCJ8IoAihCKIImgyjCKQIpQimCKcIqAipCKoIqwibDLYIzgicDPYIiAmdDLYJwgmeDMMJ0AmfDNgJ2QnaCaAM2wncCd0Jvw7ADvoO+w7+DvwO/Q6ED/8Ohw+AD4gPoQ+eD48PgQ+gD50PkA+CD58Pmg+TD4MPlQ8KvrEKnQ8XABClDxCKBRCzBRDjARDnARDuARC+DgsQAQF/QfCbBSEAIAAQHRoPC0IBB38jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQRBASEFIAQgBRAfGkEQIQYgAyAGaiEHIAckACAEDwu3HQLhAX8kfiMAIQBBoAchASAAIAFrIQIgAiQAQasCIQMgAiADaiEEIAIgBDYCwAJB6oQEIQUgAiAFNgK8AhAgQQIhBiACIAY2ArgCECIhByACIAc2ArQCECMhCCACIAg2ArACQQMhCSACIAk2AqwCECUhChAmIQsQJyEMECghDSACKAK4AiEOIAIgDjYCiAcQKSEPIAIoArgCIRAgAigCtAIhESACIBE2ApAHECohEiACKAK0AiETIAIoArACIRQgAiAUNgKMBxAqIRUgAigCsAIhFiACKAK8AiEXIAIoAqwCIRggAiAYNgKUBxArIRkgAigCrAIhGiAKIAsgDCANIA8gECASIBMgFSAWIBcgGSAaEABBqwIhGyACIBtqIRwgAiAcNgLEAiACKALEAiEdIAIgHTYCnAdBBCEeIAIgHjYCmAcgAigCnAchHyACKAKYByEgICAQLUEAISEgAiAhNgKkAkEFISIgAiAiNgKgAiACKQKgAiHhASACIOEBNwPIAiACKALIAiEjIAIoAswCISQgAiAfNgLkAkHggQQhJSACICU2AuACIAIgJDYC3AIgAiAjNgLYAiACKALkAiEmIAIoAuACIScgAigC2AIhKCACKALcAiEpIAIgKTYC1AIgAiAoNgLQAiACKQLQAiHiASACIOIBNwOAAUGAASEqIAIgKmohKyAnICsQLyACICE2ApwCQQYhLCACICw2ApgCIAIpApgCIeMBIAIg4wE3A+gCIAIoAugCIS0gAigC7AIhLiACICY2AoQDQfGBBCEvIAIgLzYCgAMgAiAuNgL8AiACIC02AvgCIAIoAoQDITAgAigCgAMhMSACKAL4AiEyIAIoAvwCITMgAiAzNgL0AiACIDI2AvACIAIpAvACIeQBIAIg5AE3A3hB+AAhNCACIDRqITUgMSA1EDEgAiAhNgKUAkEHITYgAiA2NgKQAiACKQKQAiHlASACIOUBNwPIAyACKALIAyE3IAIoAswDITggAiAwNgLkA0GmggQhOSACIDk2AuADIAIgODYC3AMgAiA3NgLYAyACKALkAyE6IAIoAuADITsgAigC2AMhPCACKALcAyE9IAIgPTYC1AMgAiA8NgLQAyACKQLQAyHmASACIOYBNwNwQfAAIT4gAiA+aiE/IDsgPxAzIAIgITYCjAJBCCFAIAIgQDYCiAIgAikCiAIh5wEgAiDnATcD6AMgAigC6AMhQSACKALsAyFCIAIgOjYChARBv4IEIUMgAiBDNgKABCACIEI2AvwDIAIgQTYC+AMgAigChAQhRCACKAKABCFFIAIoAvgDIUYgAigC/AMhRyACIEc2AvQDIAIgRjYC8AMgAikC8AMh6AEgAiDoATcDaEHoACFIIAIgSGohSSBFIEkQNSACICE2AoQCQQkhSiACIEo2AoACIAIpAoACIekBIAIg6QE3A4gEIAIoAogEIUsgAigCjAQhTCACIEQ2AqQEQZ+ABCFNIAIgTTYCoAQgAiBMNgKcBCACIEs2ApgEIAIoAqQEIU4gAigCoAQhTyACKAKYBCFQIAIoApwEIVEgAiBRNgKUBCACIFA2ApAEIAIpApAEIeoBIAIg6gE3A2BB4AAhUiACIFJqIVMgTyBTEDcgAiAhNgL8AUEKIVQgAiBUNgL4ASACKQL4ASHrASACIOsBNwOoBCACKAKoBCFVIAIoAqwEIVYgAiBONgLEBEHjggQhVyACIFc2AsAEIAIgVjYCvAQgAiBVNgK4BCACKALEBCFYIAIoAsAEIVkgAigCuAQhWiACKAK8BCFbIAIgWzYCtAQgAiBaNgKwBCACKQKwBCHsASACIOwBNwNYQdgAIVwgAiBcaiFdIFkgXRA5IAIgITYC9AFBCyFeIAIgXjYC8AEgAikC8AEh7QEgAiDtATcD6AUgAigC6AUhXyACKALsBSFgIAIgWDYChAZBwYUEIWEgAiBhNgKABiACIGA2AvwFIAIgXzYC+AUgAigChAYhYiACKAKABiFjIAIoAvgFIWQgAigC/AUhZSACIGU2AvQFIAIgZDYC8AUgAikC8AUh7gEgAiDuATcDUEHQACFmIAIgZmohZyBjIGcQOyACICE2AuwBQQwhaCACIGg2AugBIAIpAugBIe8BIAIg7wE3A8gFIAIoAsgFIWkgAigCzAUhaiACIGI2AuQFQc6FBCFrIAIgazYC4AUgAiBqNgLcBSACIGk2AtgFIAIoAuQFIWwgAigC4AUhbSACKALYBSFuIAIoAtwFIW8gAiBvNgLUBSACIG42AtAFIAIpAtAFIfABIAIg8AE3A0hByAAhcCACIHBqIXEgbSBxEDsgAiAhNgLkAUENIXIgAiByNgLgASACKQLgASHxASACIPEBNwOoBSACKAKoBSFzIAIoAqwFIXQgAiBsNgLEBUGbhAQhdSACIHU2AsAFIAIgdDYCvAUgAiBzNgK4BSACKALEBSF2IAIoAsAFIXcgAigCuAUheCACKAK8BSF5IAIgeTYCtAUgAiB4NgKwBSACKQKwBSHyASACIPIBNwNAQcAAIXogAiB6aiF7IHcgexA7IAIgITYC3AFBDiF8IAIgfDYC2AEgAikC2AEh8wEgAiDzATcDqAYgAigCqAYhfSACKAKsBiF+IAIgdjYCxAZBhoQEIX8gAiB/NgLABiACIH42ArwGIAIgfTYCuAYgAigCxAYhgAEgAigCwAYhgQEgAigCuAYhggEgAigCvAYhgwEgAiCDATYCtAYgAiCCATYCsAYgAikCsAYh9AEgAiD0ATcDOEE4IYQBIAIghAFqIYUBIIEBIIUBED8gAiAhNgLUAUEPIYYBIAIghgE2AtABIAIpAtABIfUBIAIg9QE3A4gFIAIoAogFIYcBIAIoAowFIYgBIAIggAE2AqQFQceEBCGJASACIIkBNgKgBSACIIgBNgKcBSACIIcBNgKYBSACKAKkBSGKASACKAKgBSGLASACKAKYBSGMASACKAKcBSGNASACII0BNgKUBSACIIwBNgKQBSACKQKQBSH2ASACIPYBNwMwQTAhjgEgAiCOAWohjwEgiwEgjwEQOyACICE2AswBQRAhkAEgAiCQATYCyAEgAikCyAEh9wEgAiD3ATcDiAYgAigCiAYhkQEgAigCjAYhkgEgAiCKATYCpAZBsIQEIZMBIAIgkwE2AqAGIAIgkgE2ApwGIAIgkQE2ApgGIAIoAqQGIZQBIAIoAqAGIZUBIAIoApgGIZYBIAIoApwGIZcBIAIglwE2ApQGIAIglgE2ApAGIAIpApAGIfgBIAIg+AE3AyhBKCGYASACIJgBaiGZASCVASCZARA/IAIgITYCxAFBESGaASACIJoBNgLAASACKQLAASH5ASACIPkBNwPoBCACKALoBCGbASACKALsBCGcASACIJQBNgKEBUHxhgQhnQEgAiCdATYCgAUgAiCcATYC/AQgAiCbATYC+AQgAigChAUhngEgAigCgAUhnwEgAigC+AQhoAEgAigC/AQhoQEgAiChATYC9AQgAiCgATYC8AQgAikC8AQh+gEgAiD6ATcDIEEgIaIBIAIgogFqIaMBIJ8BIKMBEDsgAiAhNgK8AUESIaQBIAIgpAE2ArgBIAIpArgBIfsBIAIg+wE3A8gEIAIoAsgEIaUBIAIoAswEIaYBIAIgngE2AuQEQYKCBCGnASACIKcBNgLgBCACIKYBNgLcBCACIKUBNgLYBCACKALkBCGoASACKALgBCGpASACKALYBCGqASACKALcBCGrASACIKsBNgLUBCACIKoBNgLQBCACKQLQBCH8ASACIPwBNwMYQRghrAEgAiCsAWohrQEgqQEgrQEQOyACICE2ArQBQRMhrgEgAiCuATYCsAEgAikCsAEh/QEgAiD9ATcDyAYgAigCyAYhrwEgAigCzAYhsAEgAiCoATYC5AZBlIUEIbEBIAIgsQE2AuAGIAIgsAE2AtwGIAIgrwE2AtgGIAIoAuQGIbIBIAIoAuAGIbMBIAIoAtgGIbQBIAIoAtwGIbUBIAIgtQE2AtQGIAIgtAE2AtAGIAIpAtAGIf4BIAIg/gE3AxBBECG2ASACILYBaiG3ASCzASC3ARBFIAIgITYCrAFBFCG4ASACILgBNgKoASACKQKoASH/ASACIP8BNwOoAyACKAKoAyG5ASACKAKsAyG6ASACILIBNgLEA0GwggQhuwEgAiC7ATYCwAMgAiC6ATYCvAMgAiC5ATYCuAMgAigCxAMhvAEgAigCwAMhvQEgAigCuAMhvgEgAigCvAMhvwEgAiC/ATYCtAMgAiC+ATYCsAMgAikCsAMhgAIgAiCAAjcDCEEIIcABIAIgwAFqIcEBIL0BIMEBEDMgAiAhNgKkAUEVIcIBIAIgwgE2AqABIAIpAqABIYECIAIggQI3A4gDIAIoAogDIcMBIAIoAowDIcQBIAIgvAE2AqQDQYaFBCHFASACIMUBNgKgAyACIMQBNgKcAyACIMMBNgKYAyACKAKkAyHGASACKAKgAyHHASACKAKYAyHIASACKAKcAyHJASACIMkBNgKUAyACIMgBNgKQAyACKQKQAyGCAiACIIICNwMAIMcBIAIQMyACICE2ApwBQRYhygEgAiDKATYCmAEgAikCmAEhgwIgAiCDAjcD6AYgAigC6AYhywEgAigC7AYhzAEgAiDGATYChAdB/4YEIc0BIAIgzQE2AoAHIAIgzAE2AvwGIAIgywE2AvgGIAIoAoAHIc4BIAIoAvgGIc8BIAIoAvwGIdABIAIg0AE2AvQGIAIgzwE2AvAGIAIpAvAGIYQCIAIghAI3A4gBQYgBIdEBIAIg0QFqIdIBIM4BINIBEElBlwEh0wEgAiDTAWoh1AEg1AEh1QFBoYcEIdYBINUBINYBEEoaQZcBIdcBIAIg1wFqIdgBINgBIdkBQeeHBCHaAUEAIdsBINkBINoBINsBEEsh3AFBiYcEId0BQQEh3gEg3AEg3QEg3gEQSxpBoAch3wEgAiDfAWoh4AEg4AEkAA8LaAEJfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIMIQUgBCgCCCEGIAUgBjYCAEEAIQcgBSAHNgIEIAQoAgghCCAIEQgAIAUQ5QFBECEJIAQgCWohCiAKJAAgBQ8LAwAPCz0BB38jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBBRIQVBECEGIAMgBmohByAHJAAgBQ8LCwEBf0EAIQAgAA8LCwEBf0EAIQAgAA8LYgELfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBEEAIQUgBCAFRiEGQQEhByAGIAdxIQgCQCAIDQAgBBBSGkEkIQkgBCAJEMcOC0EQIQogAyAKaiELIAskAA8LCwEBfxBTIQAgAA8LCwEBfxBUIQAgAA8LCwEBfxBVIQAgAA8LCwEBf0EAIQAgAA8LDQEBf0HQkAQhACAADwsNAQF/QdOQBCEAIAAPCw0BAX9B1ZAEIQAgAA8LjgEBDn8jACEEQRAhBSAEIAVrIQYgBiQAIAYgADYCDCAGIAE2AgggBiACNgIEIAYgAzYCAEEkIQcgBxDCDiEIIAYoAgwhCSAGKAIIIQogCigCACELIAYoAgQhDCAMKAIAIQ0gBigCACEOIA4oAgAhDyAIIAkgCyANIA8QVhpBECEQIAYgEGohESARJAAgCA8LlQEBE38jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCCEEXIQQgAyAENgIAECUhBUEHIQYgAyAGaiEHIAchCCAIEFghCUEHIQogAyAKaiELIAshDCAMEFkhDSADKAIAIQ4gAyAONgIMEFohDyADKAIAIRAgAygCCCERIAUgCSANIA8gECAREARBECESIAMgEmohEyATJAAPC10BCH8jACECQRAhAyACIANrIQQgBCQAIAQgADYCDCAEIAE2AgggBCgCDCEFIAQoAgghBiAFIAY2AgwgBCgCCCEHAkAgB0UNACAFEEgLQRAhCCAEIAhqIQkgCSQADwvwAQEffyMAIQJBICEDIAIgA2shBCAEJAAgASgCACEFIAEoAgQhBiAEIAA2AhggBCAGNgIUIAQgBTYCEEEYIQcgBCAHNgIMECUhCCAEKAIYIQlBCyEKIAQgCmohCyALIQwgDBCRASENQQshDiAEIA5qIQ8gDyEQIBAQkgEhESAEKAIMIRIgBCASNgIcEJMBIRMgBCgCDCEUQRAhFSAEIBVqIRYgFiEXIBcQlAEhGEEAIRlBACEaQQEhGyAaIBtxIRxBASEdIBogHXEhHiAIIAkgDSARIBMgFCAYIBkgHCAeEAVBICEfIAQgH2ohICAgJAAPCysBBX8jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEKAIMIQUgBQ8L8AEBH38jACECQSAhAyACIANrIQQgBCQAIAEoAgAhBSABKAIEIQYgBCAANgIYIAQgBjYCFCAEIAU2AhBBGSEHIAQgBzYCDBAlIQggBCgCGCEJQQshCiAEIApqIQsgCyEMIAwQmQEhDUELIQ4gBCAOaiEPIA8hECAQEJoBIREgBCgCDCESIAQgEjYCHBCbASETIAQoAgwhFEEQIRUgBCAVaiEWIBYhFyAXEJwBIRhBACEZQQAhGkEBIRsgGiAbcSEcQQEhHSAaIB1xIR4gCCAJIA0gESATIBQgGCAZIBwgHhAFQSAhHyAEIB9qISAgICQADwu9EAHgAX8jACEDQTAhBCADIARrIQUgBSQAIAUgADYCLCAFIAE2AiggBSACNgIkIAUoAiwhBiAGKAIQIQcCQAJAIAdFDQAMAQsgBigCCCEIQQEhCSAIIAlHIQpBASELIAogC3EhDAJAIAxFDQBBtY4EIQ1B4IMEIQ5BxgAhD0GmggQhECANIA4gDyAQEAEACyAFKAIoIRFBICESIBEgEkwhE0EBIRQgEyAUcSEVAkAgFQ0AQf+NBCEWQeCDBCEXQcoAIRhBpoIEIRkgFiAXIBggGRABAAsgBSgCKCEaAkAgGg0ADAELIAYoAgwhGwJAIBtFDQAgBSgCKCEcQSAhHSAcIB1HIR5BASEfIB4gH3EhIAJAICBFDQAgBSgCKCEhQQEhIiAiICF0ISNBASEkICMgJGshJSAFICU2AiAgBSgCICEmIAUoAiQhJyAnICZxISggBSAoNgIkCyAFKAIoISlBByEqICkgKmohK0F4ISwgKyAscSEtIAUgLTYCKCAGKAIYIS4CQCAuRQ0AQaGOBCEvQeCDBCEwQdYAITFBpoIEITIgLyAwIDEgMhABAAsMAQsgBigCACEzIAYoAhQhNCAzIDRqITUgBSA1NgIcIAUoAhwhNkF8ITcgNiA3cSE4IAUgODYCGCAGKAIYITkgBSgCHCE6QQMhOyA6IDtxITxBAyE9IDwgPXQhPiA5ID5qIT8gBSA/NgIUIAUoAhQhQEEBIUEgQSBAdCFCQQEhQyBCIENrIUQgBSBENgIQIAUoAhQhRUEAIUYgRSBGSyFHQQEhSCBHIEhxIUkCQCBJRQ0AIAUoAhQhSkEgIUsgSyBKayFMIAUgTDYCDCAFKAIoIU0gBSgCDCFOIE0gTkghT0EBIVAgTyBQcSFRAkACQCBRRQ0AIAUoAighUiBSIVMMAQsgBSgCDCFUIFQhUwsgUyFVIAUgVTYCCCAFKAIYIVYgVigCACFXIAUoAhAhWCBXIFhxIVkgBSgCJCFaIAUoAgghW0EBIVwgXCBbdCFdQQEhXiBdIF5rIV8gWiBfcSFgIAUoAhQhYSBgIGF0IWIgWSBiciFjIAUoAhghZCBkIGM2AgAgBSgCCCFlIAUoAiQhZiBmIGV2IWcgBSBnNgIkIAUoAgghaCAFKAIUIWkgaSBoaiFqIAUgajYCFCAFKAIYIWsgBSgCFCFsQQMhbSBsIG12IW4gayBuaiFvIAYoAgAhcCBvIHBrIXEgBiBxNgIUIAUoAhQhckEHIXMgciBzcSF0IAYgdDYCGCAFKAIIIXUgBSgCKCF2IHYgdWshdyAFIHc2AiggBSgCFCF4QQUheSB4IHl2IXogBSgCGCF7QQIhfCB6IHx0IX0geyB9aiF+IAUgfjYCGCAFKAIUIX9BHyGAASB/IIABcSGBASAFIIEBNgIUIAUoAhQhggFBASGDASCDASCCAXQhhAFBASGFASCEASCFAWshhgEgBSCGATYCEAsgBSgCKCGHAUEgIYgBIIcBIIgBRiGJAUEBIYoBIIkBIIoBcSGLAQJAAkAgiwFFDQAgBigCGCGMAQJAIIwBRQ0AQaGOBCGNAUHggwQhjgFB+wAhjwFBpoIEIZABII0BII4BII8BIJABEAEACyAFKAIUIZEBAkAgkQFFDQBBjY4EIZIBQeCDBCGTAUH8ACGUAUGmggQhlQEgkgEgkwEglAEglQEQAQALIAUoAiQhlgEgBSgCGCGXASCXASCWATYCACAGKAIUIZgBQQQhmQEgmAEgmQFqIZoBIAYgmgE2AhRBACGbASAFIJsBNgIoDAELIAUoAighnAECQCCcAUUNACAFKAIoIZ0BIAUgnQE2AgQgBigCGCGeAQJAIJ4BRQ0AQaGOBCGfAUHggwQhoAFBhwEhoQFBpoIEIaIBIJ8BIKABIKEBIKIBEAEACyAFKAIUIaMBAkAgowFFDQBBjY4EIaQBQeCDBCGlAUGIASGmAUGmggQhpwEgpAEgpQEgpgEgpwEQAQALIAUoAiQhqAEgBSgCBCGpAUEBIaoBIKoBIKkBdCGrAUEBIawBIKsBIKwBayGtASCoASCtAXEhrgEgBSgCGCGvASCvASCuATYCACAFKAIEIbABIAUoAhQhsQEgsQEgsAFqIbIBIAUgsgE2AhQgBSgCGCGzASAFKAIUIbQBQQMhtQEgtAEgtQF2IbYBILMBILYBaiG3ASAGKAIAIbgBILcBILgBayG5ASAGILkBNgIUIAUoAhQhugFBByG7ASC6ASC7AXEhvAEgBiC8ATYCGCAFKAIEIb0BIAUoAighvgEgvgEgvQFrIb8BIAUgvwE2AigLCyAGKAIYIcABAkAgwAENACAGKAIAIcEBIAYoAhQhwgEgwQEgwgFqIcMBQQAhxAEgwwEgxAE6AAALIAYoAhwhxQEgBigCFCHGASDFASDGAUshxwFBASHIASDHASDIAXEhyQECQAJAIMkBRQ0AIAYoAhwhygEgygEhywEMAQsgBigCFCHMASDMASHLAQsgywEhzQEgBiDNATYCHCAGKAIcIc4BIAYoAgQhzwEgzgEgzwFNIdABQQEh0QEg0AEg0QFxIdIBAkAg0gENAEHMhgQh0wFB4IMEIdQBQZ8BIdUBQaaCBCHWASDTASDUASDVASDWARABAAsgBhA9IdcBIAUg1wE2AgAgBigCICHYASAFKAIAIdkBINgBINkBSyHaAUEBIdsBINoBINsBcSHcAQJAAkAg3AFFDQAgBigCICHdASDdASHeAQwBCyAFKAIAId8BIN8BId4BCyDeASHgASAGIOABNgIgC0EwIeEBIAUg4QFqIeIBIOIBJAAPC/ABAR9/IwAhAkEgIQMgAiADayEEIAQkACABKAIAIQUgASgCBCEGIAQgADYCGCAEIAY2AhQgBCAFNgIQQRohByAEIAc2AgwQJSEIIAQoAhghCUELIQogBCAKaiELIAshDCAMEKEBIQ1BCyEOIAQgDmohDyAPIRAgEBCiASERIAQoAgwhEiAEIBI2AhwQowEhEyAEKAIMIRRBECEVIAQgFWohFiAWIRcgFxCkASEYQQAhGUEAIRpBASEbIBogG3EhHEEBIR0gGiAdcSEeIAggCSANIBEgEyAUIBggGSAcIB4QBUEgIR8gBCAfaiEgICAkAA8L7gYBZn8jACECQSAhAyACIANrIQQgBCQAIAQgADYCGCAEIAE2AhQgBCgCGCEFIAUoAhAhBgJAAkAgBkUNAEEAIQcgBCAHNgIcDAELIAUoAgghCAJAIAhFDQBBtY4EIQlB4IMEIQpB8AEhC0G/ggQhDCAJIAogCyAMEAEACyAFKAIMIQ0CQCANRQ0AIAQoAhQhDkEHIQ8gDiAPaiEQQXghESAQIBFxIRIgBCASNgIUCyAFKAIUIRNBAyEUIBMgFHQhFSAFKAIYIRYgFSAWaiEXIAQoAhQhGCAXIBhqIRkgBSgCICEaIBkgGkshG0EBIRwgGyAccSEdAkAgHUUNAEH5jgQhHkHggwQhH0H7ASEgQb+CBCEhIB4gHyAgICEQAQALQQAhIiAEICI2AhBBACEjIAQgIzYCCCAEKAIUISRBICElICQgJUwhJkEBIScgJiAncSEoAkAgKA0AQf+NBCEpQeCDBCEqQYMCIStBv4IEISwgKSAqICsgLBABAAsgBCgCFCEtAkAgLQ0AQQAhLiAEIC42AhwMAQsDQCAFKAIYIS9BCCEwIDAgL2shMSAEIDE2AgwgBCgCFCEyIAQoAgwhMyAyIDNIITRBASE1IDQgNXEhNgJAAkAgNkUNACAEKAIUITcgNyE4DAELIAQoAgwhOSA5ITgLIDghOiAEIDo2AgQgBSgCACE7IAUoAhQhPCA7IDxqIT0gPS0AACE+Qf8BIT8gPiA/cSFAIAUoAhghQSBAIEF1IUIgBCgCBCFDQQEhRCBEIEN0IUVBASFGIEUgRmshRyBCIEdxIUggBCgCCCFJIEggSXQhSiAEKAIQIUsgSyBKciFMIAQgTDYCECAEKAIEIU0gBSgCGCFOIE4gTWohTyAFIE82AhggBSgCGCFQQQghUSBQIFFPIVJBASFTIFIgU3EhVAJAIFRFDQBBACFVIAUgVTYCGCAFKAIUIVZBASFXIFYgV2ohWCAFIFg2AhQLIAQoAgQhWSAEKAIIIVogWiBZaiFbIAQgWzYCCCAEKAIEIVwgBCgCFCFdIF0gXGshXiAEIF42AhQgBCgCFCFfQQAhYCBfIGBMIWFBASFiIGEgYnEhYwJAAkAgY0UNAAwBCwwBCwsgBCgCECFkIAQgZDYCHAsgBCgCHCFlQSAhZiAEIGZqIWcgZyQAIGUPC/ABAR9/IwAhAkEgIQMgAiADayEEIAQkACABKAIAIQUgASgCBCEGIAQgADYCGCAEIAY2AhQgBCAFNgIQQRshByAEIAc2AgwQJSEIIAQoAhghCUELIQogBCAKaiELIAshDCAMEKcBIQ1BCyEOIAQgDmohDyAPIRAgEBCoASERIAQoAgwhEiAEIBI2AhwQqQEhEyAEKAIMIRRBECEVIAQgFWohFiAWIRcgFxCqASEYQQAhGUEAIRpBASEbIBogG3EhHEEBIR0gGiAdcSEeIAggCSANIBEgEyAUIBggGSAcIB4QBUEgIR8gBCAfaiEgICAkAA8LUwEIfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIIIQUgBSgCACEGIAUoAhwhByAAIAYgBxBMGkEQIQggBCAIaiEJIAkkAA8L8AEBH38jACECQSAhAyACIANrIQQgBCQAIAEoAgAhBSABKAIEIQYgBCAANgIYIAQgBjYCFCAEIAU2AhBBHCEHIAQgBzYCDBAlIQggBCgCGCEJQQshCiAEIApqIQsgCyEMIAwQrgEhDUELIQ4gBCAOaiEPIA8hECAQEK8BIREgBCgCDCESIAQgEjYCHBCwASETIAQoAgwhFEEQIRUgBCAVaiEWIBYhFyAXELEBIRhBACEZQQAhGkEBIRsgGiAbcSEcQQEhHSAaIB1xIR4gCCAJIA0gESATIBQgGCAZIBwgHhAFQSAhHyAEIB9qISAgICQADwthAQp/IwAhAkEQIQMgAiADayEEIAQkACAEIAA2AgwgBCABNgIIIAQoAgghBSAFKAIcIQYgBSgCACEHIAQhCCAIIAYgBxBNIAQhCSAAIAkQThpBECEKIAQgCmohCyALJAAPC/ABAR9/IwAhAkEgIQMgAiADayEEIAQkACABKAIAIQUgASgCBCEGIAQgADYCGCAEIAY2AhQgBCAFNgIQQR0hByAEIAc2AgwQJSEIIAQoAhghCUELIQogBCAKaiELIAshDCAMELkBIQ1BCyEOIAQgDmohDyAPIRAgEBC6ASERIAQoAgwhEiAEIBI2AhwQsAEhEyAEKAIMIRRBECEVIAQgFWohFiAWIRcgFxC7ASEYQQAhGUEAIRpBASEbIBogG3EhHEEBIR0gGiAdcSEeIAggCSANIBEgEyAUIBggGSAcIB4QBUEgIR8gBCAfaiEgICAkAA8LKwEFfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQoAiAhBSAFDwvwAQEffyMAIQJBICEDIAIgA2shBCAEJAAgASgCACEFIAEoAgQhBiAEIAA2AhggBCAGNgIUIAQgBTYCEEEeIQcgBCAHNgIMECUhCCAEKAIYIQlBCyEKIAQgCmohCyALIQwgDBDOASENQQshDiAEIA5qIQ8gDyEQIBAQzwEhESAEKAIMIRIgBCASNgIcEJsBIRMgBCgCDCEUQRAhFSAEIBVqIRYgFiEXIBcQ0AEhGEEAIRlBACEaQQEhGyAaIBtxIRxBASEdIBogHXEhHiAIIAkgDSARIBMgFCAYIBkgHCAeEAVBICEfIAQgH2ohICAgJAAPC08BC38jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEKAIUIQVBAyEGIAUgBnQhByAEKAIYIQggByAIaiEJQQMhCiAJIAp2IQsgCw8LRAEJfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQoAhQhBUEDIQYgBSAGdCEHIAQoAhghCCAHIAhqIQkgCQ8LtwEBFX8jACECQRAhAyACIANrIQQgBCQAIAQgADYCDCAEIAE2AgggBCgCDCEFIAQoAgghBiAFKAIgIQcgBiAHTSEIQQEhCSAIIAlxIQoCQCAKDQBBq4UEIQtB4IMEIQxBvQIhDUGGhAQhDiALIAwgDSAOEAEACyAEKAIIIQ9BAyEQIA8gEHYhESAFIBE2AhQgBCgCCCESQQchEyASIBNxIRQgBSAUNgIYQRAhFSAEIBVqIRYgFiQADwvwAQEffyMAIQJBICEDIAIgA2shBCAEJAAgASgCACEFIAEoAgQhBiAEIAA2AhggBCAGNgIUIAQgBTYCEEEfIQcgBCAHNgIMECUhCCAEKAIYIQlBCyEKIAQgCmohCyALIQwgDBDTASENQQshDiAEIA5qIQ8gDyEQIBAQ1AEhESAEKAIMIRIgBCASNgIcEJMBIRMgBCgCDCEUQRAhFSAEIBVqIRYgFiEXIBcQ1QEhGEEAIRlBACEaQQEhGyAaIBtxIRxBASEdIBogHXEhHiAIIAkgDSARIBMgFCAYIBkgHCAeEAVBICEfIAQgH2ohICAgJAAPCzYBB38jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEKAIEIQVBAyEGIAUgBnQhByAHDwtCAQd/IwAhAkEQIQMgAiADayEEIAQgADYCDCAEIAE2AgggBCgCDCEFIAQoAgghBkEDIQcgBiAHdiEIIAUgCDYCBA8LKwEFfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQoAhQhBSAFDwsrAQV/IwAhAUEQIQIgASACayEDIAMgADYCDCADKAIMIQQgBCgCGCEFIAUPC3wBDH8jACEDQRAhBCADIARrIQUgBSQAIAUgADYCDCAFIAE2AgggBSACNgIEIAUoAgwhBkEDIQdBBCEIIAYgByAIEDIgBSgCCCEJQQUhCiAGIAogCRBHIAUoAgghCyAFKAIEIQwgBiALIAwQR0EQIQ0gBSANaiEOIA4kAA8L8AEBH38jACECQSAhAyACIANrIQQgBCQAIAEoAgAhBSABKAIEIQYgBCAANgIYIAQgBjYCFCAEIAU2AhBBICEHIAQgBzYCDBAlIQggBCgCGCEJQQshCiAEIApqIQsgCyEMIAwQ2AEhDUELIQ4gBCAOaiEPIA8hECAQENkBIREgBCgCDCESIAQgEjYCHBCjASETIAQoAgwhFEEQIRUgBCAVaiEWIBYhFyAXENoBIRhBACEZQQAhGkEBIRsgGiAbcSEcQQEhHSAaIB1xIR4gCCAJIA0gESATIBQgGCAZIBwgHhAFQSAhHyAEIB9qISAgICQADwt4AQt/IwAhA0EQIQQgAyAEayEFIAUkACAFIAA2AgwgBSABNgIIIAUgAjYCBCAFKAIMIQZBAyEHIAYgByAHEDIgBSgCCCEIQQUhCSAGIAkgCBBHIAUoAgghCiAFKAIEIQsgBiAKIAsQMkEQIQwgBSAMaiENIA0kAA8L9QMBNH8jACEDQSAhBCADIARrIQUgBSQAIAUgADYCHCAFIAE2AhggBSACNgIUIAUoAhwhBkEBIQcgBSAHNgIMIAUoAhghCEEBIQkgCCAJRiEKQQEhCyAKIAtxIQwgBSAMNgIIIAUoAhQhDSANEE8hDiAFIA42AgQgBigCDCEPAkACQCAPRQ0AIAUoAhQhEEEgIREgBiARIBAQMgwBCyAGKAIQIRICQCASRQ0ADAELA0AgBSgCGCETQQEhFCAUIBN0IRVBASEWIBUgFmshFyAFIBc2AhAgBSgCFCEYIAUoAhAhGSAYIBlJIRpBASEbIBogG3EhHAJAAkAgHA0AIAUoAhghHUEgIR4gHSAeTiEfQQEhICAfICBxISEgIUUNAQsgBSgCGCEiIAUoAhQhIyAGICIgIxAyIAUoAgwhJAJAAkAgJEUNAAwBCwsgBSgCCCElAkAgJUUNAAsMAgsgBSgCGCEmIAUoAhAhJyAGICYgJxAyIAUoAhghKEEBISkgKCApdCEqIAUgKjYCGCAFKAIYIStBICEsICsgLEohLUEBIS4gLSAucSEvAkAgL0UNAEEgITAgBSAwNgIYCyAFKAIQITEgBSgCFCEyIDIgMWshMyAFIDM2AhRBACE0IAUgNDYCDAwACwALQSAhNSAFIDVqITYgNiQADwuCAgEffyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQoAhghBQJAIAVFDQAgBCgCFCEGQQEhByAGIAdqIQggBCAINgIUIAQoAgghCUEBIQogCSAKRiELQQEhDCALIAxxIQ0CQCANRQ0AIAQoAhwhDiAEKAIUIQ8gDiAPSSEQQQEhESAQIBFxIRICQCASRQ0AIAQoAhwhE0EBIRQgEyAUaiEVIAQgFTYCHCAEKAIYIRZBCCEXIBcgFmshGCAEKAIgIRkgGSAYaiEaIAQgGjYCICAEKAIAIRsgBCgCHCEcIBsgHGohHUEAIR4gHSAeOgAACwtBACEfIAQgHzYCGAsPC/ABAR9/IwAhAkEgIQMgAiADayEEIAQkACABKAIAIQUgASgCBCEGIAQgADYCGCAEIAY2AhQgBCAFNgIQQSEhByAEIAc2AgwQJSEIIAQoAhghCUELIQogBCAKaiELIAshDCAMEN0BIQ1BCyEOIAQgDmohDyAPIRAgEBDeASERIAQoAgwhEiAEIBI2AhwQ3wEhEyAEKAIMIRRBECEVIAQgFWohFiAWIRcgFxDgASEYQQAhGUEAIRpBASEbIBogG3EhHEEBIR0gGiAdcSEeIAggCSANIBEgEyAUIBggGSAcIB4QBUEgIR8gBCAfaiEgICAkAA8LZgEMfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIMIQUQUCEGIAQoAgghB0EEIQhBACEJQQEhCiAJIApxIQsgBiAHIAggCxACQRAhDCAEIAxqIQ0gDSQAIAUPC18BCX8jACEDQRAhBCADIARrIQUgBSQAIAUgADYCDCAFIAE2AgggBSACNgIEIAUoAgwhBhBQIQcgBSgCCCEIIAUoAgQhCSAHIAggCRADQRAhCiAFIApqIQsgCyQAIAYPC4MBAQ5/IwAhA0EQIQQgAyAEayEFIAUkACAFIAA2AgwgBSABNgIIIAUgAjYCBCAFKAIMIQZBAyEHIAUgB2ohCCAIIQlBAiEKIAUgCmohCyALIQwgBiAJIAwQYxogBSgCCCENIAUoAgQhDiAGIA0gDhDYDkEQIQ8gBSAPaiEQIBAkACAGDwtNAQd/IwAhA0EQIQQgAyAEayEFIAUkACAFIAE2AgwgBSACNgIIIAUoAgwhBiAFKAIIIQcgACAGIAcQwgEaQRAhCCAFIAhqIQkgCSQADwtxAQx/IwAhAkEQIQMgAiADayEEIAQkACAEIAA2AgwgBCABNgIIIAQoAgwhBSAEKAIIIQYgBCEHIAcgBhDDARoQxAEhCCAEIQkgCRDFASEKIAggChAHIQsgBSALEMYBGkEQIQwgBCAMaiENIA0kACAFDwtvAQx/IwAhAUEQIQIgASACayEDIAMgADYCDEEAIQQgAyAENgIIA0AgAygCDCEFQQEhBiAFIAZ2IQcgAyAHNgIMIAMoAgghCEEBIQkgCCAJaiEKIAMgCjYCCCADKAIMIQsgCw0ACyADKAIIIQwgDA8LDAEBfxDiASEAIAAPCyMBBH8jACEBQRAhAiABIAJrIQMgAyAANgIMQYyQBCEEIAQPC24BDH8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCCCADKAIIIQQgAyAENgIMIAQoAgAhBUEAIQYgBSAGRiEHQQEhCCAHIAhxIQkCQCAJDQAgBRDIDgsgAygCDCEKQRAhCyADIAtqIQwgDCQAIAoPCw0BAX9BjJAEIQAgAA8LDQEBf0GgkAQhACAADwsNAQF/QcCQBCEAIAAPC+0BAhR/AX4jACEFQSAhBiAFIAZrIQcgByQAIAcgADYCHCAHIAE2AhggByACNgIUIAcgAzYCECAHIAQ2AgwgBygCHCEIIAcoAhQhCSAIIAk2AgQgBygCECEKIAggCjYCCCAHKAIMIQsgCCALNgIMQQAhDCAIIAw2AhBBFCENIAggDWohDkIAIRkgDiAZNwIAIAgoAgQhDyAPEMUOIRAgCCAQNgIAIAgoAgAhESAHKAIYIRIgEhBoIRMgCCgCBCEUIBEgEyAUEOgBGkGUswUhFUHMjwQhFiAVIBYQaRpBICEXIAcgF2ohGCAYJAAgCA8LkQIBIX8jACEFQTAhBiAFIAZrIQcgByQAIAcgADYCLCAHIAE2AiggByACNgIkIAcgAzYCICAHIAQ2AhwgBygCLCEIIAcoAighCUEQIQogByAKaiELIAshDCAMIAkQWyAHKAIkIQ0gDRBcIQ4gByAONgIMIAcoAiAhDyAPEF0hECAHIBA2AgggBygCHCERIBEQXCESIAcgEjYCBEEQIRMgByATaiEUIBQhFUEMIRYgByAWaiEXIBchGEEIIRkgByAZaiEaIBohG0EEIRwgByAcaiEdIB0hHiAVIBggGyAeIAgRDAAhHyAfEF4hIEEQISEgByAhaiEiICIhIyAjENUOGkEwISQgByAkaiElICUkACAgDwshAQR/IwAhAUEQIQIgASACayEDIAMgADYCDEEFIQQgBA8LNAEGfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMEF8hBEEQIQUgAyAFaiEGIAYkACAEDwsNAQF/QdSRBCEAIAAPC0IBBn8jACECQRAhAyACIANrIQQgBCQAIAQgADYCDCAEIAE2AgggBCgCCCEFIAAgBRBgQRAhBiAEIAZqIQcgByQADws9AQd/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgwgAygCDCEEIAQQYSEFQRAhBiADIAZqIQcgByQAIAUPCz0BB38jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBBiIQVBECEGIAMgBmohByAHJAAgBQ8LJAEEfyMAIQFBECECIAEgAmshAyADIAA2AgggAygCCCEEIAQPCw0BAX9B4JAEIQAgAA8LXgEKfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIIIQVBBCEGIAUgBmohByAEKAIIIQggCCgCACEJIAAgByAJEEwaQRAhCiAEIApqIQsgCyQADwskAQR/IwAhAUEQIQIgASACayEDIAMgADYCDCADKAIMIQQgBA8LJAEEfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQPC08BBn8jACEDQRAhBCADIARrIQUgBSQAIAUgADYCDCAFIAE2AgggBSACNgIEIAUoAgwhBiAGEGQaIAYQZRpBECEHIAUgB2ohCCAIJAAgBg8LJAEEfyMAIQFBECECIAEgAmshAyADIAA2AgggAygCCCEEIAQPCzwBBn8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCCCADKAIIIQQgBBBmGkEQIQUgAyAFaiEGIAYkACAEDws8AQZ/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgwgAygCDCEEIAQQZxpBECEFIAMgBWohBiAGJAAgBA8LJAEEfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQPC0MBCH8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBBqIQUgBRBrIQZBECEHIAMgB2ohCCAIJAAgBg8LXAEKfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIMIQUgBCgCCCEGIAQoAgghByAHEGwhCCAFIAYgCBBtIQlBECEKIAQgCmohCyALJAAgCQ8LbQENfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEG4hBUEBIQYgBSAGcSEHAkACQCAHRQ0AIAQQbyEIIAghCQwBCyAEEHAhCiAKIQkLIAkhC0EQIQwgAyAMaiENIA0kACALDwskAQR/IwAhAUEQIQIgASACayEDIAMgADYCDCADKAIMIQQgBA8LPQEHfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEHshBUEQIQYgAyAGaiEHIAckACAFDwu6BAFNfyMAIQNBICEEIAMgBGshBSAFJAAgBSAANgIcIAUgATYCGCAFIAI2AhQgBSgCHCEGQQwhByAFIAdqIQggCCEJIAkgBhDTAhpBDCEKIAUgCmohCyALIQwgDBB0IQ1BASEOIA0gDnEhDwJAIA9FDQAgBSgCHCEQQQQhESAFIBFqIRIgEiETIBMgEBB1GiAFKAIYIRQgBSgCHCEVIBUoAgAhFkF0IRcgFiAXaiEYIBgoAgAhGSAVIBlqIRogGhB2IRtBsAEhHCAbIBxxIR1BICEeIB0gHkYhH0EBISAgHyAgcSEhAkACQCAhRQ0AIAUoAhghIiAFKAIUISMgIiAjaiEkICQhJQwBCyAFKAIYISYgJiElCyAlIScgBSgCGCEoIAUoAhQhKSAoIClqISogBSgCHCErICsoAgAhLEF0IS0gLCAtaiEuIC4oAgAhLyArIC9qITAgBSgCHCExIDEoAgAhMkF0ITMgMiAzaiE0IDQoAgAhNSAxIDVqITYgNhB3ITcgBSgCBCE4QRghOSA3IDl0ITogOiA5dSE7IDggFCAnICogMCA7EHghPCAFIDw2AghBCCE9IAUgPWohPiA+IT8gPxB5IUBBASFBIEAgQXEhQgJAIEJFDQAgBSgCHCFDIEMoAgAhREF0IUUgRCBFaiFGIEYoAgAhRyBDIEdqIUhBBSFJIEggSRB6CwtBDCFKIAUgSmohSyBLIUwgTBDUAhogBSgCHCFNQSAhTiAFIE5qIU8gTyQAIE0PC30BEn8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBBxIQUgBS0ACyEGQQchByAGIAd2IQhBACEJQf8BIQogCCAKcSELQf8BIQwgCSAMcSENIAsgDUchDkEBIQ8gDiAPcSEQQRAhESADIBFqIRIgEiQAIBAPC0QBCH8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBBxIQUgBSgCACEGQRAhByADIAdqIQggCCQAIAYPC0MBCH8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBBxIQUgBRByIQZBECEHIAMgB2ohCCAIJAAgBg8LPQEHfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEHMhBUEQIQYgAyAGaiEHIAckACAFDwskAQR/IwAhAUEQIQIgASACayEDIAMgADYCDCADKAIMIQQgBA8LJAEEfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQPCzYBB38jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAELQAAIQVBASEGIAUgBnEhByAHDwtzAQ1/IwAhAkEQIQMgAiADayEEIAQkACAEIAA2AgwgBCABNgIIIAQoAgwhBSAEKAIIIQYgBigCACEHQXQhCCAHIAhqIQkgCSgCACEKIAYgCmohCyALEIEBIQwgBSAMNgIAQRAhDSAEIA1qIQ4gDiQAIAUPCysBBX8jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEKAIEIQUgBQ8LsAEBF38jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQQggEhBSAEKAJMIQYgBSAGEIMBIQdBASEIIAcgCHEhCQJAIAlFDQBBICEKQRghCyAKIAt0IQwgDCALdSENIAQgDRCEASEOQRghDyAOIA90IRAgECAPdSERIAQgETYCTAsgBCgCTCESQRghEyASIBN0IRQgFCATdSEVQRAhFiADIBZqIRcgFyQAIBUPC/IGAWB/IwAhBkHAACEHIAYgB2shCCAIJAAgCCAANgI4IAggATYCNCAIIAI2AjAgCCADNgIsIAggBDYCKCAIIAU6ACcgCCgCOCEJQQAhCiAJIApGIQtBASEMIAsgDHEhDQJAAkAgDUUNACAIKAI4IQ4gCCAONgI8DAELIAgoAiwhDyAIKAI0IRAgDyAQayERIAggETYCICAIKAIoIRIgEhB8IRMgCCATNgIcIAgoAhwhFCAIKAIgIRUgFCAVSiEWQQEhFyAWIBdxIRgCQAJAIBhFDQAgCCgCICEZIAgoAhwhGiAaIBlrIRsgCCAbNgIcDAELQQAhHCAIIBw2AhwLIAgoAjAhHSAIKAI0IR4gHSAeayEfIAggHzYCGCAIKAIYISBBACEhICAgIUohIkEBISMgIiAjcSEkAkAgJEUNACAIKAI4ISUgCCgCNCEmIAgoAhghJyAlICYgJxB9ISggCCgCGCEpICggKUchKkEBISsgKiArcSEsAkAgLEUNAEEAIS0gCCAtNgI4IAgoAjghLiAIIC42AjwMAgsLIAgoAhwhL0EAITAgLyAwSiExQQEhMiAxIDJxITMCQCAzRQ0AIAgoAhwhNCAILQAnITVBDCE2IAggNmohNyA3IThBGCE5IDUgOXQhOiA6IDl1ITsgOCA0IDsQfhogCCgCOCE8QQwhPSAIID1qIT4gPiE/ID8QfyFAIAgoAhwhQSA8IEAgQRB9IUIgCCgCHCFDIEIgQ0chREEBIUUgRCBFcSFGAkACQCBGRQ0AQQAhRyAIIEc2AjggCCgCOCFIIAggSDYCPEEBIUkgCCBJNgIIDAELQQAhSiAIIEo2AggLQQwhSyAIIEtqIUwgTBDVDhogCCgCCCFNAkAgTQ4CAAIACwsgCCgCLCFOIAgoAjAhTyBOIE9rIVAgCCBQNgIYIAgoAhghUUEAIVIgUSBSSiFTQQEhVCBTIFRxIVUCQCBVRQ0AIAgoAjghViAIKAIwIVcgCCgCGCFYIFYgVyBYEH0hWSAIKAIYIVogWSBaRyFbQQEhXCBbIFxxIV0CQCBdRQ0AQQAhXiAIIF42AjggCCgCOCFfIAggXzYCPAwCCwsgCCgCKCFgQQAhYSBgIGEQgAEaIAgoAjghYiAIIGI2AjwLIAgoAjwhY0HAACFkIAggZGohZSBlJAAgYw8LQQEJfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQoAgAhBUEAIQYgBSAGRiEHQQEhCCAHIAhxIQkgCQ8LSgEHfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIMIQUgBCgCCCEGIAUgBhCFAUEQIQcgBCAHaiEIIAgkAA8LPgEHfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEPABIQVBECEGIAMgBmohByAHJAAgBQ8LKwEFfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQoAgwhBSAFDwtuAQt/IwAhA0EQIQQgAyAEayEFIAUkACAFIAA2AgwgBSABNgIIIAUgAjYCBCAFKAIMIQYgBSgCCCEHIAUoAgQhCCAGKAIAIQkgCSgCMCEKIAYgByAIIAoRAwAhC0EQIQwgBSAMaiENIA0kACALDwuVAQERfyMAIQNBECEEIAMgBGshBSAFJAAgBSAANgIMIAUgATYCCCAFIAI6AAcgBSgCDCEGQQYhByAFIAdqIQggCCEJQQUhCiAFIApqIQsgCyEMIAYgCSAMEGMaIAUoAgghDSAFLQAHIQ5BGCEPIA4gD3QhECAQIA91IREgBiANIBEQ3Q5BECESIAUgEmohEyATJAAgBg8LRQEIfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEIYBIQUgBRCHASEGQRAhByADIAdqIQggCCQAIAYPC04BB38jACECQRAhAyACIANrIQQgBCAANgIMIAQgATYCCCAEKAIMIQUgBSgCDCEGIAQgBjYCBCAEKAIIIQcgBSAHNgIMIAQoAgQhCCAIDws+AQd/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgwgAygCDCEEIAQQjQEhBUEQIQYgAyAGaiEHIAckACAFDwsLAQF/QX8hACAADwtEAQh/IwAhAkEQIQMgAiADayEEIAQgADYCDCAEIAE2AgggBCgCDCEFIAQoAgghBiAFIAZGIQdBASEIIAcgCHEhCSAJDwuzAQEYfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgAToACyAEKAIMIQVBBCEGIAQgBmohByAHIQggCCAFEKoEQQQhCSAEIAlqIQogCiELIAsQjgEhDCAELQALIQ1BGCEOIA0gDnQhDyAPIA51IRAgDCAQEI8BIRFBBCESIAQgEmohEyATIRQgFBCPBhpBGCEVIBEgFXQhFiAWIBV1IRdBECEYIAQgGGohGSAZJAAgFw8LWAEJfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIMIQUgBSgCECEGIAQoAgghByAGIAdyIQggBSAIEKwEQRAhCSAEIAlqIQogCiQADwtvAQ1/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgwgAygCDCEEIAQQbiEFQQEhBiAFIAZxIQcCQAJAIAdFDQAgBBCIASEIIAghCQwBCyAEEIkBIQogCiEJCyAJIQtBECEMIAMgDGohDSANJAAgCw8LJAEEfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQPC0UBCH8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBCKASEFIAUoAgAhBkEQIQcgAyAHaiEIIAgkACAGDwtFAQh/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgwgAygCDCEEIAQQigEhBSAFEIsBIQZBECEHIAMgB2ohCCAIJAAgBg8LPgEHfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEIwBIQVBECEGIAMgBmohByAHJAAgBQ8LJAEEfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQPCyQBBH8jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEDwsrAQV/IwAhAUEQIQIgASACayEDIAMgADYCDCADKAIMIQQgBCgCGCEFIAUPC0YBCH8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQRB0L4FIQUgBCAFEJQGIQZBECEHIAMgB2ohCCAIJAAgBg8LggEBEH8jACECQRAhAyACIANrIQQgBCQAIAQgADYCDCAEIAE6AAsgBCgCDCEFIAQtAAshBiAFKAIAIQcgBygCHCEIQRghCSAGIAl0IQogCiAJdSELIAUgCyAIEQEAIQxBGCENIAwgDXQhDiAOIA11IQ9BECEQIAQgEGohESARJAAgDw8LwQEBFn8jACEDQRAhBCADIARrIQUgBSQAIAUgADYCDCAFIAE2AgggBSACNgIEIAUoAgghBiAGEJUBIQcgBSgCDCEIIAgoAgQhCSAIKAIAIQpBASELIAkgC3UhDCAHIAxqIQ1BASEOIAkgDnEhDwJAAkAgD0UNACANKAIAIRAgECAKaiERIBEoAgAhEiASIRMMAQsgCiETCyATIRQgBSgCBCEVIBUQlgEhFiANIBYgFBECAEEQIRcgBSAXaiEYIBgkAA8LIQEEfyMAIQFBECECIAEgAmshAyADIAA2AgxBAyEEIAQPCzUBBn8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDBCXASEEQRAhBSADIAVqIQYgBiQAIAQPCw0BAX9B6JEEIQAgAA8LbAELfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMQQghBCAEEMIOIQUgAygCDCEGIAYoAgAhByAGKAIEIQggBSAINgIEIAUgBzYCACADIAU2AgggAygCCCEJQRAhCiADIApqIQsgCyQAIAkPCyQBBH8jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEDwskAQR/IwAhAUEQIQIgASACayEDIAMgADYCDCADKAIMIQQgBA8LDQEBf0HckQQhACAADwvLAQEZfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIIIQUgBRCdASEGIAQoAgwhByAHKAIEIQggBygCACEJQQEhCiAIIAp1IQsgBiALaiEMQQEhDSAIIA1xIQ4CQAJAIA5FDQAgDCgCACEPIA8gCWohECAQKAIAIREgESESDAELIAkhEgsgEiETIAwgExEAACEUIAQgFDYCBEEEIRUgBCAVaiEWIBYhFyAXEJ4BIRhBECEZIAQgGWohGiAaJAAgGA8LIQEEfyMAIQFBECECIAEgAmshAyADIAA2AgxBAiEEIAQPCzUBBn8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDBCfASEEQRAhBSADIAVqIQYgBiQAIAQPCw0BAX9B+JEEIQAgAA8LbAELfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMQQghBCAEEMIOIQUgAygCDCEGIAYoAgAhByAGKAIEIQggBSAINgIEIAUgBzYCACADIAU2AgggAygCCCEJQRAhCiADIApqIQsgCyQAIAkPCyQBBH8jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEDwsrAQV/IwAhAUEQIQIgASACayEDIAMgADYCCCADKAIIIQQgBCgCACEFIAUPCw0BAX9B8JEEIQAgAA8L1wEBGH8jACEEQRAhBSAEIAVrIQYgBiQAIAYgADYCDCAGIAE2AgggBiACNgIEIAYgAzYCACAGKAIIIQcgBxCVASEIIAYoAgwhCSAJKAIEIQogCSgCACELQQEhDCAKIAx1IQ0gCCANaiEOQQEhDyAKIA9xIRACQAJAIBBFDQAgDigCACERIBEgC2ohEiASKAIAIRMgEyEUDAELIAshFAsgFCEVIAYoAgQhFiAWEJYBIRcgBigCACEYIBgQYSEZIA4gFyAZIBURBgBBECEaIAYgGmohGyAbJAAPCyEBBH8jACEBQRAhAiABIAJrIQMgAyAANgIMQQQhBCAEDws1AQZ/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgwQpQEhBEEQIQUgAyAFaiEGIAYkACAEDwsNAQF/QZCSBCEAIAAPC2wBC38jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDEEIIQQgBBDCDiEFIAMoAgwhBiAGKAIAIQcgBigCBCEIIAUgCDYCBCAFIAc2AgAgAyAFNgIIIAMoAgghCUEQIQogAyAKaiELIAskACAJDwsNAQF/QYCSBCEAIAAPC+IBARt/IwAhA0EgIQQgAyAEayEFIAUkACAFIAA2AhwgBSABNgIYIAUgAjYCFCAFKAIYIQYgBhCVASEHIAUoAhwhCCAIKAIEIQkgCCgCACEKQQEhCyAJIAt1IQwgByAMaiENQQEhDiAJIA5xIQ8CQAJAIA9FDQAgDSgCACEQIBAgCmohESARKAIAIRIgEiETDAELIAohEwsgEyEUIAUoAhQhFSAVEJYBIRYgDSAWIBQRAQAhFyAFIBc2AhBBECEYIAUgGGohGSAZIRogGhCrASEbQSAhHCAFIBxqIR0gHSQAIBsPCyEBBH8jACEBQRAhAiABIAJrIQMgAyAANgIMQQMhBCAEDws1AQZ/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgwQrAEhBEEQIQUgAyAFaiEGIAYkACAEDwsNAQF/QaSSBCEAIAAPC2wBC38jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDEEIIQQgBBDCDiEFIAMoAgwhBiAGKAIAIQcgBigCBCEIIAUgCDYCBCAFIAc2AgAgAyAFNgIIIAMoAgghCUEQIQogAyAKaiELIAskACAJDwsrAQV/IwAhAUEQIQIgASACayEDIAMgADYCCCADKAIIIQQgBCgCACEFIAUPCw0BAX9BmJIEIQAgAA8L6AEBHn8jACECQSAhAyACIANrIQQgBCQAIAQgADYCHCAEIAE2AhggBCgCGCEFIAUQlQEhBiAEKAIcIQcgBygCBCEIIAcoAgAhCUEBIQogCCAKdSELIAYgC2ohDEEBIQ0gCCANcSEOAkACQCAORQ0AIAwoAgAhDyAPIAlqIRAgECgCACERIBEhEgwBCyAJIRILIBIhE0EMIRQgBCAUaiEVIBUhFiAWIAwgExECAEEMIRcgBCAXaiEYIBghGSAZELIBIRpBDCEbIAQgG2ohHCAcIR0gHRDVDhpBICEeIAQgHmohHyAfJAAgGg8LIQEEfyMAIQFBECECIAEgAmshAyADIAA2AgxBAiEEIAQPCzUBBn8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDBCzASEEQRAhBSADIAVqIQYgBiQAIAQPCw0BAX9BtJIEIQAgAA8LbAELfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMQQghBCAEEMIOIQUgAygCDCEGIAYoAgAhByAGKAIEIQggBSAINgIEIAUgBzYCACADIAU2AgggAygCCCEJQRAhCiADIApqIQsgCyQAIAkPC8cBARl/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgggAygCCCEEIAQQtAEhBUEAIQYgBSAGdCEHQQQhCCAHIAhqIQkgCRD0ASEKIAMgCjYCBCADKAIIIQsgCxC0ASEMIAMoAgQhDSANIAw2AgAgAygCBCEOQQQhDyAOIA9qIRAgAygCCCERIBEQaCESIAMoAgghEyATELQBIRRBACEVIBQgFXQhFiAQIBIgFhDoARogAygCBCEXQRAhGCADIBhqIRkgGSQAIBcPCw0BAX9BrJIEIQAgAA8LPgEHfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEELUBIQVBECEGIAMgBmohByAHJAAgBQ8LbwENfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEG4hBUEBIQYgBSAGcSEHAkACQCAHRQ0AIAQQtgEhCCAIIQkMAQsgBBC3ASEKIAohCQsgCSELQRAhDCADIAxqIQ0gDSQAIAsPC0QBCH8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBBxIQUgBSgCBCEGQRAhByADIAdqIQggCCQAIAYPC1wBDH8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDCADKAIMIQQgBBBxIQUgBS0ACyEGQf8AIQcgBiAHcSEIQf8BIQkgCCAJcSEKQRAhCyADIAtqIQwgDCQAIAoPC+gBAR5/IwAhAkEgIQMgAiADayEEIAQkACAEIAA2AhwgBCABNgIYIAQoAhghBSAFEJUBIQYgBCgCHCEHIAcoAgQhCCAHKAIAIQlBASEKIAggCnUhCyAGIAtqIQxBASENIAggDXEhDgJAAkAgDkUNACAMKAIAIQ8gDyAJaiEQIBAoAgAhESARIRIMAQsgCSESCyASIRNBECEUIAQgFGohFSAVIRYgFiAMIBMRAgBBECEXIAQgF2ohGCAYIRkgGRC8ASEaQRAhGyAEIBtqIRwgHCEdIB0QvQEaQSAhHiAEIB5qIR8gHyQAIBoPCyEBBH8jACEBQRAhAiABIAJrIQMgAyAANgIMQQIhBCAEDws1AQZ/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgwQvgEhBEEQIQUgAyAFaiEGIAYkACAEDwtsAQt/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgxBCCEEIAQQwg4hBSADKAIMIQYgBigCACEHIAYoAgQhCCAFIAg2AgQgBSAHNgIAIAMgBTYCCCADKAIIIQlBECEKIAMgCmohCyALJAAgCQ8LPgEHfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIIIAMoAgghBCAEEL8BIQVBECEGIAMgBmohByAHJAAgBQ8LdQEMfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIIIAMoAgghBCADIAQ2AgwgBBDAASEFQQEhBiAFIAZxIQcCQCAHRQ0AIAQQwQEhCCAIEAZBACEJIAQgCTYCBAsgAygCDCEKQRAhCyADIAtqIQwgDCQAIAoPCw0BAX9BuJIEIQAgAA8LVwEJfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEMEBIQUgAyAFNgIIQQAhBiAEIAY2AgQgAygCCCEHQRAhCCADIAhqIQkgCSQAIAcPC0EBCX8jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEKAIEIQVBCCEGIAUgBkshB0EBIQggByAIcSEJIAkPCysBBX8jACEBQRAhAiABIAJrIQMgAyAANgIMIAMoAgwhBCAEKAIEIQUgBQ8LTgEGfyMAIQNBECEEIAMgBGshBSAFIAA2AgwgBSABNgIIIAUgAjYCBCAFKAIMIQYgBSgCCCEHIAYgBzYCACAFKAIEIQggBiAINgIEIAYPC7YBARR/IwAhAkEgIQMgAiADayEEIAQkACAEIAA2AgwgBCABNgIIIAQoAgwhBSAFEMcBIQYgBCAGNgIEIAQoAgghB0EEIQggBCAIaiEJIAkhCiAEIAo2AhwgBCAHNgIYIAQoAhwhCyAEKAIYIQxBECENIAQgDWohDiAOIQ8gDyAMEMgBQRAhECAEIBBqIREgESESIAsgEhDJASAEKAIcIRMgExDKAUEgIRQgBCAUaiEVIBUkACAFDwsMAQF/EMsBIQAgAA8LPgEHfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMIAMoAgwhBCAEEMwBIQVBECEGIAMgBmohByAHJAAgBQ8LWAEIfyMAIQJBECEDIAIgA2shBCAEJAAgBCAANgIMIAQgATYCCCAEKAIMIQUQ6QEhBiAFIAY2AgAgBCgCCCEHIAUgBzYCBEEQIQggBCAIaiEJIAkkACAFDwskAQR/IwAhAUEQIQIgASACayEDIAMgADYCDCADKAIMIQQgBA8LMgIEfwF+IwAhAkEQIQMgAiADayEEIAQgATYCCCAEKAIIIQUgBSkCACEGIAAgBjcCAA8LiAEBD38jACECQRAhAyACIANrIQQgBCAANgIMIAQgATYCCCAEKAIIIQUgBSgCACEGIAQoAgwhByAHKAIAIQggCCAGNgIAIAQoAgghCSAJKAIEIQogBCgCDCELIAsoAgAhDCAMIAo2AgQgBCgCDCENIA0oAgAhDkEIIQ8gDiAPaiEQIA0gEDYCAA8LGwEDfyMAIQFBECECIAEgAmshAyADIAA2AgwPCw0BAX9B/JIEIQAgAA8LJAEEfyMAIQFBECECIAEgAmshAyADIAA2AgwgAygCDCEEIAQPC8sBARl/IwAhAkEQIQMgAiADayEEIAQkACAEIAA2AgwgBCABNgIIIAQoAgghBSAFEJ0BIQYgBCgCDCEHIAcoAgQhCCAHKAIAIQlBASEKIAggCnUhCyAGIAtqIQxBASENIAggDXEhDgJAAkAgDkUNACAMKAIAIQ8gDyAJaiEQIBAoAgAhESARIRIMAQsgCSESCyASIRMgDCATEQAAIRQgBCAUNgIEQQQhFSAEIBVqIRYgFiEXIBcQqwEhGEEQIRkgBCAZaiEaIBokACAYDwshAQR/IwAhAUEQIQIgASACayEDIAMgADYCDEECIQQgBA8LNQEGfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMENEBIQRBECEFIAMgBWohBiAGJAAgBA8LbAELfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMQQghBCAEEMIOIQUgAygCDCEGIAYoAgAhByAGKAIEIQggBSAINgIEIAUgBzYCACADIAU2AgggAygCCCEJQRAhCiADIApqIQsgCyQAIAkPCw0BAX9BhJMEIQAgAA8LwAEBFn8jACEDQRAhBCADIARrIQUgBSQAIAUgADYCDCAFIAE2AgggBSACNgIEIAUoAgghBiAGEJUBIQcgBSgCDCEIIAgoAgQhCSAIKAIAIQpBASELIAkgC3UhDCAHIAxqIQ1BASEOIAkgDnEhDwJAAkAgD0UNACANKAIAIRAgECAKaiERIBEoAgAhEiASIRMMAQsgCiETCyATIRQgBSgCBCEVIBUQYSEWIA0gFiAUEQIAQRAhFyAFIBdqIRggGCQADwshAQR/IwAhAUEQIQIgASACayEDIAMgADYCDEEDIQQgBA8LNQEGfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMENYBIQRBECEFIAMgBWohBiAGJAAgBA8LbAELfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMQQghBCAEEMIOIQUgAygCDCEGIAYoAgAhByAGKAIEIQggBSAINgIEIAUgBzYCACADIAU2AgggAygCCCEJQRAhCiADIApqIQsgCyQAIAkPCw0BAX9BjJMEIQAgAA8L1gEBGH8jACEEQRAhBSAEIAVrIQYgBiQAIAYgADYCDCAGIAE2AgggBiACNgIEIAYgAzYCACAGKAIIIQcgBxCVASEIIAYoAgwhCSAJKAIEIQogCSgCACELQQEhDCAKIAx1IQ0gCCANaiEOQQEhDyAKIA9xIRACQAJAIBBFDQAgDigCACERIBEgC2ohEiASKAIAIRMgEyEUDAELIAshFAsgFCEVIAYoAgQhFiAWEGEhFyAGKAIAIRggGBBhIRkgDiAXIBkgFREGAEEQIRogBiAaaiEbIBskAA8LIQEEfyMAIQFBECECIAEgAmshAyADIAA2AgxBBCEEIAQPCzUBBn8jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDBDbASEEQRAhBSADIAVqIQYgBiQAIAQPC2wBC38jACEBQRAhAiABIAJrIQMgAyQAIAMgADYCDEEIIQQgBBDCDiEFIAMoAgwhBiAGKAIAIQcgBigCBCEIIAUgCDYCBCAFIAc2AgAgAyAFNgIIIAMoAgghCUEQIQogAyAKaiELIAskACAJDwsNAQF/QaCTBCEAIAAPC6oBARR/IwAhAkEQIQMgAiADayEEIAQkACAEIAA2AgwgBCABNgIIIAQoAgghBSAFEJUBIQYgBCgCDCEHIAcoAgQhCCAHKAIAIQlBASEKIAggCnUhCyAGIAtqIQxBASENIAggDXEhDgJAAkAgDkUNACAMKAIAIQ8gDyAJaiEQIBAoAgAhESARIRIMAQsgCSESCyASIRMgDCATEQQAQRAhFCAEIBRqIRUgFSQADwshAQR/IwAhAUEQIQIgASACayEDIAMgADYCDEECIQQgBA8LNQEGfyMAIQFBECECIAEgAmshAyADJAAgAyAANgIMEOEBIQRBECEFIAMgBWohBiAGJAAgBA8LDQEBf0G4kwQhACAADwtsAQt/IwAhAUEQIQIgASACayEDIAMkACADIAA2AgxBCCEEIAQQwg4hBSADKAIMIQYgBigCACEHIAYoAgQhCCAFIAg2AgQgBSAHNgIAIAMgBTYCCCADKAIIIQlBECEKIAMgCmohCyALJAAgCQ8LDQEBf0GwkwQhACAADwsNAQF/QcyRBCEAIAAPCwUAEBwPCwoAIAAoAgQQ7wELFwAgAEEAKAL4mwU2AgRBACAANgL4mwULswQAQeiTBUHJhwQQCEGAlAVB+IQEQQFBABAJQYyUBUGZgwRBAUGAf0H/ABAKQaSUBUGSgwRBAUGAf0H/ABAKQZiUBUGQgwRBAUEAQf8BEApBsJQFQc2BBEECQYCAfkH//wEQCkG8lAVBxIEEQQJBAEH//wMQCkHIlAVB3IEEQQRBgICAgHhB/////wcQCkHUlAVB04EEQQRBAEF/EApB4JQFQfWFBEEEQYCAgIB4Qf////8HEApB7JQFQeyFBEEEQQBBfxAKQfiUBUGeggRBCEKAgICAgICAgIB/Qv///////////wAQtg9BhJUFQZ2CBEEIQgBCfxC2D0GQlQVBk4IEQQQQC0GclQVBmocEQQgQC0G0kQRBlIYEEAxB/JMEQcGMBBAMQcSUBEEEQfqFBBANQZCVBEECQaCGBBANQdyVBEEEQa+GBBANQdSSBBAOQYSWBEEAQfyLBBAPQayWBEEAQeKMBBAPQfySBEEBQZqMBBAPQdSWBEECQcmIBBAPQfyWBEEDQeiIBBAPQaSXBEEEQZCJBBAPQcyXBEEFQa2JBBAPQfSXBEEEQYeNBBAPQZyYBEEFQaWNBBAPQayWBEEAQZOKBBAPQfySBEEBQfKJBBAPQdSWBEECQdWKBBAPQfyWBEEDQbOKBBAPQaSXBEEEQduLBBAPQcyXBEEFQbmLBBAPQcSYBEEIQZiLBBAPQeyYBEEJQfaKBBAPQZSZBEEGQdOJBBAPQbyZBEEHQcyNBBAPCzAAQQBBIjYC/JsFQQBBADYCgJwFEOYBQQBBACgC+JsFNgKAnAVBAEH8mwU2AvibBQuQBAEDfwJAIAJBgARJDQAgACABIAIQECAADwsgACACaiEDAkACQCABIABzQQNxDQACQAJAIABBA3ENACAAIQIMAQsCQCACDQAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLIANBfHEhBAJAIANBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgACADQXxqIgRNDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAACwUAEO0BC/ICAgN/AX4CQCACRQ0AIAAgAToAACAAIAJqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGog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IAIoAlBBAEgNACABRQ0AIAEhAwJAA0AgACADaiIFQX9qLQAAQQpGDQEgA0F/aiIDRQ0CDAALAAsgAiAAIAMgAigCJBEDACIEIANJDQIgASADayEBIAIoAhQhBAwBCyAAIQVBACEDCyAEIAUgARDoARogAiACKAIUIAFqNgIUIAMgAWohBAsgBAtbAQJ/IAIgAWwhBAJAAkAgAygCTEF/Sg0AIAAgBCADEJYCIQAMAQsgAxCPAiEFIAAgBCADEJYCIQAgBUUNACADEJACCwJAIAAgBEcNACACQQAgARsPCyAAIAFuCwcAIAAQrgQLEAAgABCYAhogAEHQABDHDgsWACAAQcyZBDYCACAAQQRqEI8GGiAACw8AIAAQmgIaIABBIBDHDgsxACAAQcyZBDYCACAAQQRqEPEKGiAAQRhqQgA3AgAgAEEQakIANwIAIABCADcCCCAACwIACwQAIAALCgAgAEJ/EKACGgsSACAAIAE3AwggAEIANwMAIAALCgAgAEJ/EKACGgsEAEEACwQAQQALwgEBBH8jAEEQayIDJABBACEEAkADQCACIARMDQECQAJAIAAoAgwiBSAAKAIQIgZPDQAgA0H/////BzYCDCADIAYgBWs2AgggAyACIARrNgIEIANBDGogA0EIaiADQQRqEKUCEKUCIQUgASAAKAIMIAUoAgAiBRCmAhogACAFEKcCDAELIAAgACgCACgCKBEAACIFQX9GDQIgASAFEKgCOgAAQQEhBQsgASAFaiEBIAUgBGohBAwACwALIANBEGokACAECwkAIAAgARCpAgsOACABIAIgABCqAhogAAsPACAAIAAoAgwgAWo2AgwLBQAgAMALKQECfyMAQRBrIgIkACACQQ9qIAEgABC4AyEDIAJBEGokACABIAAgAxsLDgAgACAAIAFqIAIQuQMLBQAQrAILBABBfws1AQF/AkAgACAAKAIAKAIkEQAAEKwCRw0AEKwCDwsgACAAKAIMIgFBAWo2AgwgASwAABCuAgsIACAAQf8BcQsFABCsAgu9AQEFfyMAQRBrIgMkAEEAIQQQrAIhBQJAA0AgAiAETA0BAkAgACgCGCIGIAAoAhwiB0kNACAAIAEsAAAQrgIgACgCACgCNBEBACAFRg0CIARBAWohBCABQQFqIQEMAQsgAyAHIAZrNgIMIAMgAiAEazYCCCADQQxqIANBCGoQpQIhBiAAKAIYIAEgBigCACIGEKYCGiAAIAYgACgCGGo2AhggBiAEaiEEIAEgBmohAQwACwALIANBEGokACAECwUAEKwCCwQAIAALFgAgAEGsmgQQsgIiAEEIahCYAhogAAsTACAAIAAoAgBBdGooAgBqELMCCw0AIAAQswJB2AAQxw4LEwAgACAAKAIAQXRqKAIAahC1AgsHACAAEMECCwcAIAAoAkgLewEBfyMAQRBrIgEkAAJAIAAgACgCAEF0aigCAGoQwgJFDQAgAUEIaiAAENMCGgJAIAFBCGoQwwJFDQAgACAAKAIAQXRqKAIAahDCAhDEAkF/Rw0AIAAgACgCAEF0aigCAGpBARDAAgsgAUEIahDUAhoLIAFBEGokACAACwcAIAAoAgQLCwAgAEHQvgUQlAYLCQAgACABEMUCCwsAIAAoAgAQxgLACyoBAX9BACEDAkAgAkEASA0AIAAoAgggAkECdGooAgAgAXFBAEchAwsgAwsNACAAKAIAEMcCGiAACwkAIAAgARDIAgsIACAAKAIQRQsHACAAEMsCCwcAIAAtAAALDwAgACAAKAIAKAIYEQAACxAAIAAQogQgARCiBHNBAXMLLAEBfwJAIAAoAgwiASAAKAIQRw0AIAAgACgCACgCJBEAAA8LIAEsAAAQrgILNgEBfwJAIAAoAgwiASAAKAIQRw0AIAAgACgCACgCKBEAAA8LIAAgAUEBajYCDCABLAAAEK4CCw8AIAAgACgCECABchCsBAsHACAAIAFGCz8BAX8CQCAAKAIYIgIgACgCHEcNACAAIAEQrgIgACgCACgCNBEBAA8LIAAgAkEBajYCGCACIAE6AAAgARCuAgsHACAAKAIYCwUAEM0CCwgAQf////8HCwQAIAALFgAgAEHcmgQQzgIiAEEEahCYAhogAAsTACAAIAAoAgBBdGooAgBqEM8CCw0AIAAQzwJB1AAQxw4LEwAgACAAKAIAQXRqKAIAahDRAgtcACAAIAE2AgQgAEEAOgAAAkAgASABKAIAQXRqKAIAahC3AkUNAAJAIAEgASgCAEF0aigCAGoQuAJFDQAgASABKAIAQXRqKAIAahC4AhC5AhoLIABBAToAAAsgAAuUAQEBfwJAIAAoAgQiASABKAIAQXRqKAIAahDCAkUNACAAKAIEIgEgASgCAEF0aigCAGoQtwJFDQAgACgCBCIBIAEoAgBBdGooAgBqELoCQYDAAHFFDQAQ/AENACAAKAIEIgEgASgCAEF0aigCAGoQwgIQxAJBf0cNACAAKAIEIgEgASgCAEF0aigCAGpBARDAAgsgAAsEACAACyoBAX8CQCAAKAIAIgJFDQAgAiABEMoCEKwCEMkCRQ0AIABBADYCAAsgAAsEACAACxMAIAAgASACIAAoAgAoAjARAwALBwAgABCuBAsQACAAENkCGiAAQdAAEMcOCxYAIABB7JoENgIAIABBBGoQjwYaIAALDwAgABDbAhogAEEgEMcOCzEAIABB7JoENgIAIABBBGoQ8QoaIABBGGpCADcCACAAQRBqQgA3AgAgAEIANwIIIAALAgALBAAgAAsKACAAQn8QoAIaCwoAIABCfxCgAhoLBABBAAsEAEEAC88BAQR/IwBBEGsiAyQAQQAhBAJAA0AgAiAETA0BAkACQCAAKAIMIgUgACgCECIGTw0AIANB/////wc2AgwgAyAGIAVrQQJ1NgIIIAMgAiAEazYCBCADQQxqIANBCGogA0EEahClAhClAiEFIAEgACgCDCAFKAIAIgUQ5QIaIAAgBRDmAiABIAVBAnRqIQEMAQsgACAAKAIAKAIoEQAAIgVBf0YNAiABIAUQ5wI2AgAgAUEEaiEBQQEhBQsgBSAEaiEEDAALAAsgA0EQaiQAIAQLDgAgASACIAAQ6AIaIAALEgAgACAAKAIMIAFBAnRqNgIMCwQAIAALEQAgACAAIAFBAnRqIAIQ0gMLBQAQ6gILBABBfws1AQF/AkAgACAAKAIAKAIkEQAAEOoCRw0AEOoCDwsgACAAKAIMIgFBBGo2AgwgASgCABDsAgsEACAACwUAEOoCC8UBAQV/IwBBEGsiAyQAQQAhBBDqAiEFAkADQCACIARMDQECQCAAKAIYIgYgACgCHCIHSQ0AIAAgASgCABDsAiAAKAIAKAI0EQEAIAVGDQIgBEEBaiEEIAFBBGohAQwBCyADIAcgBmtBAnU2AgwgAyACIARrNgIIIANBDGogA0EIahClAiEGIAAoAhggASAGKAIAIgYQ5QIaIAAgACgCGCAGQQJ0IgdqNgIYIAYgBGohBCABIAdqIQEMAAsACyADQRBqJAAgBAsFABDqAgsEACAACxYAIABBzJsEEPACIgBBCGoQ2QIaIAALEwAgACAAKAIAQXRqKAIAahDxAgsNACAAEPECQdgAEMcOCxMAIAAgACgCAEF0aigCAGoQ8wILBwAgABDBAgsHACAAKAJIC3sBAX8jAEEQayIBJAACQCAAIAAoAgBBdGooAgBqEP4CRQ0AIAFBCGogABCLAxoCQCABQQhqEP8CRQ0AIAAgACgCAEF0aigCAGoQ/gIQgANBf0cNACAAIAAoAgBBdGooAgBqQQEQ/QILIAFBCGoQjAMaCyABQRBqJAAgAAsLACAAQci+BRCUBgsJACAAIAEQgQMLCgAgACgCABCCAwsTACAAIAEgAiAAKAIAKAIMEQMACw0AIAAoAgAQgwMaIAALCQAgACABEMgCCwcAIAAQywILBwAgAC0AAAsPACAAIAAoAgAoAhgRAAALEAAgABCkBCABEKQEc0EBcwssAQF/AkAgACgCDCIBIAAoAhBHDQAgACAAKAIAKAIkEQAADwsgASgCABDsAgs2AQF/AkAgACgCDCIBIAAoAhBHDQAgACAAKAIAKAIoEQAADwsgACABQQRqNgIMIAEoAgAQ7AILBwAgACABRgs/AQF/AkAgACgCGCICIAAoAhxHDQAgACABEOwCIAAoAgAoAjQRAQAPCyAAIAJBBGo2AhggAiABNgIAIAEQ7AILBAAgAAsWACAAQfybBBCGAyIAQQRqENkCGiAACxMAIAAgACgCAEF0aigCAGoQhwMLDQAgABCHA0HUABDHDgsTACAAIAAoAgBBdGooAgBqEIkDC1wAIAAgATYCBCAAQQA6AAACQCABIAEoAgBBdGooAgBqEPUCRQ0AAkAgASABKAIAQXRqKAIAahD2AkUNACABIAEoAgBBdGooAgBqEPYCEPcCGgsgAEEBOgAACyAAC5QBAQF/AkAgACgCBCIBIAEoAgBBdGooAgBqEP4CRQ0AIAAoAgQiASABKAIAQXRqKAIAahD1AkUNACAAKAIEIgEgASgCAEF0aigCAGoQugJBgMAAcUUNABD8AQ0AIAAoAgQiASABKAIAQXRqKAIAahD+AhCAA0F/Rw0AIAAoAgQiASABKAIAQXRqKAIAakEBEP0CCyAACwQAIAALKgEBfwJAIAAoAgAiAkUNACACIAEQhQMQ6gIQhANFDQAgAEEANgIACyAACwQAIAALEwAgACABIAIgACgCACgCMBEDAAssAQF/IwBBEGsiASQAIAAgAUEPaiABQQ5qEJIDIgBBABCTAyABQRBqJAAgAAsKACAAEOwDEO0DCwIACwoAIAAQlwMQmAMLCwAgACABEJkDIAALDQAgACABQQRqEO4KGgsYAAJAIAAQmwNFDQAgABDwAw8LIAAQ8QMLBAAgAAvPAQEFfyMAQRBrIgIkACAAEJwDAkAgABCbA0UNACAAEJ4DIAAQ8AMgABCsAxD1AwsgARCoAyEDIAEQmwMhBCAAIAEQ9gMgARCdAyEFIAAQnQMiBkEIaiAFQQhqKAIANgIAIAYgBSkCADcCACABQQAQ9wMgARDxAyEFIAJBADoADyAFIAJBD2oQ+AMCQAJAIAAgAUYiBQ0AIAQNACABIAMQpgMMAQsgAUEAEJMDCyAAEJsDIQECQCAFDQAgAQ0AIAAgABCfAxCTAwsgAkEQaiQACxwBAX8gACgCACECIAAgASgCADYCACABIAI2AgALDQAgABClAy0AC0EHdgsCAAsHACAAEPQDCwcAIAAQ+gMLDgAgABClAy0AC0H/AHELKwEBfyMAQRBrIgQkACAAIARBD2ogAxCiAyIDIAEgAhCjAyAEQRBqJAAgAwsHACAAEIMECwwAIAAQhQQgAhCGBAsSACAAIAEgAiABIAIQhwQQiAQLAgALBwAgABDzAwsCAAsKACAAEJ0EEMwDCxgAAkAgABCbA0UNACAAEK0DDwsgABCfAwsfAQF/QQohAQJAIAAQmwNFDQAgABCsA0F/aiEBCyABCwsAIAAgAUEAEOAOCxoAAkAgABCsAhDJAkUNABCsAkF/cyEACyAACxEAIAAQpQMoAghB/////wdxCwoAIAAQpQMoAgQLBwAgABCnAwsLACAAQdi+BRCUBgsPACAAIAAoAgAoAhwRAAALCQAgACABELQDCx0AIAAgASACIAMgBCAFIAYgByAAKAIAKAIQEQ0ACwYAEJQCAAspAQJ/IwBBEGsiAiQAIAJBD2ogASAAEKEEIQMgAkEQaiQAIAEgACADGwsdACAAIAEgAiADIAQgBSAGIAcgACgCACgCDBENAAsPACAAIAAoAgAoAhgRAAALFwAgACABIAIgAyAEIAAoAgAoAhQRCgALDQAgASgCACACKAIASAsrAQF/IwBBEGsiAyQAIANBCGogACABIAIQugMgAygCDCECIANBEGokACACCw0AIAAgASACIAMQuwMLDQAgACABIAIgAxC8AwtpAQF/IwBBIGsiBCQAIARBGGogASACEL0DIARBEGogBEEMaiAEKAIYIAQoAhwgAxC+AxC/AyAEIAEgBCgCEBDAAzYCDCAEIAMgBCgCFBDBAzYCCCAAIARBDGogBEEIahDCAyAEQSBqJAALCwAgACABIAIQwwMLBwAgABDFAwsNACAAIAIgAyAEEMQDCwkAIAAgARDHAwsJACAAIAEQyAMLDAAgACABIAIQxgMaCzgBAX8jAEEQayIDJAAgAyABEMkDNgIMIAMgAhDJAzYCCCAAIANBDGogA0EIahDKAxogA0EQaiQAC0MBAX8jAEEQayIEJAAgBCACNgIMIAMgASACIAFrIgIQzQMaIAQgAyACajYCCCAAIARBDGogBEEIahDOAyAEQRBqJAALBwAgABCYAwsYACAAIAEoAgA2AgAgACACKAIANgIEIAALCQAgACABENADCw0AIAAgASAAEJgDa2oLBwAgABDLAwsYACAAIAEoAgA2AgAgACACKAIANgIEIAALBwAgABDMAwsEACAACxYAAkAgAkUNACAAIAEgAhCSAhoLIAALDAAgACABIAIQzwMaCxgAIAAgASgCADYCACAAIAIoAgA2AgQgAAsJACAAIAEQ0QMLDQAgACABIAAQzANragsrAQF/IwBBEGsiAyQAIANBCGogACABIAIQ0wMgAygCDCECIANBEGokACACCw0AIAAgASACIAMQ1AMLDQAgACABIAIgAxDVAwtpAQF/IwBBIGsiBCQAIARBGGogASACENYDIARBEGogBEEMaiAEKAIYIAQoAhwgAxDXAxDYAyAEIAEgBCgCEBDZAzYCDCAEIAMgBCgCFBDaAzYCCCAAIARBDGogBEEIahDbAyAEQSBqJAALCwAgACABIAIQ3AMLBwAgABDeAwsNACAAIAIgAyAEEN0DCwkAIAAgARDgAwsJACAAIAEQ4QMLDAAgACABIAIQ3wMaCzgBAX8jAEEQayIDJAAgAyABEOIDNgIMIAMgAhDiAzYCCCAAIANBDGogA0EIahDjAxogA0EQaiQAC0YBAX8jAEEQayIEJAAgBCACNgIMIAMgASACIAFrIgJBAnUQ5gMaIAQgAyACajYCCCAAIARBDGogBEEIahDnAyAEQRBqJAALBwAgABDpAwsYACAAIAEoAgA2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ayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEI0FQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEI0FIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IhUgEEIgiCAQIA9UrUIghoR8IhAgAiANQoCABIQiCn4iFiAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58Ig8gAyAEfnwiFEIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gCn58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgCn58IA4gESATVK0gFSARVK18fCIEIA5UrXwgAyAKfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBRCIIggDSAWVK0gDyANVK18IBQgD1StfEIghoR8IgQgAlStfCAEIBAgFVStIBcgEFStfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEI0FIAVBIGogAiAEIAYQjQUgBUEQaiASIAEgBxCQBSAFIAIgBCAHEJAFIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiAVCtfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAsEAEEACwQAQQAL6goCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyIMQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQjQVBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyAMQv///////z+DIQECQCAIDQAgBUHQAGogAyABIAMgASABUCIHG3kgB0EGdK18pyIHQXFqEI0FQRAgB2shCCAFQdgAaikDACEBIAUpA1AhAwsgAUIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQwgA0IDhiEKIAQgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxCNBSAFQTBqIAogASAHEJAFIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgDEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQjQUgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQjQUgBSACIARBASAGaxCQBSAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQkgUOAwABAgMLAkAgBkEERg0AIAQgAyAGQQRLrXwiCiADVK18IQQgCiEDDAMLIAQgAyADQgGDfCIKIANUrXwhBCAKIQMMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxCTBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAv6AQICfwR+IwBBEGsiAiQAIAG9IgRC/////////weDIQUCQAJAIARCNIhC/w+DIgZQDQACQCAGQv8PUQ0AIAVCBIghByAFQjyGIQUgBkKA+AB8IQYMAgsgBUIEiCEHIAVCPIYhBUL//wEhBgwBCwJAIAVQRQ0AQgAhBUIAIQdCACEGDAELIAIgBUIAIASnZ0EgciAFQiCIp2cgBUKAgICAEFQbIgNBMWoQjQVBjPgAIANrrSEGIAJBCGopAwBCgICAgICAwACFIQcgAikDACEFCyAAIAU3AwAgACAGQjCGIARCgICAgICAgICAf4OEIAeENwMIIAJBEGokAAvmAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAAJAIAAgAlQgASADUyABIANRG0UNAEF/DwsgACAChSABIAOFhEIAUg8LAkAgACACViABIANVIAEgA1EbRQ0AQX8PCyAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAuuAQACQAJAIAFBgAhIDQAgAEQAAAAAAADgf6IhAAJAIAFB/w9PDQAgAUGBeGohAQwCCyAARAAAAAAAAOB/oiEAIAFB/RcgAUH9F0kbQYJwaiEBDAELIAFBgXhKDQAgAEQAAAAAAABgA6IhAAJAIAFBuHBNDQAgAUHJB2ohAQwBCyAARAAAAAAAAGADoiEAIAFB8GggAUHwaEsbQZIPaiEBCyAAIAFB/wdqrUI0hr+iCzwAIAAgATcDACAAIARCMIinQYCAAnEgAkKAgICAgIDA//8Ag0IwiKdyrUIwhiACQv///////z+DhDcDCAt1AgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CAEHwACABZyIBQR9zaxCNBSACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQlAUgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+cCAQF/IwBB0ABrIgQkAAJAAkAgA0GAgAFIDQAgBEEgaiABIAJCAEKAgICAgICA//8AEJEFIARBIGpBCGopAwAhAiAEKQMgIQECQCADQf//AU8NACADQYGAf2ohAwwCCyAEQRBqIAEgAkIAQoCAgICAgID//wAQkQUgA0H9/wIgA0H9/wJJG0GCgH5qIQMgBEEQakEIaikDACECIAQpAxAhAQwBCyADQYGAf0oNACAEQcAAaiABIAJCAEKAgICAgICAORCRBSAEQcAAakEIaikDACECIAQpA0AhAQJAIANB9IB+TQ0AIANBjf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQkQUgA0HogX0gA0HogX1LG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEJEFIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwAL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB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BSAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiC1StfSEBIAQgC30hBAsgBUEQaiADIA5CA0IAEJ0FIAUgAyAOQgVCABCdBSAKIAIgAkIBgyILIAR8IgQgA1YgASAEIAtUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL0gYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABCWBUUNACADIAQQnwVFDQAgAkIwiKciBkH//wFxIgdB//8BRw0BCyAFQRBqIAEgAiADIAQQkQUgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxCeBSAFQQhqKQMAIQIgBSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQlgVBAEoNAAJAIAEgCSADIAoQlgVFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQkQUgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEIAkACQCAHRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEJEFIAVB6ABqKQMAIglCMIinQYh/aiEHIAUpA2AhBAsCQCAIDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABCRBSAFQdgAaikDACIKQjCIp0GIf2ohCCAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAcgCEwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQkQUgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgB0F/aiIHIAhKDQALIAghBwsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEJEFIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAEQj+IIQMgB0F/aiEHIARCAYYhBCADIApCAYaEIgpCgICAgICAwABUDQALCyAGQYCAAnEhCAJAIAdBAEoNACAFQcAAaiAEIApC////////P4MgB0H4AGogCHKtQjCGhEIAQoCAgICAgMDDPxCRBSAFQcgAaikDACECIAUpA0AhBAwBCyAKQv///////z+DIAcgCHKtQjCGhCECCyAAIAQ3AwAgACACNwMIIAVBgAFqJAALHAAgACACQv///////////wCDNwMIIAAgATcDAAuVCQIGfwN+IwBBMGsiBCQAQgAhCgJAAkAgAkECSw0AIAJBAnQiAkGMpwRqKAIAIQUgAkGApwRqKAIAIQYDQAJAAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABEIwFIQILIAIQowUNAAtBASEHAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshBwJAIAEoAgQiAiABKAJoRg0AIAEgAkEBajYCBCACLQAAIQIMAQsgARCMBSECC0EAIQgCQAJAAkAgAkFfcUHJAEcNAANAIAhBB0YNAgJAAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABEIwFIQILIAhBgYAEaiEJIAhBAWohCCACQSByIAksAABGDQALCwJAIAhBA0YNACAIQQhGDQEgA0UNAiAIQQRJDQIgCEEIRg0BCwJAIAEpA3AiCkIAUw0AIAEgASgCBEF/ajYCBAsgA0UNACAIQQRJDQAgCkIAUyECA0ACQCACDQAgASABKAIEQX9qNgIECyAIQX9qIghBA0sNAAsLIAQgB7JDAACAf5QQjgUgBEEIaikDACELIAQpAwAhCgwCCwJAAkACQAJAAkAgCA0AQQAhCCACQV9xQc4ARw0AA0AgCEECRg0CAkACQCABKAIEIgIgASgCaEYNACABIAJBAWo2AgQgAi0AACECDAELIAEQjAUhAgsgCEHjhARqIQkgCEEBaiEIIAJB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KQMAQn9C////////v///ABCRBSAHQcAAaiAHKQNQIAdB0ABqQQhqKQMAQn9C////////v///ABCRBSAHQcAAakEIaikDACESIAcpA0AhEwwBCwJAIBIgBEGefmqsWQ0AEPIBQcQANgIAIAdBkAFqIAUQjwUgB0GAAWogBykDkAEgB0GQAWpBCGopAwBCAEKAgICAgIDAABCRBSAHQfAAaiAHKQOAASAHQYABakEIaikDAEIAQoCAgICAgMAAEJEFIAdB8ABqQQhqKQMAIRIgBykDcCETDAELAkAgEEUNAAJAIBBBCEoNACAHQZAGaiAPQQJ0aiICKAIAIQEDQCABQQpsIQEgEEEBaiIQQQlHDQALIAIgATYCAAsgD0EBaiEPCyASpyEQAkAgDEEJTg0AIBJCEVUNACAMIBBKDQACQCASQglSDQAgB0HAAWogBRCPBSAHQbABaiAHKAKQBhCaBSAHQaABaiAHKQPAASAHQcABakEIaikDACAHKQOwASAHQbABakEIaikDABCRBSAHQaABakEIaikDACESIAcpA6ABIRMMAgsCQCASQghVDQAgB0GQAmogBRCPBSAHQYACaiAHKAKQBhCaBSAHQfABaiAHKQOQAiAHQZACakEIaikDACAHKQOAAiAHQYACakEIaikDABCRBSAHQeABakEIIBBrQQJ0QeCmBGooAgAQjwUgB0HQAWogBykD8AEgB0HwAWpBCGopAwAgBykD4AEgB0HgAWpBCGopAwAQngUgB0HQAWpBCGopAwAhEiAHKQPQASETDAILIAcoApAGIQECQCADIBBBfWxqQRtqIgJBHkoNACABIAJ2DQELIAdB4AJqIAUQjwUgB0HQAmogARCaBSAHQcACaiAHKQPgAiAHQeACakEIaikDACAHKQPQAiAHQdACakEIaikDABCRBSAHQbACaiAQQQJ0QbimBGooAgAQjwUgB0GgAmogBykDwAIgB0HAAmpBCGopAwAgBykDsAIgB0GwAmpBCGopAwAQkQUgB0GgAmpBCGopAwAhEiAHKQOgAiETDAELA0AgB0GQBmogDyIOQX9qIg9BAnRqKAIARQ0AC0EAIQwCQAJAIBBBCW8iAQ0AQQAhDQwBCyABQQlqIAEgEkIAUxshCQJAAkAgDg0AQQAhDUEAIQ4MAQtBgJTr3ANBCCAJa0ECdEHgpgRqKAIA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IAUbIANqIQMMAQsCQCAAIAeEUA0AIAhC//8BUg0AIAdCGYinQYCAgAJyIQRB/wEhAwwBCwJAIANB/oABTQ0AQf8BIQNBACEEDAELAkBBgP8AQYH/ACAIUCIFGyIGIANrIgRB8ABMDQBBACEEQQAhAwwBCyACQRBqIAAgByAHQoCAgICAgMAAhCAFGyIHQYABIARrEI0FIAIgACAHIAQQkAUgAkEIaikDACIAQhmIpyEEAkACQCACKQMAIAYgA0cgAikDECACQRBqQQhqKQMAhEIAUnGthCIHUCAAQv///w+DIgBCgICACFQgAEKAgIAIURsNACAEQQFqIQQMAQsgByAAQoCAgAiFhEIAUg0AIARBAXEgBGohBAsgBEGAgIAEcyAEIARB////A0siAxshBAsgAkEgaiQAIANBF3QgAUIgiKdBgICAgHhxciAEcr4LkAQCBX8CfiMAQSBrIgIkACABQv///////z+DIQcCQAJAIAFCMIhC//8BgyIIpyIDQf+Hf2pB/Q9LDQAgAEI8iCAHQgSGhCEHIANBgIh/aq0hCAJAAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIAdCAXwhBwwBCyAAQoCAgICAgICACFINACAHQgGDIAd8IQcLQgAgByAHQv////////8HViIDGyEAIAOtIAh8IQcMAQsCQCAAIAeEUA0AIAhC//8BUg0AIABCPIggB0IEhoRCgICAgICAgASEIQBC/w8hBwwBCwJAIANB/ocBTQ0AQv8PIQdCACEADAELAkBBgPgAQYH4ACAIUCIEGyIFIANrIgZB8ABMDQBCACEAQgAhBwwBCyACQRBqIAAgByAHQoCAgICAgMAAhCAEGyIHQYABIAZrEI0FIAIgACAHIAYQkAUgAikDACIHQjyIIAJBCGopAwBCBIaEIQACQAJAIAdC//////////8PgyAFIANHIAIpAxAgAkEQakEIaikDAIRCAFJxrYQiB0KBgICAgICAgAhUDQAgAEIBfCEADAELIAdCgICAgICAgIAIUg0AIABCAYMgAHwhAAsgAEKAgICAgICACIUgACAAQv////////8HViIDGyEAIAOtIQcLIAJBIGokACAHQjSGIAFCgICAgICAgICAf4OEIACEvwsSAAJAIAANAEEBDwsgACgCAEUL7BUCEH8DfiMAQbACayID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NQIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAIgFBBGo2AgAgACABMgEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMwEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMAAANwMADwsgAiACKAIAIgFBBGo2AgAgACABMQAANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKwMAOQMADwsgACACIAMRAgALCz4BAX8CQCAAUA0AA0AgAUF/aiIBIACnQQ9xQdCtBGotAAAgAnI6AAAgAEIPViEDIABCBIghACADDQALCyABCzYBAX8CQCAAUA0AA0AgAUF/aiIBIACnQQdxQTByOgAAIABCB1YhAiAAQgOIIQAgAg0ACwsgAQuKAQIBfgN/AkACQCAAQoCAgIAQWg0AIAAhAgwBCwNAIAFBf2oiASAAIABCCoAiAkIKfn2nQTByOgAAIABC/////58BViEDIAIhACADDQALCwJAIAJQDQAgAqchAwNAIAFBf2oiASADIANBCm4iBEEKbGtBMHI6AAAgA0EJSyEFIAQhAyAFDQALCyABC28BAX8jAEGAAmsiBSQAAkAgAiADTA0AIARBgMAEcQ0AIAUgASACIANrIgNBgAIgA0GAAkkiAhsQ6gEaAkAgAg0AA0AgACAFQYACEMIFIANBgH5qIgNB/wFLDQALCyAAIAUgAxDCBQsgBUGAAmokAAsRACAAIAEgAkHxAEHyABDABQuTGQMSfwN+AXwjAEGwBGsiBiQAQQAhByAGQQA2AiwCQAJAIAEQzAUiGEJ/VQ0AQQEhCEH8gAQhCSABmiIBEMwFIRgMAQsCQCAEQYAQcUUNAEEBIQhB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DABBtMoFQQEQxQoaCxAAIAAgAUGwvAUQqQoQqgoLDABBwMoFQQEQxgoaCxAAIAAgAUG4vAUQqQoQqgoLDABBzMoFQQEQxwoaCxAAIAAgAUGAvQUQqQoQqgoLDABB1MoFQQEQyAoaCxAAIAAgAUGIvQUQqQoQqgoLFwAgACABNgIEIABB8P4EQQhqNgIAIAALFAAgACABEK4NIgFBBGoQrw0aIAELCwAgACABNgIAIAALCgAgACABELANGgtnAQJ/IwBBEGsiAiQAAkAgASAAELENTQ0AIAAQsg0ACyACQQhqIAAQsw0gARC0DSAAIAIoAggiATYCBCAAIAE2AgAgAigCDCEDIAAQtQ0gASADQQJ0ajYCACAAQQAQtg0gAkEQaiQAC14BA38jAEEQayICJAAgAkEEaiAAIAEQtw0iAygCBCEBIAMoAgghBANAAkAgASAERw0AIAMQuA0aIAJBEGokAA8LIAAQsw0gARC5DRC6DSADIAFBBGoiATYCBAwACwALCQAgAEEBOgAACxAAIAAoAgQgACgCAGtBAnULDAAgACAAKAIAEMwNCwIACzEBAX8jAEEQayIBJAAgASAANgIMIAAgAUEMahDyCiAAKAIEIQAgAUEQaiQAIABBf2oLeAECfyMAQRBrIgMkACABEMsKIANBDGogARDSCiEEAkAgAiAAQQhqIgEQpgpJDQAgASACQQFqENUKCwJAIAEgAhDKCigCAEUNACABIAIQygooAgAQ1goaCyAEENcKIQAgASACEMoKIAA2AgAgBBDTChogA0EQaiQACxQAIAAgARDgCSIBQaTfBDYCACABCxQAIAAgARDgCSIBQcTfBDYCACABCzUAIAAgAxDgCRCICyIDIAI6AAwgAyABNgIIIANBnMsENgIAAkAgAQ0AIANB0MsENgIICyADCxcAIAAgARDgCRCICyIBQYjXBDYCACABCxcAIAAgARDgCRCbCyIBQZzYBDYCACABCx8AIAAgARDgCRCbCyIBQdjTBDYCACABEMEGNgIIIAELFwAgACABEOAJEJsLIgFBsNkENgIAIAELFwAgACABEOAJEJsLIgFBmNsENgIAIAELFwAgACABEOAJEJsLIgFBpNoENgIAIAELFwAgACABEOAJEJsLIgFBjNwENgIAIAELJgAgACABEOAJIgFBrtgAOwEIIAFBiNQENgIA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EJQOCwwAIAAQ/wVBCBDHDgsqAQF/QQAhAwJAIAJB/wBLDQAgAkECdEHQywRqKAIAIAFxQQBHIQMLIAMLTgECfwJAA0AgASACRg0BQQAhBAJAIAEoAgAiBUH/AEsNACAFQQJ0QdDLBGooAgAhBAsgAyAENgIAIANBBGohAyABQQRqIQEMAAsACyABCz8BAX8CQANAIAIgA0YNAQJAIAIoAgAiBEH/AEsNACAEQQJ0QdDLBGooAgAgAXENAgsgAkEEaiECDAALAAsgAgs9AQF/AkADQCACIANGDQEgAigCACIEQf8ASw0BIARBAnRB0MsEaigCACABcUUNASACQQRqIQIMAAsACyACCx0AAkAgAUH/AEsNABD/CiABQQJ0aigCACEBCyABCwgAEO4FKAIAC0UBAX8CQANAIAEgAkYNAQJAIAEoAgAiA0H/AEsNABD/CiABKAIAQQJ0aigCACEDCyABIAM2AgAgAUEEaiEBDAALAAsgAQsdAAJAIAFB/wBLDQAQggsgAUECdGooAgAhAQsgAQsIABDvBSgCAAtFAQF/AkADQCABIAJGDQECQCABKAIAIgNB/wBLDQAQggsgASgCAEECdGooAgAhAwsgASADNgIAIAFBBGohAQwACwALIAELBAAgAQssAAJAA0AgASACRg0BIAMgASwAADYCACADQQRqIQMgAUEBaiEBDAALAAsgAQsOACABIAIgAUGAAUkbwAs5AQF/AkADQCABIAJGDQEgBCABKAIAIgUgAyAFQYABSRs6AAAgBEEBaiEEIAFBBGohAQwACwALIAELBAAgAAsuAQF/IABBnMsENgIAAkAgACgCCCIBRQ0AIAAtAAxBAUcNACABEMgOCyAAEP8FCwwAIAAQiQtBEBDHDgsdAAJAIAFBAEgNABD/CiABQQJ0aigCACEBCyABwAtEAQF/AkADQCABIAJGDQECQCABLAAAIgNBAEgNABD/CiABLAAAQQJ0aigCACEDCyABIAM6AAAgAUEBaiEBDAALAAsgAQsdAAJAIAFBAEgNABCCCyABQQJ0aigCACEBCyABwAtEAQF/AkADQCABIAJGDQECQCABLAAAIgNBAEgNABCCCyABLAAAQQJ0aigCACEDCyABIAM6AAAgAUEBaiEBDAALAAsgAQsEACABCywAAkADQCABIAJGDQEgAyABLQAAOgAAIANB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IGsiBCQAIARBGGogASACEKANIARBEGogBEEMaiAEKAIYIAQoAhwgAxDXAxDYAyAEIAEgBCgCEBChDTYCDCAEIAMgBCgCFBDaAzYCCCAAIARBDGogBEEIahCiDSAEQSBqJAALCwAgACABIAIQow0LCQAgACABEKUNCwwAIAAgASACEKQNGgs4AQF/IwBBEGsiAyQAIAMgARCmDTYCDCADIAIQpg02AgggACADQQxqIANBCGoQ4wMaIANBEGokAAsYACAAIAEoAgA2AgAgACACKAIANgIEIAALCQAgACABEKsNCwcAIAAQpw0LJwEBfyMAQRBrIgEkACABIAA2AgwgAUEMahCoDSEAIAFBEGokACAACwcAIAAQqQ0LCgAgACgCABCqDQsqAQF/IwBBEGsiASQAIAEgADYCDCABQQxqEK8JEOUDIQAgAUEQaiQAIAALCQAgACABEKwNCzUBAX8jAEEQayICJAAgAiAANgIMIAJBDGogASACQQxqEKgNa0ECdRDNCSEAIAJBEGokACAACwsAIAAgATYCACAACwsAIABBADYCACAACwcAIAAQuw0LCwAgAEEAOgAAIAALPQEBfyMAQRBrIgEkACABIAAQvA0QvQ02AgwgARDMAjYCCCABQQxqIAFBCGoQsQMoAgAhACABQRBqJAAgAAsKAEHMggQQlQQACwoAIABBCGoQvw0LGwAgASACQQAQvg0hASAAIAI2AgQgACABNgIACwoAIABBCGoQwA0LAgALJAAgACABNgIAIAAgASgCBCIBNgIEIAAgASACQQJ0ajYCCCAACxEAIAAoAgAgACgCBDYCBCAACwQAIAALCAAgARDKDRoLCwAgAEEAOgB4IAALCgAgAEEIahDCDQsHACAAEMENC0UBAX8jAEEQayIDJAACQAJAIAFBHksNACAALQB4QQFxDQAgAEEBOgB4DAELIANBD2oQxA0gARDFDSEACyADQRBqJAAgAAsKACAAQQRqEMgNCwcAIAAQyQ0LCABB/////wMLCgAgAEEEahDDDQsEACAACwcAIAAQxg0LHQACQCABIAAQxw1NDQAQmQQACyABQQJ0QQQQmgQLBAAgAAsIABCUBEECdgsEACAACwQAIAALBwAgABDLDQsLACAAQQA2AgAgAAs0AQF/IAAoAgQhAgJAA0AgASACRg0BIAAQsw0gAkF8aiIC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ACABNgIAIAALDQAgACgCABCXDhCYDgsHACAAEJoOCwcAIAAQmQ4LDQAgACgCABCbDjYCBAsHACAAKAIACxkBAX9BAEEAKALEvgVBAWoiADYCxL4FIAALFgAgACABEJ8OIgFBBGogAhCzBBogAQsHACAAEKAOCwoAIABBBGoQtAQLDgAgACABKAIANgIAIAALBAAgAAteAQJ/IwBBEGsiAyQAAkAgAiAAEM0GIgRNDQAgACACIARrEJUJCyAAIAIQlgkgA0EANgIMIAEgAkECdGogA0EMahCMCQJAIAIgBE8NACAAIAQQkAkLIANBEGokACAACwoAIAEgAGtBDG0LCwAgACABIAIQ3QULBQAQpQ4LCABBgICAgHgLBQAQqA4LBQAQqQ4LDQBCgICAgICAgICAfwsNAEL///////////8ACwsAIAAgASACENoFCwUAEKwOCwYAQf//AwsFABCuDgsEAEJ/CwwAIAAgARDBBhD7BQsMACAAIAEQwQYQ/AULPQIBfwF+IwBBEGsiAyQAIAMgASACEMEGEP0FIAMpAwAhBCAAIANBCGopAwA3AwggACAENwMAIANBEGokAAsKACABIABrQQxtCw4AIAAgASgCADYCACAACwQAIAALBAAgAAsOACAAIAEoAgA2AgAgAAsHACAAELkOCwoAIABBBGoQtAQLBAAgAAsEACAACw4AIAAgASgCADYCACAACwQAIAALBAAgAAsFABDjCgsEACAACwMAAAtFAQJ/IwBBEGsiAiQAQQAhAwJAIABBA3ENACABIABwDQAgAkEMaiAAIAEQ+gEhAEEAIAIoAgwgABshAwsgAkEQaiQAIAMLEwACQCAAEMMOIgANABDEDgsgAAsxAQJ/IABBASAAQQFLGyEBAkADQCABEPQBIgINARD4DiIARQ0BIAARCAAMAAsACyACCwYAEM8OAAsHACAAEMIOCwcAIAAQ9gELBwAgABDGDgsHACAAEMYOCxUAAkAgACABEMoOIgENABDEDgsgAQs/AQJ/IAFBBCABQQRLGyECIABBASAAQQFLGyEAAkADQCACIAAQyw4iAw0BEPgOIgFFDQEgAREIAAwACwALIAMLIQEBfyAAIAEgACABakF/akEAIABrcSICIAEgAksbEMEOCwcAIAAQzQ4LBwAgABD2AQsJACAAIAIQzA4LBgAQlAIACwYA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BUIgiKcQow8gBacLGQAgACABIAIgAyAEIAWtIAatQiCGhBCuDwsjACAAIAEgAiADIAQgBa0gBq1CIIaEIAetIAitQiCGhBCvDwslACAAIAEgAiADIAQgBSAGrSAHrUIghoQgCK0gCa1CIIaEELAPCxwAIAAgASACIAOnIANCIIinIASnIARCIIinEBkLEwAgACABpyABQiCIpyACIAMQGgsL8psBAgBBgIAEC4SYAWluZmluaXR5AEZlYnJ1YXJ5AEphbnVhcnkASnVseQBnZXREYXRhQXJyYXkAVGh1cnNkYXkAVHVlc2RheQBXZWRuZXNkYXkAU2F0dXJkYXkAU3VuZGF5AE1vbmRheQBGcmlkYXkATWF5ACVtLyVkLyV5AC0rICAgMFgweAAtMFgrMFggMFgtMHgrMHggMHgATm92AFRodQB1bnN1cHBvcnRlZCBsb2NhbGUgZm9yIHN0YW5kYXJkIGlucHV0AEF1Z3VzdAB1bnNpZ25lZCBzaG9ydAB1bnNpZ25lZCBpbnQAc2V0Qnl0ZUFsaWdubWVudABnZXRCeXRlQWxpZ25tZW50AGdldEN1cnNvckJpdABPY3QAZmxvYXQAU2F0AHVpbnQ2NF90AHdyaXRlQml0cwB0eXBlZFdyaXRlQml0cwByZWFkQml0cwBBcHIAdmVjdG9yAG1vbmV5X2dldCBlcnJvcgB0b0J1ZmZlcgBPY3RvYmVyAE5vdmVtYmVyAFNlcHRlbWJlcgBEZWNlbWJlcgB1bnNpZ25lZCBjaGFyAGlvc19iYXNlOjpjbGVhcgBNYXIAc3lzdGVtL2xpYi9saWJjeHhhYmkvc3JjL3ByaXZhdGVfdHlwZWluZm8uY3BwAGJpdHN0cmVhbS5jcHAAU2VwACVJOiVNOiVTICVwAFN1bgBKdW4Ac2V0Q3Vyc29yQml0UG9zaXRpb24AZ2V0Q3Vyc29yQml0UG9zaXRpb24Ac2V0RW5kT2ZTdHJlYW1Qb3NpdGlvbgBnZXRFbmRPZlN0cmVhbVBvc2l0aW9uAE1vbgBuYW4ASmFuAEJpdFN0cmVhbQBKdWwAYm9vbABsbABBcHJpbAB3cml0ZUJpdHNQYWNrAHR5cGVkV3JpdGVCaXRzUGFjawBGcmkAcG9zaXRpb24gPD0gYml0TGVuZ3RoAGdldEJpdExlbmd0aABnZXRMZW5ndGgAY2FuX2NhdGNoAE1hcmNoAEF1ZwB1bnNpZ25lZCBsb25nAHN0ZDo6d3N0cmluZwBiYXNpY19zdHJpbmcAc3RkOjpzdHJpbmcAc3RkOjp1MTZzdHJpbmcAc3RkOjp1MzJzdHJpbmcAaW5mACUuMExmACVMZgB0aGlzLT5zaXplIDw9IHRoaXMtPm1heFNpemUAdHJ1ZQBUdWUAZ2V0Q3Vyc29yQnl0ZQBhbGlnbkJ5dGUAV3JpdGUAZmFsc2UASnVuZQBkb3VibGUAQml0U3RyZWFtTW9kZQAlMCpsbGQAJSpsbGQAKyVsbGQAJSsuNGxkAHZvaWQAbG9jYWxlIG5vdCBzdXBwb3J0ZWQAV2VkAFJlYWQAJVktJW0tJWQARGVjAEZlYgAlYSAlYiAlZCAlSDolTTolUyAlWQBQT1NJWAAlSDolTTolUwBOQU4AUE0AQU0AJUg6JU0ATENfQUxMAEFTQ0lJAExBTkcASU5GAEMAZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZmxvYXQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ2NF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ2NF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8Y2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgY2hhcj4Ac3RkOjpiYXNpY19zdHJpbmc8dW5zaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGRvdWJsZT4AMDEyMzQ1Njc4OQBDLlVURi04AG51bUJpdHMgPD0gMzIAY3Vyc29yX1UzMl9iaXQgPT0gMAB0aGlzLT5jdXJzb3IuYml0ID09IDAALgAtAChudWxsKQAlAGFkanVzdGVkUHRyICYmICJjYXRjaGluZyBhIGNsYXNzIHdpdGhvdXQgYW4gb2JqZWN0PyIAISJSZWFkIG9mZiBvZiB0aGUgZW5kIG9mIHRoZSBiaXRzdHJlYW0hIgBQdXJlIHZpcnR1YWwgZnVuY3Rpb24gY2FsbGVkIQBsaWJjKythYmk6IABJbml0aWFsaXplZCBCaXRTdHJlYW0gd2l0aCBzdGQ6OnN0cmluZyBpbnB1dC4uLgoACQA5Qml0U3RyZWFtAAAA+EoBAP8HAQBQOUJpdFN0cmVhbQDYSwEAFAgBAAAAAAAMCAEAUEs5Qml0U3RyZWFtAAAAANhLAQAwCAEAAQAAAAwIAQBwcAB2AHZwAAAAAAAAAAAAIAgBALQIAQBUSgEAzAgBAFRKAQBOU3QzX18yMTJiYXNpY19zdHJpbmdJY05TXzExY2hhcl90cmFpdHNJY0VFTlNfOWFsbG9jYXRvckljRUVFRQAA+EoBAHQIAQAxM0JpdFN0cmVhbU1vZGUArEoBALwIAQBwcHBpaWkAAOhJAQAgCAEASEoBAHZwcGkAAAAASEoBAEAIAQBpcHAAAAAAAOhJAQAgCAEASEoBAFRKAQB2cHBpaQAAAFRKAQAgCAEASEoBAGlwcGkAAAAAtAgBACAIAQBwcHAAVAkBACAIAQBOMTBlbXNjcmlwdGVuM3ZhbEUAAPhKAQBACQEATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaEVFAAD4SgEAXAkBAFRKAQBACAEA6EkBACAIAQBUSgEAAAAAAAAAAADoSQEAIAgBAFRKAQBUSgEA6EkBACAIAQB2cHAATlN0M19fMjEyYmFzaWNfc3RyaW5nSWhOU18xMWNoYXJfdHJhaXRzSWhFRU5TXzlhbGxvY2F0b3JJaEVFRUUAAPhKAQC8CQEATlN0M19fMjEyYmFzaWNfc3RyaW5nSXdOU18xMWNoYXJfdHJhaXRzSXdFRU5TXzlhbGxvY2F0b3JJd0VFRUUAAPhKAQAECgEATlN0M19fMjEyYmFzaWNfc3RyaW5nSURzTlNfMTFjaGFyX3RyYWl0c0lEc0VFTlNfOWFsbG9jYXRvcklEc0VFRUUAAAD4SgEATAoBAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0lEaU5TXzExY2hhcl90cmFpdHNJRGlFRU5TXzlhbGxvY2F0b3JJRGlFRUVFAAAA+EoBAJgKAQBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0ljRUUAAPhKAQDkCgEATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJYUVFAAD4SgEADAsBAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXNFRQAA+EoBADQLAQBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0l0RUUAAPhKAQBcCwEATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaUVFAAD4SgEAhAsBAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWpFRQAA+EoBAKwLAQBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lsRUUAAPhKAQDUCwEATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJbUVFAAD4SgEA/AsBAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXhFRQAA+EoBACQMAQBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0l5RUUAAPhKAQBMDAEATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZkVFAAD4SgEAdAwBAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWRFRQAA+EoBAJwMAQAAAAAAgA4BACMAAAAkAAAAJQAAACYAAAAnAAAAKAAAACkAAAAqAAAAKwAAACwAAAAtAAAALgAAAC8AAAAwAAAACAAAAAAAAAC4DgEAMQAAADIAAAD4////+P///7gOAQAzAAAANAAAABANAQAkDQEABAAAAAAAAAAADwEANQAAADYAAAD8/////P///wAPAQA3AAAAOAAAAEANAQBUDQEAAAAAAJQPAQA5AAAAOgAAADsAAAA8AAAAPQAAAD4AAAA/AAAAQAAAAEEAAABCAAAAQwAAAEQAAABFAAAARgAAAAgAAAAAAAAAzA8BAEcAAABIAAAA+P////j////MDwEASQAAAEoAAACwDQEAxA0BAAQAAAAAAAAAFBABAEsAAABMAAAA/P////z///8UEAEATQAAAE4AAADgDQEA9A0BAAAAAABADgEATwAAAFAAAABOU3QzX18yOWJhc2ljX2lvc0ljTlNfMTFjaGFyX3RyYWl0c0ljRUVFRQAAACBLAQAUDgEAUBABAE5TdDNfXzIxNWJhc2ljX3N0cmVhbWJ1ZkljTlNfMTFjaGFyX3RyYWl0c0ljRUVFRQAAAAD4SgEATA4BAE5TdDNfXzIxM2Jhc2ljX2lzdHJlYW1JY05TXzExY2hhcl90cmFpdHNJY0VFRUUAAHxLAQCIDgEAAAAAAAEAAABADgEAA/T//05TdDNfXzIxM2Jhc2ljX29zdHJlYW1JY05TXzExY2hhcl90cmFpdHNJY0VFRUUAAHxLAQDQDgEAAAAAAAEAAABADgEAA/T//wAAAABUDwEAUQAAAFIAAABOU3QzX18yOWJhc2ljX2lvc0l3TlNfMTFjaGFyX3RyYWl0c0l3RUVFRQAAACBLAQAoDwEAUBABAE5TdDNfXzIxNWJhc2ljX3N0cmVhbWJ1Zkl3TlNfMTFjaGFyX3RyYWl0c0l3RUVFRQAAAAD4SgEAYA8BAE5TdDNfXzIxM2Jhc2ljX2lzdHJlYW1Jd05TXzExY2hhcl90cmFpdHNJd0VFRUUAAHxLAQCcDwEAAAAAAAEAAABUDwEAA/T//05TdDNfXzIxM2Jhc2ljX29zdHJlYW1Jd05TXzExY2hhcl90cmFpdHNJd0VFRUUAAHxLAQDkDwEAAAAAAAEAAABUDwEAA/T//wAAAABQEAEAUwAAAFQAAABOU3QzX18yOGlvc19iYXNlRQAAAPhKAQA8EAEAEEwBAKBMAQA4TQEAAAAAAAAAAAAAAAAA3hIElQAAAAD///////////////9wEAEAFAAAAEMuVVRGLTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEEAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAMADAADABAAAwAUAAMAGAADABwAAwAgAAMAJAADACgAAwAsAAMAMAADADQAAwA4AAMAPAADAEAAAwBEAAMASAADAEwAAwBQAAMAVAADAFgAAwBcAAMAYAADAGQAAwBoAAMAbAADAHAAAwB0AAMAeAADAHwAAwAAAALMBAADDAgAAwwMAAMMEAADDBQAAwwYAAMMHAADDCAAAwwkAAMMKAADDCwAAwwwAAMMNAADTDgAAww8AAMMAAAy7AQAMwwIADMMDAAzDBAAM2wAAAAAEEgEAIwAAAFwAAABdAAAAJgAAACcAAAAoAAAAKQAAACoAAAArAAAAXgAAAF8AAABgAAAALwAAADAAAABOU3QzX18yMTBfX3N0ZGluYnVmSWNFRQAgSwEA7BEBAIAOAQAAAAAAbBIBACMAAABhAAAAYgAAACYAAAAnAAAAKAAAAGMAAAAqAAAAKwAAACwAAAAtAAAALgAAAGQAAABlAAAATlN0M19fMjExX19zdGRvdXRidWZJY0VFAAAAACBLAQBQEgEAgA4BAAAAAADQEgEAOQAAAGYAAABnAAAAPAAAAD0AAAA+AAAAPwAAAEAAAABBAAAAaAAAAGkAAABqAAAARQAAAEYAAABOU3QzX18yMTBfX3N0ZGluYnVmSXdFRQAgSwEAuBIBAJQPAQAAAAAAOBMBADkAAABrAAAAbAAAADwAAAA9AAAAPgAAAG0AAABAAAAAQQAAAEIAAABDAAAARAAAAG4AAABvAAAATlN0M19fMjExX19zdGRvdXRidWZJd0VFAAAAACBLAQAcEwEAlA8BAAAAAAAAAAAAAAAAANF0ngBXnb0qgHBSD///PicKAAAAZAAAAOgDAAAQJwAAoIYBAEBCDwCAlpgAAOH1BRgAAAA1AAAAcQAAAGv////O+///kr///wAAAAAAAAAA/////////////////////////////////////////////////////////////////wABAgMEBQYHCAn/////////CgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiP///////8KCwwNDg8QERITFBUWFxgZGhscHR4fICEiI///////////////////////////////////////////////////////////////////////////////////////////////////////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AAAAPQAAAD4AAAA/AAAAQAAAAEEAAABCAAAAQwAAAEQAAABFAAAARgAAAEcAAABIAAAASQAAAEoAAABLAAAATAAAAE0AAABOAAAATwAAAFAAAABRAAAAUgAAAFMAAABUAAAAVQAAAFYAAABXAAAAWAAAAFkAAABaAAAAWwAAAFwAAABdAAAAXgAAAF8AAABgAAAAQQAAAEIAAABDAAAARAAAAEUAAABGAAAARwAAAEgAAABJAAAASgAAAEsAAABMAAAATQAAAE4AAABPAAAAUAAAAFEAAABSAAAAUwAAAFQAAABVAAAAVgAAAFcAAABYAAAAWQAAAFoAAAB7AAAAfAAAAH0AAAB+AAAAfwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkCABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAABQAAAAUAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAADAgAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAQgEAAEIBAABCAQAAQgEAAEIBAABCAQAAQgEAAEIBAABCAQAAQgEAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAAAqAQAAKgEAACoBAAAqAQAAKgEAACoBAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAADIBAAAyAQAAMgEAADIBAAAyAQAAMgEAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAggAAAIIAAACCAAAAggAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAEoAAAB1AAAAbgAAAAAAAABKAAAAdQAAAGwAAAAAAAAAQQAAAHUAAABnAAAAAAAAAFMAAABlAAAAcAAAAAAAAABPAAAAYwAAAHQAAAAAAAAATgAAAG8AAAB2AAAAAAAAAEQAAABlAAAAYwAAAAAAAABBAAAATQAAAAAAAABQAAAATQAAAAAAAAAAAAAALDQBACABAAAhAQAAIgEAACMBAAAkAQAAJQEAACYBAAAAAAAAGDUBADABAAAxAQAAMgEAADMBAAA0AQAANQEAADYBAAAAAAAAoD8BAHkBAAB6AQAAewEAAE5TdDNfXzIxNF9fc2hhcmVkX2NvdW50RQAAAAD4SgEAhD8BAE5vIGVycm9yIGluZm9ybWF0aW9uAElsbGVnYWwgYnl0ZSBzZXF1ZW5jZQBEb21haW4gZXJyb3IAUmVzdWx0IG5vdCByZXByZXNlbnRhYmxlAE5vdCBhIHR0eQBQZXJtaXNzaW9uIGRlbmllZABPcGVyYXRpb24gbm90IHBlcm1pdHRlZABObyBzdWNoIGZpbGUgb3IgZGlyZWN0b3J5AE5vIHN1Y2ggcHJvY2VzcwBGaWxlIGV4aXN0cwBWYWx1ZSB0b28gbGFyZ2UgZm9yIGRhdGEgdHlwZQBObyBzcGFjZSBsZWZ0IG9uIGRldmljZQBPdXQgb2YgbWVtb3J5AFJlc291cmNlIGJ1c3kASW50ZXJydXB0ZWQgc3lzdGVtIGNhbGwAUmVzb3VyY2UgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGUASW52YWxpZCBzZWVrAENyb3NzLWRldmljZSBsaW5rAFJlYWQtb25seSBmaWxlIHN5c3RlbQBEaXJlY3Rvcnkgbm90IGVtcHR5AENvbm5lY3Rpb24gcmVzZXQgYnkgcGVlcgBPcGVyYXRpb24gdGltZWQgb3V0AENvbm5lY3Rpb24gcmVmdXNlZABIb3N0IGlzIGRvd24ASG9zdCBpcyB1bnJlYWNoYWJsZQBBZGRyZXNzIGluIHVzZQBCcm9rZW4gcGlwZQBJL08gZXJyb3IATm8gc3VjaCBkZXZpY2Ugb3IgYWRkcmVzcwBCbG9jayBkZXZpY2UgcmVxdWlyZWQATm8gc3VjaCBkZXZpY2UATm90IGEgZGlyZWN0b3J5AElzIGEgZGlyZWN0b3J5AFRleHQgZmlsZSBidXN5AEV4ZWMgZm9ybWF0IGVycm9yAEludmFsaWQgYXJndW1lbnQAQXJndW1lbnQgbGlzdCB0b28gbG9uZwBTeW1ib2xpYyBsaW5rIGxvb3AARmlsZW5hbWUgdG9vIGxvbmcAVG9vIG1hbnkgb3BlbiBmaWxlcyBpbiBzeXN0ZW0ATm8gZmlsZSBkZXNjcmlwdG9ycyBhdmFpbGFibGUAQmFkIGZpbGUgZGVzY3JpcHRvcgBObyBjaGlsZCBwcm9jZXNzAEJhZCBhZGRyZXNzAEZpbGUgdG9vIGxhcmdlAFRvbyBtYW55IGxpbmtzAE5vIGxvY2tzIGF2YWlsYWJsZQBSZXNvdXJjZSBkZWFkbG9jayB3b3VsZCBvY2N1cgBTdGF0ZSBub3QgcmVjb3ZlcmFibGUAUHJldmlvdXMgb3duZXIgZGllZABPcGVyYXRpb24gY2FuY2VsZWQARnVuY3Rpb24gbm90IGltcGxlbWVudGVkAE5vIG1lc3NhZ2Ugb2YgZGVzaXJlZCB0eXBlAElkZW50aWZpZXIgcmVtb3ZlZABEZXZpY2Ugbm90IGEgc3RyZWFtAE5vIGRhdGEgYXZhaWxhYmxlAERldmljZSB0aW1lb3V0AE91dCBvZiBzdHJlYW1zIHJlc291cmNlcwBMaW5rIGhhcyBiZWVuIHNldmVyZWQAUHJvdG9jb2wgZXJyb3IAQmFkIG1lc3NhZ2UARmlsZSBkZXNjcmlwdG9yIGluIGJhZCBzdGF0ZQBOb3QgYSBzb2NrZXQARGVzdGluYXRpb24gYWRkcmVzcyByZXF1aXJlZABNZXNzYWdlIHRvbyBsYXJnZQBQcm90b2NvbCB3cm9uZyB0eXBlIGZvciBzb2NrZXQAUHJvdG9jb2wgbm90IGF2YWlsYWJsZQBQcm90b2NvbCBub3Qgc3VwcG9ydGVkAFNvY2tldCB0eXBlIG5vdCBzdXBwb3J0ZWQATm90IHN1cHBvcnRlZABQcm90b2NvbCBmYW1pbHkgbm90IHN1cHBvcnRlZABBZGRyZXNzIGZhbWlseSBub3Qgc3VwcG9ydGVkIGJ5IHByb3RvY29sAEFkZHJlc3Mgbm90IGF2YWlsYWJsZQBOZXR3b3JrIGlzIGRvd24ATmV0d29yayB1bnJlYWNoYWJsZQBDb25uZWN0aW9u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';
    return f;
}

var wasmBinaryFile;

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  var binary = tryParseAsDataURI(file);
  if (binary) {
    return binary;
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw 'sync fetching of the wasm failed: you can preload it to Module["wasmBinary"] manually, or emcc.py will do that for you when generating HTML (but not JS)';
}

function getBinaryPromise(binaryFile) {

  // Otherwise, getBinarySync should be able to get it synchronously
  return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateSync(file, info) {
  var module;
  var binary = getBinarySync(file);
  module = new WebAssembly.Module(binary);
  var instance = new WebAssembly.Instance(module, info);
  return [instance, module];
}

function getWasmImports() {
  // prepare imports
  return {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  }
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  var info = getWasmImports();
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    

    wasmMemory = wasmExports['memory'];
    
    assert(wasmMemory, 'memory not found in wasm exports');
    updateMemoryViews();

    wasmTable = wasmExports['__indirect_function_table'];
    
    assert(wasmTable, 'table not found in wasm exports');

    addOnInit(wasmExports['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {
    try {
      return Module['instantiateWasm'](info, receiveInstance);
    } catch(e) {
      err(`Module.instantiateWasm callback failed with error: ${e}`);
        // If instantiation fails, reject the module ready promise.
        readyPromiseReject(e);
    }
  }

  if (!wasmBinaryFile) wasmBinaryFile = findWasmBinary();

  var result = instantiateSync(wasmBinaryFile, info);
  // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193,
  // the above line no longer optimizes out down to the following line.
  // When the regression is fixed, we can remove this if/else.
  return receiveInstance(result[0]);
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// include: runtime_debug.js
// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
})();

function legacyModuleProp(prop, newName, incoming=true) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      get() {
        let extra = incoming ? ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)' : '';
        abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);

      }
    });
  }
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingGlobal(sym, msg) {
  if (typeof globalThis != 'undefined') {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
        return undefined;
      }
    });
  }
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');
missingGlobal('asm', 'Please use wasmExports instead');

function missingLibrarySymbol(sym) {
  if (typeof globalThis != 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        // Can't `abort()` here because it would break code that does runtime
        // checks.  e.g. `if (typeof SDL === 'undefined')`.
        var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
        // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
        // library.js, which means $name for a JS name with no prefix, or name
        // for a JS name like _name.
        var librarySymbol = sym;
        if (!librarySymbol.startsWith('_')) {
          librarySymbol = '$' + sym;
        }
        msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        warnOnce(msg);
        return undefined;
      }
    });
  }
  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      }
    });
  }
}

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}
// end include: runtime_debug.js
// === Body ===
// end include: preamble.js


  /** @constructor */
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': abort('to do getValue(i64) use WASM_BIGINT');
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = Module['noExitRuntime'] || true;

  var ptrToString = (ptr) => {
      assert(typeof ptr === 'number');
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    };

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': abort('to do setValue(i64) use WASM_BIGINT');
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };

  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder() : undefined;
  
    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
  var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.  Also, use the length info to avoid running tiny
      // strings through TextDecoder, since .subarray() allocates garbage.
      // (As a tiny code save trick, compare endPtr against endIdx using a negation,
      // so that undefined means Infinity)
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      // If building with TextDecoder, we have already computed the string length
      // above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
  var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  var ___assert_fail = (condition, filename, line, func) => {
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
    };

  var __abort_js = () => {
      abort('native code called abort()');
    };

  var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {};

  var embind_init_charCodes = () => {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    };
  var embind_charCodes;
  var readLatin1String = (ptr) => {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    };
  
  var awaitingDependencies = {
  };
  
  var registeredTypes = {
  };
  
  var typeDependencies = {
  };
  
  var BindingError;
  var throwBindingError = (message) => { throw new BindingError(message); };
  
  
  
  
  var InternalError;
  var throwInternalError = (message) => { throw new InternalError(message); };
  var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
      myTypes.forEach((type) => typeDependencies[type] = dependentTypes);
  
      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError('Mismatched type converter count');
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
  
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach((dt, i) => {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(() => {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    };
  /** @param {Object=} options */
  function sharedRegisterType(rawType, registeredInstance, options = {}) {
      var name = registeredInstance.name;
      if (!rawType) {
        throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError(`Cannot register type '${name}' twice`);
        }
      }
  
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
  
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach((cb) => cb());
      }
    }
  /** @param {Object=} options */
  function registerType(rawType, registeredInstance, options = {}) {
      if (!('argPackAdvance' in registeredInstance)) {
        throw new TypeError('registerType registeredInstance requires argPackAdvance');
      }
      return sharedRegisterType(rawType, registeredInstance, options);
    }
  
  var GenericWireTypeSize = 8;
  /** @suppress {globalThis} */
  var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
      name = readLatin1String(name);
      registerType(rawType, {
          name,
          'fromWireType': function(wt) {
              // ambiguous emscripten ABI: sometimes return values are
              // true or false, and sometimes integers (0 or 1)
              return !!wt;
          },
          'toWireType': function(destructors, o) {
              return o ? trueValue : falseValue;
          },
          argPackAdvance: GenericWireTypeSize,
          'readValueFromPointer': function(pointer) {
              return this['fromWireType'](HEAPU8[pointer]);
          },
          destructorFunction: null, // This type does not need a destructor
      });
    };

  
  
  var shallowCopyInternalPointer = (o) => {
      return {
        count: o.count,
        deleteScheduled: o.deleteScheduled,
        preservePointerOnDelete: o.preservePointerOnDelete,
        ptr: o.ptr,
        ptrType: o.ptrType,
        smartPtr: o.smartPtr,
        smartPtrType: o.smartPtrType,
      };
    };
  
  var throwInstanceAlreadyDeleted = (obj) => {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + ' instance already deleted');
    };
  
  var finalizationRegistry = false;
  
  var detachFinalizer = (handle) => {};
  
  var runDestructor = ($$) => {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    };
  var releaseClassHandle = ($$) => {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
      if (toDelete) {
        runDestructor($$);
      }
    };
  
  var downcastPointer = (ptr, ptrClass, desiredClass) => {
      if (ptrClass === desiredClass) {
        return ptr;
      }
      if (undefined === desiredClass.baseClass) {
        return null; // no conversion
      }
  
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
        return null;
      }
      return desiredClass.downcast(rv);
    };
  
  var registeredPointers = {
  };
  
  var getInheritedInstanceCount = () => Object.keys(registeredInstances).length;
  
  var getLiveInheritedInstances = () => {
      var rv = [];
      for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
          rv.push(registeredInstances[k]);
        }
      }
      return rv;
    };
  
  var deletionQueue = [];
  var flushPendingDeletes = () => {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj['delete']();
      }
    };
  
  var delayFunction;
  
  
  var setDelayFunction = (fn) => {
      delayFunction = fn;
      if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
    };
  var init_embind = () => {
      Module['getInheritedInstanceCount'] = getInheritedInstanceCount;
      Module['getLiveInheritedInstances'] = getLiveInheritedInstances;
      Module['flushPendingDeletes'] = flushPendingDeletes;
      Module['setDelayFunction'] = setDelayFunction;
    };
  var registeredInstances = {
  };
  
  var getBasestPointer = (class_, ptr) => {
      if (ptr === undefined) {
          throwBindingError('ptr should not be undefined');
      }
      while (class_.baseClass) {
          ptr = class_.upcast(ptr);
          class_ = class_.baseClass;
      }
      return ptr;
    };
  var getInheritedInstance = (class_, ptr) => {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    };
  
  
  var makeClassHandle = (prototype, record) => {
      if (!record.ptrType || !record.ptr) {
        throwInternalError('makeClassHandle requires ptr and ptrType');
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError('Both smartPtrType and smartPtr must be specified');
      }
      record.count = { value: 1 };
      return attachFinalizer(Object.create(prototype, {
        $$: {
          value: record,
          writable: true,
        },
      }));
    };
  /** @suppress {globalThis} */
  function RegisteredPointer_fromWireType(ptr) {
      // ptr is a raw pointer (or a raw smartpointer)
  
      // rawPointer is a maybe-null raw pointer
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }
  
      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
      if (undefined !== registeredInstance) {
        // JS object has been neutered, time to repopulate it
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance['clone']();
        } else {
          // else, just increment reference count on existing object
          // it already has a reference to the smart pointer
          var rv = registeredInstance['clone']();
          this.destructor(ptr);
          return rv;
        }
      }
  
      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this.pointeeType,
            ptr: rawPointer,
            smartPtrType: this,
            smartPtr: ptr,
          });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this,
            ptr,
          });
        }
      }
  
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }
  
      var toType;
      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(
          rawPointer,
          this.registeredClass,
          toType.registeredClass);
      if (dp === null) {
        return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
          smartPtrType: this,
          smartPtr: ptr,
        });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
        });
      }
    }
  var attachFinalizer = (handle) => {
      if ('undefined' === typeof FinalizationRegistry) {
        attachFinalizer = (handle) => handle;
        return handle;
      }
      // If the running environment has a FinalizationRegistry (see
      // https://github.com/tc39/proposal-weakrefs), then attach finalizers
      // for class handles.  We check for the presence of FinalizationRegistry
      // at run-time, not build-time.
      finalizationRegistry = new FinalizationRegistry((info) => {
        console.warn(info.leakWarning.stack.replace(/^Error: /, ''));
        releaseClassHandle(info.$$);
      });
      attachFinalizer = (handle) => {
        var $$ = handle.$$;
        var hasSmartPtr = !!$$.smartPtr;
        if (hasSmartPtr) {
          // We should not call the destructor on raw pointers in case other code expects the pointee to live
          var info = { $$: $$ };
          // Create a warning as an Error instance in advance so that we can store
          // the current stacktrace and point to it when / if a leak is detected.
          // This is more useful than the empty stacktrace of `FinalizationRegistry`
          // callback.
          var cls = $$.ptrType.registeredClass;
          info.leakWarning = new Error(`Embind found a leaked C++ instance ${cls.name} <${ptrToString($$.ptr)}>.\n` +
          "We'll free it automatically in this case, but this functionality is not reliable across various environments.\n" +
          "Make sure to invoke .delete() manually once you're done with the instance instead.\n" +
          "Originally allocated"); // `.stack` will add "at ..." after this sentence
          if ('captureStackTrace' in Error) {
            Error.captureStackTrace(info.leakWarning, RegisteredPointer_fromWireType);
          }
          finalizationRegistry.register(handle, info, handle);
        }
        return handle;
      };
      detachFinalizer = (handle) => finalizationRegistry.unregister(handle);
      return attachFinalizer(handle);
    };
  
  
  
  var init_ClassHandle = () => {
      Object.assign(ClassHandle.prototype, {
        "isAliasOf"(other) {
          if (!(this instanceof ClassHandle)) {
            return false;
          }
          if (!(other instanceof ClassHandle)) {
            return false;
          }
  
          var leftClass = this.$$.ptrType.registeredClass;
          var left = this.$$.ptr;
          other.$$ = /** @type {Object} */ (other.$$);
          var rightClass = other.$$.ptrType.registeredClass;
          var right = other.$$.ptr;
  
          while (leftClass.baseClass) {
            left = leftClass.upcast(left);
            leftClass = leftClass.baseClass;
          }
  
          while (rightClass.baseClass) {
            right = rightClass.upcast(right);
            rightClass = rightClass.baseClass;
          }
  
          return leftClass === rightClass && left === right;
        },
  
        "clone"() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
  
          if (this.$$.preservePointerOnDelete) {
            this.$$.count.value += 1;
            return this;
          } else {
            var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
              $$: {
                value: shallowCopyInternalPointer(this.$$),
              }
            }));
  
            clone.$$.count.value += 1;
            clone.$$.deleteScheduled = false;
            return clone;
          }
        },
  
        "delete"() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
  
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError('Object already scheduled for deletion');
          }
  
          detachFinalizer(this);
          releaseClassHandle(this.$$);
  
          if (!this.$$.preservePointerOnDelete) {
            this.$$.smartPtr = undefined;
            this.$$.ptr = undefined;
          }
        },
  
        "isDeleted"() {
          return !this.$$.ptr;
        },
  
        "deleteLater"() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError('Object already scheduled for deletion');
          }
          deletionQueue.push(this);
          if (deletionQueue.length === 1 && delayFunction) {
            delayFunction(flushPendingDeletes);
          }
          this.$$.deleteScheduled = true;
          return this;
        },
      });
    };
  /** @constructor */
  function ClassHandle() {
    }
  
  var createNamedFunction = (name, body) => Object.defineProperty(body, 'name', {
      value: name
    });
  
  
  var ensureOverloadTable = (proto, methodName, humanName) => {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        // Inject an overload resolver function that routes to the appropriate overload based on the number of arguments.
        proto[methodName] = function(...args) {
          // TODO This check can be removed in -O3 level "unsafe" optimizations.
          if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) {
            throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`);
          }
          return proto[methodName].overloadTable[args.length].apply(this, args);
        };
        // Move the previous function into the overload table.
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    };
  
  /** @param {number=} numArguments */
  var exposePublicSymbol = (name, value, numArguments) => {
      if (Module.hasOwnProperty(name)) {
        if (undefined === numArguments || (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])) {
          throwBindingError(`Cannot register public name '${name}' twice`);
        }
  
        // We are exposing a function with the same name as an existing function. Create an overload table and a function selector
        // that routes between the two.
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
        }
        // Add the new function into the overload table.
        Module[name].overloadTable[numArguments] = value;
      }
      else {
        Module[name] = value;
        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    };
  
  var char_0 = 48;
  
  var char_9 = 57;
  var makeLegalFunctionName = (name) => {
      if (undefined === name) {
        return '_unknown';
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, '$');
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return `_${name}`;
      }
      return name;
    };
  
  
  /** @constructor */
  function RegisteredClass(name,
                               constructor,
                               instancePrototype,
                               rawDestructor,
                               baseClass,
                               getActualType,
                               upcast,
                               downcast) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }
  
  
  var upcastPointer = (ptr, ptrClass, desiredClass) => {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }
      return ptr;
    };
  /** @suppress {globalThis} */
  function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
        return 0;
      }
  
      if (!handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
  
  
  /** @suppress {globalThis} */
  function genericPointerToWireType(destructors, handle) {
      var ptr;
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
  
        if (this.isSmartPointer) {
          ptr = this.rawConstructor();
          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }
          return ptr;
        } else {
          return 0;
        }
      }
  
      if (!handle || !handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError(`Cannot convert argument of type ${(handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name)} to parameter type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
  
      if (this.isSmartPointer) {
        // TODO: this is not strictly true
        // We could support BY_EMVAL conversions from raw pointers to smart pointers
        // because the smart pointer can hold a reference to the handle
        if (undefined === handle.$$.smartPtr) {
          throwBindingError('Passing raw pointer to smart pointer is illegal');
        }
  
        switch (this.sharingPolicy) {
          case 0: // NONE
            // no upcasting
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError(`Cannot convert argument of type ${(handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name)} to parameter type ${this.name}`);
            }
            break;
  
          case 1: // INTRUSIVE
            ptr = handle.$$.smartPtr;
            break;
  
          case 2: // BY_EMVAL
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              var clonedHandle = handle['clone']();
              ptr = this.rawShare(
                ptr,
                Emval.toHandle(() => clonedHandle['delete']())
              );
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }
            break;
  
          default:
            throwBindingError('Unsupporting sharing policy');
        }
      }
      return ptr;
    }
  
  
  /** @suppress {globalThis} */
  function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
        return 0;
      }
  
      if (!handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      if (handle.$$.ptrType.isConst) {
          throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
  
  
  /** @suppress {globalThis} */
  function readPointer(pointer) {
      return this['fromWireType'](HEAPU32[((pointer)>>2)]);
    }
  
  
  var init_RegisteredPointer = () => {
      Object.assign(RegisteredPointer.prototype, {
        getPointee(ptr) {
          if (this.rawGetPointee) {
            ptr = this.rawGetPointee(ptr);
          }
          return ptr;
        },
        destructor(ptr) {
          this.rawDestructor?.(ptr);
        },
        argPackAdvance: GenericWireTypeSize,
        'readValueFromPointer': readPointer,
        'fromWireType': RegisteredPointer_fromWireType,
      });
    };
  /** @constructor
      @param {*=} pointeeType,
      @param {*=} sharingPolicy,
      @param {*=} rawGetPointee,
      @param {*=} rawConstructor,
      @param {*=} rawShare,
      @param {*=} rawDestructor,
       */
  function RegisteredPointer(
      name,
      registeredClass,
      isReference,
      isConst,
  
      // smart pointer properties
      isSmartPointer,
      pointeeType,
      sharingPolicy,
      rawGetPointee,
      rawConstructor,
      rawShare,
      rawDestructor
    ) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
  
      // smart pointer properties
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
  
      if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
          this['toWireType'] = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this['toWireType'] = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this['toWireType'] = genericPointerToWireType;
        // Here we must leave this.destructorFunction undefined, since whether genericPointerToWireType returns
        // a pointer that needs to be freed up is runtime-dependent, and cannot be evaluated at registration time.
        // TODO: Create an alternative mechanism that allows removing the use of var destructors = []; array in
        //       craftInvokerFunction altogether.
      }
    }
  
  /** @param {number=} numArguments */
  var replacePublicSymbol = (name, value, numArguments) => {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError('Replacing nonexistent public symbol');
      }
      // If there's an overload table for this symbol, replace the symbol in the overload table instead.
      if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
        Module[name].overloadTable[numArguments] = value;
      }
      else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    };
  
  
  
  var dynCallLegacy = (sig, ptr, args) => {
      sig = sig.replace(/p/g, 'i')
      assert(('dynCall_' + sig) in Module, `bad function pointer type - dynCall function not found for sig '${sig}'`);
      if (args?.length) {
        // j (64-bit integer) must be passed in as two numbers [low 32, high 32].
        assert(args.length === sig.substring(1).replace(/j/g, '--').length);
      } else {
        assert(sig.length == 1);
      }
      var f = Module['dynCall_' + sig];
      return f(ptr, ...args);
    };
  
  var wasmTableMirror = [];
  
  /** @type {WebAssembly.Table} */
  var wasmTable;
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      assert(wasmTable.get(funcPtr) == func, 'JavaScript-side Wasm function table mirror is out of date!');
      return func;
    };
  
  var dynCall = (sig, ptr, args = []) => {
      // Without WASM_BIGINT support we cannot directly call function with i64 as
      // part of their signature, so we rely on the dynCall functions generated by
      // wasm-emscripten-finalize
      if (sig.includes('j')) {
        return dynCallLegacy(sig, ptr, args);
      }
      assert(getWasmTableEntry(ptr), `missing table entry in dynCall: ${ptr}`);
      var rtn = getWasmTableEntry(ptr)(...args);
      return rtn;
    };
  var getDynCaller = (sig, ptr) => {
      assert(sig.includes('j') || sig.includes('p'), 'getDynCaller should only be called with i64 sigs')
      return (...args) => dynCall(sig, ptr, args);
    };
  
  
  var embind__requireFunction = (signature, rawFunction) => {
      signature = readLatin1String(signature);
  
      function makeDynCaller() {
        if (signature.includes('j')) {
          return getDynCaller(signature, rawFunction);
        }
        return getWasmTableEntry(rawFunction);
      }
  
      var fp = makeDynCaller();
      if (typeof fp != "function") {
          throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
      }
      return fp;
    };
  
  
  
  var extendError = (baseErrorType, errorName) => {
      var errorClass = createNamedFunction(errorName, function(message) {
        this.name = errorName;
        this.message = message;
  
        var stack = (new Error(message)).stack;
        if (stack !== undefined) {
          this.stack = this.toString() + '\n' +
              stack.replace(/^Error(:[^\n]*)?\n/, '');
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function() {
        if (this.message === undefined) {
          return this.name;
        } else {
          return `${this.name}: ${this.message}`;
        }
      };
  
      return errorClass;
    };
  var UnboundTypeError;
  
  
  
  var getTypeName = (type) => {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    };
  var throwUnboundTypeError = (message, types) => {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
        if (seen[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }
        unboundTypes.push(type);
        seen[type] = true;
      }
      types.forEach(visit);
  
      throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([', ']));
    };
  
  var __embind_register_class = (rawType,
                             rawPointerType,
                             rawConstPointerType,
                             baseClassRawType,
                             getActualTypeSignature,
                             getActualType,
                             upcastSignature,
                             upcast,
                             downcastSignature,
                             downcast,
                             name,
                             destructorSignature,
                             rawDestructor) => {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
      upcast &&= embind__requireFunction(upcastSignature, upcast);
      downcast &&= embind__requireFunction(downcastSignature, downcast);
      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      var legalFunctionName = makeLegalFunctionName(name);
  
      exposePublicSymbol(legalFunctionName, function() {
        // this code cannot run if baseClassRawType is zero
        throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
      });
  
      whenDependentTypesAreResolved(
        [rawType, rawPointerType, rawConstPointerType],
        baseClassRawType ? [baseClassRawType] : [],
        (base) => {
          base = base[0];
  
          var baseClass;
          var basePrototype;
          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
  
          var constructor = createNamedFunction(name, function(...args) {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError("Use 'new' to construct " + name);
            }
            if (undefined === registeredClass.constructor_body) {
              throw new BindingError(name + " has no accessible constructor");
            }
            var body = registeredClass.constructor_body[args.length];
            if (undefined === body) {
              throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${args.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`);
            }
            return body.apply(this, args);
          });
  
          var instancePrototype = Object.create(basePrototype, {
            constructor: { value: constructor },
          });
  
          constructor.prototype = instancePrototype;
  
          var registeredClass = new RegisteredClass(name,
                                                    constructor,
                                                    instancePrototype,
                                                    rawDestructor,
                                                    baseClass,
                                                    getActualType,
                                                    upcast,
                                                    downcast);
  
          if (registeredClass.baseClass) {
            // Keep track of class hierarchy. Used to allow sub-classes to inherit class functions.
            registeredClass.baseClass.__derivedClasses ??= [];
  
            registeredClass.baseClass.__derivedClasses.push(registeredClass);
          }
  
          var referenceConverter = new RegisteredPointer(name,
                                                         registeredClass,
                                                         true,
                                                         false,
                                                         false);
  
          var pointerConverter = new RegisteredPointer(name + '*',
                                                       registeredClass,
                                                       false,
                                                       false,
                                                       false);
  
          var constPointerConverter = new RegisteredPointer(name + ' const*',
                                                            registeredClass,
                                                            false,
                                                            true,
                                                            false);
  
          registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter
          };
  
          replacePublicSymbol(legalFunctionName, constructor);
  
          return [referenceConverter, pointerConverter, constPointerConverter];
        }
      );
    };

  var heap32VectorToArray = (count, firstElement) => {
      var array = [];
      for (var i = 0; i < count; i++) {
        // TODO(https://github.com/emscripten-core/emscripten/issues/17310):
        // Find a way to hoist the `>> 2` or `>> 3` out of this loop.
        array.push(HEAPU32[(((firstElement)+(i * 4))>>2)]);
      }
      return array;
    };
  
  
  var runDestructors = (destructors) => {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    };
  
  
  
  
  
  
  
  function usesDestructorStack(argTypes) {
      // Skip return value at index 0 - it's not deleted here.
      for (var i = 1; i < argTypes.length; ++i) {
        // The type does not define a destructor function - must use dynamic stack
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
          return true;
        }
      }
      return false;
    }
  
  function newFunc(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
        throw new TypeError(`new_ called with constructor type ${typeof(constructor)} which is not a function`);
      }
      /*
       * Previously, the following line was just:
       *   function dummy() {};
       * Unfortunately, Chrome was preserving 'dummy' as the object's name, even
       * though at creation, the 'dummy' has the correct constructor name.  Thus,
       * objects created with IMVU.new would show up in the debugger as 'dummy',
       * which isn't very helpful.  Using IMVU.createNamedFunction addresses the
       * issue.  Doubly-unfortunately, there's no way to write a test for this
       * behavior.  -NRD 2013.02.22
       */
      var dummy = createNamedFunction(constructor.name || 'unknownFunctionName', function(){});
      dummy.prototype = constructor.prototype;
      var obj = new dummy;
  
      var r = constructor.apply(obj, argumentList);
      return (r instanceof Object) ? r : obj;
    }
  
  function createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync) {
      var needsDestructorStack = usesDestructorStack(argTypes);
      var argCount = argTypes.length - 2;
      var argsList = [];
      var argsListWired = ['fn'];
      if (isClassMethodFunc) {
        argsListWired.push('thisWired');
      }
      for (var i = 0; i < argCount; ++i) {
        argsList.push(`arg${i}`)
        argsListWired.push(`arg${i}Wired`)
      }
      argsList = argsList.join(',')
      argsListWired = argsListWired.join(',')
  
      var invokerFnBody = `
        return function (${argsList}) {
        if (arguments.length !== ${argCount}) {
          throwBindingError('function ' + humanName + ' called with ' + arguments.length + ' arguments, expected ${argCount}');
        }`;
  
      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }
  
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = ["humanName", "throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
  
      if (isClassMethodFunc) {
        invokerFnBody += `var thisWired = classParam['toWireType'](${dtorStack}, this);\n`;
      }
  
      for (var i = 0; i < argCount; ++i) {
        invokerFnBody += `var arg${i}Wired = argType${i}['toWireType'](${dtorStack}, arg${i});\n`;
        args1.push(`argType${i}`);
      }
  
      invokerFnBody += (returns || isAsync ? "var rv = ":"") + `invoker(${argsListWired});\n`;
  
      var returnVal = returns ? "rv" : "";
  
      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc?1:2; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
          var paramName = (i === 1 ? "thisWired" : ("arg"+(i - 2)+"Wired"));
          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody += `${paramName}_dtor(${paramName});\n`;
            args1.push(`${paramName}_dtor`);
          }
        }
      }
  
      if (returns) {
        invokerFnBody += "var ret = retType['fromWireType'](rv);\n" +
                         "return ret;\n";
      } else {
      }
  
      invokerFnBody += "}\n";
  
      invokerFnBody = `if (arguments.length !== ${args1.length}){ throw new Error(humanName + "Expected ${args1.length} closure arguments " + arguments.length + " given."); }\n${invokerFnBody}`;
      return [args1, invokerFnBody];
    }
  function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, /** boolean= */ isAsync) {
      // humanName: a human-readable string name for the function to be generated.
      // argTypes: An array that contains the embind type objects for all types in the function signature.
      //    argTypes[0] is the type object for the function return value.
      //    argTypes[1] is the type object for function this object/class type, or null if not crafting an invoker for a class method.
      //    argTypes[2...] are the actual function parameters.
      // classType: The embind type object for the class to be bound, or null if this is not a method of a class.
      // cppInvokerFunc: JS Function object to the C++-side function that interops into C++ code.
      // cppTargetFunc: Function pointer (an integer to FUNCTION_TABLE) to the target C++ function the cppInvokerFunc will end up calling.
      // isAsync: Optional. If true, returns an async function. Async bindings are only supported with JSPI.
      var argCount = argTypes.length;
  
      if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }
  
      assert(!isAsync, 'Async bindings are only supported with JSPI.');
  
      var isClassMethodFunc = (argTypes[1] !== null && classType !== null);
  
      // Free functions with signature "void function()" do not need an invoker that marshalls between wire types.
  // TODO: This omits argument count check - enable only at -O3 or similar.
  //    if (ENABLE_UNSAFE_OPTS && argCount == 2 && argTypes[0].name == "void" && !isClassMethodFunc) {
  //       return FUNCTION_TABLE[fn];
  //    }
  
      // Determine if we need to use a dynamic stack to store the destructors for the function parameters.
      // TODO: Remove this completely once all function invokers are being dynamically generated.
      var needsDestructorStack = usesDestructorStack(argTypes);
  
      var returns = (argTypes[0].name !== "void");
  
    // Builld the arguments that will be passed into the closure around the invoker
    // function.
    var closureArgs = [humanName, throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
    for (var i = 0; i < argCount - 2; ++i) {
      closureArgs.push(argTypes[i+2]);
    }
    if (!needsDestructorStack) {
      for (var i = isClassMethodFunc?1:2; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
        if (argTypes[i].destructorFunction !== null) {
          closureArgs.push(argTypes[i].destructorFunction);
        }
      }
    }
  
    let [args, invokerFnBody] = createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync);
    args.push(invokerFnBody);
    var invokerFn = newFunc(Function, args)(...closureArgs);
      return createNamedFunction(humanName, invokerFn);
    }
  var __embind_register_class_constructor = (
      rawClassType,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      invoker,
      rawConstructor
    ) => {
      assert(argCount > 0);
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      var args = [rawConstructor];
      var destructors = [];
  
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        var humanName = `constructor ${classType.name}`;
  
        if (undefined === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }
        if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
          throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount-1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        }
        classType.registeredClass.constructor_body[argCount - 1] = () => {
          throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
        };
  
        whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
          // Insert empty slot for context type (argTypes[1]).
          argTypes.splice(1, 0, null);
          classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
          return [];
        });
        return [];
      });
    };

  
  
  
  
  
  
  var getFunctionName = (signature) => {
      signature = signature.trim();
      const argsIndex = signature.indexOf("(");
      if (argsIndex !== -1) {
        assert(signature[signature.length - 1] == ")", "Parentheses for argument names should match.");
        return signature.substr(0, argsIndex);
      } else {
        return signature;
      }
    };
  var __embind_register_class_function = (rawClassType,
                                      methodName,
                                      argCount,
                                      rawArgTypesAddr, // [ReturnType, ThisType, Args...]
                                      invokerSignature,
                                      rawInvoker,
                                      context,
                                      isPureVirtual,
                                      isAsync,
                                      isNonnullReturn) => {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      methodName = getFunctionName(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
  
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        var humanName = `${classType.name}.${methodName}`;
  
        if (methodName.startsWith("@@")) {
          methodName = Symbol[methodName.substring(2)];
        }
  
        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }
  
        function unboundTypesHandler() {
          throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
        }
  
        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];
        if (undefined === method || (undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2)) {
          // This is the first overload to be registered, OR we are replacing a
          // function in the base class with a function in the derived class.
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          // There was an existing function with the same name registered. Set up
          // a function overload routing table.
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }
  
        whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
          var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync);
  
          // Replace the initial unbound-handler-stub function with the
          // appropriate member function, now that all types are resolved. If
          // multiple overloads are registered for this function, the function
          // goes into an overload table.
          if (undefined === proto[methodName].overloadTable) {
            // Set argCount in case an overload is registered later
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }
  
          return [];
        });
        return [];
      });
    };

  
  var emval_freelist = [];
  
  var emval_handles = [];
  var __emval_decref = (handle) => {
      if (handle > 9 && 0 === --emval_handles[handle + 1]) {
        assert(emval_handles[handle] !== undefined, `Decref for unallocated handle.`);
        emval_handles[handle] = undefined;
        emval_freelist.push(handle);
      }
    };
  
  
  
  
  
  var count_emval_handles = () => {
      return emval_handles.length / 2 - 5 - emval_freelist.length;
    };
  
  var init_emval = () => {
      // reserve 0 and some special values. These never get de-allocated.
      emval_handles.push(
        0, 1,
        undefined, 1,
        null, 1,
        true, 1,
        false, 1,
      );
      assert(emval_handles.length === 5 * 2);
      Module['count_emval_handles'] = count_emval_handles;
    };
  var Emval = {
  toValue:(handle) => {
        if (!handle) {
            throwBindingError('Cannot use deleted val. handle = ' + handle);
        }
        // handle 2 is supposed to be `undefined`.
        assert(handle === 2 || emval_handles[handle] !== undefined && handle % 2 === 0, `invalid handle: ${handle}`);
        return emval_handles[handle];
      },
  toHandle:(value) => {
        switch (value) {
          case undefined: return 2;
          case null: return 4;
          case true: return 6;
          case false: return 8;
          default:{
            const handle = emval_freelist.pop() || emval_handles.length;
            emval_handles[handle] = value;
            emval_handles[handle + 1] = 1;
            return handle;
          }
        }
      },
  };
  
  
  var EmValType = {
      name: 'emscripten::val',
      'fromWireType': (handle) => {
        var rv = Emval.toValue(handle);
        __emval_decref(handle);
        return rv;
      },
      'toWireType': (destructors, value) => Emval.toHandle(value),
      argPackAdvance: GenericWireTypeSize,
      'readValueFromPointer': readPointer,
      destructorFunction: null, // This type does not need a destructor
  
      // TODO: do we need a deleteObject here?  write a test where
      // emval is passed into JS via an interface
    };
  var __embind_register_emval = (rawType) => registerType(rawType, EmValType);

  
  var enumReadValueFromPointer = (name, width, signed) => {
      switch (width) {
          case 1: return signed ?
              function(pointer) { return this['fromWireType'](HEAP8[pointer]) } :
              function(pointer) { return this['fromWireType'](HEAPU8[pointer]) };
          case 2: return signed ?
              function(pointer) { return this['fromWireType'](HEAP16[((pointer)>>1)]) } :
              function(pointer) { return this['fromWireType'](HEAPU16[((pointer)>>1)]) };
          case 4: return signed ?
              function(pointer) { return this['fromWireType'](HEAP32[((pointer)>>2)]) } :
              function(pointer) { return this['fromWireType'](HEAPU32[((pointer)>>2)]) };
          default:
              throw new TypeError(`invalid integer width (${width}): ${name}`);
      }
    };
  
  
  /** @suppress {globalThis} */
  var __embind_register_enum = (rawType, name, size, isSigned) => {
      name = readLatin1String(name);
  
      function ctor() {}
      ctor.values = {};
  
      registerType(rawType, {
        name,
        constructor: ctor,
        'fromWireType': function(c) {
          return this.constructor.values[c];
        },
        'toWireType': (destructors, c) => c.value,
        argPackAdvance: GenericWireTypeSize,
        'readValueFromPointer': enumReadValueFromPointer(name, size, isSigned),
        destructorFunction: null,
      });
      exposePublicSymbol(name, ctor);
    };

  
  
  
  
  var requireRegisteredType = (rawType, humanName) => {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
        throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
      }
      return impl;
    };
  var __embind_register_enum_value = (rawEnumType, name, enumValue) => {
      var enumType = requireRegisteredType(rawEnumType, 'enum');
      name = readLatin1String(name);
  
      var Enum = enumType.constructor;
  
      var Value = Object.create(enumType.constructor.prototype, {
        value: {value: enumValue},
        constructor: {value: createNamedFunction(`${enumType.name}_${name}`, function() {})},
      });
      Enum.values[enumValue] = Value;
      Enum[name] = Value;
    };

  var embindRepr = (v) => {
      if (v === null) {
          return 'null';
      }
      var t = typeof v;
      if (t === 'object' || t === 'array' || t === 'function') {
          return v.toString();
      } else {
          return '' + v;
      }
    };
  
  var floatReadValueFromPointer = (name, width) => {
      switch (width) {
          case 4: return function(pointer) {
              return this['fromWireType'](HEAPF32[((pointer)>>2)]);
          };
          case 8: return function(pointer) {
              return this['fromWireType'](HEAPF64[((pointer)>>3)]);
          };
          default:
              throw new TypeError(`invalid float width (${width}): ${name}`);
      }
    };
  
  
  var __embind_register_float = (rawType, name, size) => {
      name = readLatin1String(name);
      registerType(rawType, {
        name,
        'fromWireType': (value) => value,
        'toWireType': (destructors, value) => {
          if (typeof value != "number" && typeof value != "boolean") {
            throw new TypeError(`Cannot convert ${embindRepr(value)} to ${this.name}`);
          }
          // The VM will perform JS to Wasm value conversion, according to the spec:
          // https://www.w3.org/TR/wasm-js-api-1/#towebassemblyvalue
          return value;
        },
        argPackAdvance: GenericWireTypeSize,
        'readValueFromPointer': floatReadValueFromPointer(name, size),
        destructorFunction: null, // This type does not need a destructor
      });
    };

  
  var integerReadValueFromPointer = (name, width, signed) => {
      // integers are quite common, so generate very specialized functions
      switch (width) {
          case 1: return signed ?
              (pointer) => HEAP8[pointer] :
              (pointer) => HEAPU8[pointer];
          case 2: return signed ?
              (pointer) => HEAP16[((pointer)>>1)] :
              (pointer) => HEAPU16[((pointer)>>1)]
          case 4: return signed ?
              (pointer) => HEAP32[((pointer)>>2)] :
              (pointer) => HEAPU32[((pointer)>>2)]
          default:
              throw new TypeError(`invalid integer width (${width}): ${name}`);
      }
    };
  
  
  /** @suppress {globalThis} */
  var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
      name = readLatin1String(name);
      // LLVM doesn't have signed and unsigned 32-bit types, so u32 literals come
      // out as 'i32 -1'. Always treat those as max u32.
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
  
      var fromWireType = (value) => value;
  
      if (minRange === 0) {
        var bitshift = 32 - 8*size;
        fromWireType = (value) => (value << bitshift) >>> bitshift;
      }
  
      var isUnsignedType = (name.includes('unsigned'));
      var checkAssertions = (value, toTypeName) => {
        if (typeof value != "number" && typeof value != "boolean") {
          throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${toTypeName}`);
        }
        if (value < minRange || value > maxRange) {
          throw new TypeError(`Passing a number "${embindRepr(value)}" from JS side to C/C++ side to an argument of type "${name}", which is outside the valid range [${minRange}, ${maxRange}]!`);
        }
      }
      var toWireType;
      if (isUnsignedType) {
        toWireType = function(destructors, value) {
          checkAssertions(value, this.name);
          return value >>> 0;
        }
      } else {
        toWireType = function(destructors, value) {
          checkAssertions(value, this.name);
          // The VM will perform JS to Wasm value conversion, according to the spec:
          // https://www.w3.org/TR/wasm-js-api-1/#towebassemblyvalue
          return value;
        }
      }
      registerType(primitiveType, {
        name,
        'fromWireType': fromWireType,
        'toWireType': toWireType,
        argPackAdvance: GenericWireTypeSize,
        'readValueFromPointer': integerReadValueFromPointer(name, size, minRange !== 0),
        destructorFunction: null, // This type does not need a destructor
      });
    };

  
  var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
      var typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
      ];
  
      var TA = typeMapping[dataTypeIndex];
  
      function decodeMemoryView(handle) {
        var size = HEAPU32[((handle)>>2)];
        var data = HEAPU32[(((handle)+(4))>>2)];
        return new TA(HEAP8.buffer, data, size);
      }
  
      name = readLatin1String(name);
      registerType(rawType, {
        name,
        'fromWireType': decodeMemoryView,
        argPackAdvance: GenericWireTypeSize,
        'readValueFromPointer': decodeMemoryView,
      }, {
        ignoreDuplicateRegistrations: true,
      });
    };

  
  
  
  
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.charCodeAt(i); // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) {
          var u1 = str.charCodeAt(++i);
          u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
        }
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  
  
  var __embind_register_std_string = (rawType, name) => {
      name = readLatin1String(name);
      var stdStringIsUTF8
      //process only std::string bindings with UTF8 support, in contrast to e.g. std::basic_string<unsigned char>
      = (name === "std::string");
  
      registerType(rawType, {
        name,
        // For some method names we use string keys here since they are part of
        // the public/external API and/or used by the runtime-generated code.
        'fromWireType'(value) {
          var length = HEAPU32[((value)>>2)];
          var payload = value + 4;
  
          var str;
          if (stdStringIsUTF8) {
            var decodeStartPtr = payload;
            // Looping here to support possible embedded '0' bytes
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = payload + i;
              if (i == length || HEAPU8[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr;
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                if (str === undefined) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }
          } else {
            var a = new Array(length);
            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[payload + i]);
            }
            str = a.join('');
          }
  
          _free(value);
  
          return str;
        },
        'toWireType'(destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
  
          var length;
          var valueIsOfTypeString = (typeof value == 'string');
  
          if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
            throwBindingError('Cannot pass non-string to std::string');
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            length = lengthBytesUTF8(value);
          } else {
            length = value.length;
          }
  
          // assumes POINTER_SIZE alignment
          var base = _malloc(4 + length + 1);
          var ptr = base + 4;
          HEAPU32[((base)>>2)] = length;
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
                if (charCode > 255) {
                  _free(ptr);
                  throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
                }
                HEAPU8[ptr + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + i] = value[i];
              }
            }
          }
  
          if (destructors !== null) {
            destructors.push(_free, base);
          }
          return base;
        },
        argPackAdvance: GenericWireTypeSize,
        'readValueFromPointer': readPointer,
        destructorFunction(ptr) {
          _free(ptr);
        },
      });
    };

  
  
  
  var UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : undefined;;
  var UTF16ToString = (ptr, maxBytesToRead) => {
      assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
      var endPtr = ptr;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.
      // Also, use the length info to avoid running tiny strings through
      // TextDecoder, since .subarray() allocates garbage.
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;
      // If maxBytesToRead is not passed explicitly, it will be undefined, and this
      // will always evaluate to true. This saves on code size.
      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
      endPtr = idx << 1;
  
      if (endPtr - ptr > 32 && UTF16Decoder)
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  
      // Fallback: decode without UTF16Decoder
      var str = '';
  
      // If maxBytesToRead is not passed explicitly, it will be undefined, and the
      // for-loop's condition will always evaluate to true. The loop is then
      // terminated on the first null char.
      for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
        var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
        if (codeUnit == 0) break;
        // fromCharCode constructs a character from a UTF-16 code unit, so we can
        // pass the UTF16 string right through.
        str += String.fromCharCode(codeUnit);
      }
  
      return str;
    };
  
  var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
      assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
      maxBytesToWrite ??= 0x7FFFFFFF;
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2; // Null terminator.
      var startPtr = outPtr;
      var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
        var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
        HEAP16[((outPtr)>>1)] = codeUnit;
        outPtr += 2;
      }
      // Null-terminate the pointer to the HEAP.
      HEAP16[((outPtr)>>1)] = 0;
      return outPtr - startPtr;
    };
  
  var lengthBytesUTF16 = (str) => {
      return str.length*2;
    };
  
  var UTF32ToString = (ptr, maxBytesToRead) => {
      assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
      var i = 0;
  
      var str = '';
      // If maxBytesToRead is not passed explicitly, it will be undefined, and this
      // will always evaluate to true. This saves on code size.
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
        if (utf32 == 0) break;
        ++i;
        // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        if (utf32 >= 0x10000) {
          var ch = utf32 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    };
  
  var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
      assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
      maxBytesToWrite ??= 0x7FFFFFFF;
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
        if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
        }
        HEAP32[((outPtr)>>2)] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      // Null-terminate the pointer to the HEAP.
      HEAP32[((outPtr)>>2)] = 0;
      return outPtr - startPtr;
    };
  
  var lengthBytesUTF32 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
        len += 4;
      }
  
      return len;
    };
  var __embind_register_std_wstring = (rawType, charSize, name) => {
      name = readLatin1String(name);
      var decodeString, encodeString, readCharAt, lengthBytesUTF;
      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        readCharAt = (pointer) => HEAPU16[((pointer)>>1)];
      } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        readCharAt = (pointer) => HEAPU32[((pointer)>>2)];
      }
      registerType(rawType, {
        name,
        'fromWireType': (value) => {
          // Code mostly taken from _embind_register_std_string fromWireType
          var length = HEAPU32[((value)>>2)];
          var str;
  
          var decodeStartPtr = value + 4;
          // Looping here to support possible embedded '0' bytes
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize;
            if (i == length || readCharAt(currentBytePtr) == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr;
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
              if (str === undefined) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + charSize;
            }
          }
  
          _free(value);
  
          return str;
        },
        'toWireType': (destructors, value) => {
          if (!(typeof value == 'string')) {
            throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
          }
  
          // assumes POINTER_SIZE alignment
          var length = lengthBytesUTF(value);
          var ptr = _malloc(4 + length + charSize);
          HEAPU32[((ptr)>>2)] = length / charSize;
  
          encodeString(value, ptr + 4, length + charSize);
  
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        argPackAdvance: GenericWireTypeSize,
        'readValueFromPointer': readPointer,
        destructorFunction(ptr) {
          _free(ptr);
        }
      });
    };

  
  var __embind_register_void = (rawType, name) => {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true, // void return values can be optimized out sometimes
        name,
        argPackAdvance: 0,
        'fromWireType': () => undefined,
        // TODO: assert if anything else is given?
        'toWireType': (destructors, o) => undefined,
      });
    };

  var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);


  
  var __emval_take_value = (type, arg) => {
      type = requireRegisteredType(type, '_emval_take_value');
      var v = type['readValueFromPointer'](arg);
      return Emval.toHandle(v);
    };

  
  var __tzset_js = (timezone, daylight, std_name, dst_name) => {
      // TODO: Use (malleable) environment variables instead of system settings.
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
  
      // Local standard timezone offset. Local standard time is not adjusted for
      // daylight savings.  This code uses the fact that getTimezoneOffset returns
      // a greater value during Standard Time versus Daylight Saving Time (DST).
      // Thus it determines the expected output during Standard Time, and it
      // compares whether the output of the given date the same (Standard) or less
      // (DST).
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  
      // timezone is specified as seconds west of UTC ("The external variable
      // `timezone` shall be set to the difference, in seconds, between
      // Coordinated Universal Time (UTC) and local standard time."), the same
      // as returned by stdTimezoneOffset.
      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
      HEAPU32[((timezone)>>2)] = stdTimezoneOffset * 60;
  
      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);
  
      var extractZone = (timezoneOffset) => {
        // Why inverse sign?
        // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        var sign = timezoneOffset >= 0 ? "-" : "+";
  
        var absOffset = Math.abs(timezoneOffset)
        var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
        var minutes = String(absOffset % 60).padStart(2, "0");
  
        return `UTC${sign}${hours}${minutes}`;
      }
  
      var winterName = extractZone(winterOffset);
      var summerName = extractZone(summerOffset);
      assert(winterName);
      assert(summerName);
      assert(lengthBytesUTF8(winterName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${winterName})`);
      assert(lengthBytesUTF8(summerName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${summerName})`);
      if (summerOffset < winterOffset) {
        // Northern hemisphere
        stringToUTF8(winterName, std_name, 17);
        stringToUTF8(summerName, dst_name, 17);
      } else {
        stringToUTF8(winterName, dst_name, 17);
        stringToUTF8(summerName, std_name, 17);
      }
    };

  var getHeapMax = () =>
      HEAPU8.length;
  
  var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };
  
  var abortOnCannotGrowMemory = (requestedSize) => {
      abort(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ${HEAP8.length}, (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0`);
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      abortOnCannotGrowMemory(requestedSize);
    };

  var ENV = {
  };
  
  var getExecutableName = () => {
      return thisProgram || './this.program';
    };
  var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        // Default values.
        // Browser language detection #8751
        var lang = ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          // x is a key in ENV; if ENV[x] is undefined, that means it was
          // explicitly set to be so. We allow user code to do that to
          // force variables with default values to remain unset.
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
  
  var stringToAscii = (str, buffer) => {
      for (var i = 0; i < str.length; ++i) {
        assert(str.charCodeAt(i) === (str.charCodeAt(i) & 0xff));
        HEAP8[buffer++] = str.charCodeAt(i);
      }
      // Null-terminate the string
      HEAP8[buffer] = 0;
    };
  var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      getEnvStrings().forEach((string, i) => {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(i*4))>>2)] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    };

  var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      strings.forEach((string) => bufSize += string.length + 1);
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    };

  var PATH = {
  isAbs:(path) => path.charAt(0) === '/',
  splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
  normalizeArray:(parts, allowAboveRoot) => {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },
  normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },
  dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },
  basename:(path) => {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },
  join:(...paths) => PATH.normalize(paths.join('/')),
  join2:(l, r) => PATH.normalize(l + '/' + r),
  };
  
  var initRandomFill = () => {
      if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {
        // for modern web browsers
        return (view) => crypto.getRandomValues(view);
      } else
      if (ENVIRONMENT_IS_NODE) {
        // for nodejs with or without crypto support included
        try {
          var crypto_module = require('crypto');
          var randomFillSync = crypto_module['randomFillSync'];
          if (randomFillSync) {
            // nodejs with LTS crypto support
            return (view) => crypto_module['randomFillSync'](view);
          }
          // very old nodejs with the original crypto API
          var randomBytes = crypto_module['randomBytes'];
          return (view) => (
            view.set(randomBytes(view.byteLength)),
            // Return the original view to match modern native implementations.
            view
          );
        } catch (e) {
          // nodejs doesn't have crypto support
        }
      }
      // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
      abort('no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };');
    };
  var randomFill = (view) => {
      // Lazily init on the first invocation.
      return (randomFill = initRandomFill())(view);
    };
  
  
  
  var PATH_FS = {
  resolve:(...args) => {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? args[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path != 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },
  relative:(from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      },
  };
  
  
  
  var FS_stdin_getChar_buffer = [];
  
  
  /** @type {function(string, boolean=, number=)} */
  function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }
  var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          // we will read data by chunks of BUFSIZE
          var BUFSIZE = 256;
          var buf = Buffer.alloc(BUFSIZE);
          var bytesRead = 0;
  
          // For some reason we must suppress a closure warning here, even though
          // fd definitely exists on process.stdin, and is even the proper way to
          // get the fd of stdin,
          // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
          // This started to happen after moving this logic out of library_tty.js,
          // so it is related to the surrounding code in some unclear manner.
          /** @suppress {missingProperties} */
          var fd = process.stdin.fd;
  
          try {
            bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
          } catch(e) {
            // Cross-platform differences: on Windows, reading EOF throws an
            // exception, but on other OSes, reading EOF returns 0. Uniformize
            // behavior by treating the EOF exception to return 0.
            if (e.toString().includes('EOF')) bytesRead = 0;
            else throw e;
          }
  
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString('utf-8');
          }
        } else
        {}
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result, true);
      }
      return FS_stdin_getChar_buffer.shift();
    };
  var TTY = {
  ttys:[],
  init() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process.stdin.setEncoding('utf8');
        // }
      },
  shutdown() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process.stdin.pause();
        // }
      },
  register(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
  stream_ops:{
  open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
  close(stream) {
          // flush any pending line data
          stream.tty.ops.fsync(stream.tty);
        },
  fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
  read(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },
  write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        },
  },
  default_tty_ops:{
  get_char(tty) {
          return FS_stdin_getChar();
        },
  put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },
  fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
  ioctl_tcgets(tty) {
          // typical setting
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              0x03, 0x1c, 0x7f, 0x15, 0x04, 0x00, 0x01, 0x00, 0x11, 0x13, 0x1a, 0x00,
              0x12, 0x0f, 0x17, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ]
          };
        },
  ioctl_tcsets(tty, optional_actions, data) {
          // currently just ignore
          return 0;
        },
  ioctl_tiocgwinsz(tty) {
          return [24, 80];
        },
  },
  default_tty1_ops:{
  put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
  fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
  },
  };
  
  
  var zeroMemory = (address, size) => {
      HEAPU8.fill(0, address, address + size);
      return address;
    };
  
  var mmapAlloc = (size) => {
      abort('internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported');
    };
  var MEMFS = {
  ops_table:null,
  mount(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },
  createNode(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(63);
        }
        MEMFS.ops_table ||= {
          dir: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              lookup: MEMFS.node_ops.lookup,
              mknod: MEMFS.node_ops.mknod,
              rename: MEMFS.node_ops.rename,
              unlink: MEMFS.node_ops.unlink,
              rmdir: MEMFS.node_ops.rmdir,
              readdir: MEMFS.node_ops.readdir,
              symlink: MEMFS.node_ops.symlink
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek
            }
          },
          file: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek,
              read: MEMFS.stream_ops.read,
              write: MEMFS.stream_ops.write,
              allocate: MEMFS.stream_ops.allocate,
              mmap: MEMFS.stream_ops.mmap,
              msync: MEMFS.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              readlink: MEMFS.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: FS.chrdev_stream_ops
          }
        };
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      },
  getFileDataAsTypedArray(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },
  expandFileStorage(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
      },
  resizeFileStorage(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
        }
      },
  node_ops:{
  getattr(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
  setattr(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
  lookup(parent, name) {
          throw FS.genericErrors[44];
        },
  mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
  rename(old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now()
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
        },
  unlink(parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
  rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
  readdir(node) {
          var entries = ['.', '..'];
          for (var key of Object.keys(node.contents)) {
            entries.push(key);
          }
          return entries;
        },
  symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },
  readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        },
  },
  stream_ops:{
  read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },
  write(stream, buffer, offset, length, position, canOwn) {
          // The data buffer should be a typed array view
          assert(!(buffer instanceof ArrayBuffer));
  
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) {
            // Use typed array write which is available.
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },
  llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
  allocate(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },
  mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
            // We can't emulate MAP_SHARED when the file is not backed by the
            // buffer we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            if (contents) {
              // Try to avoid unnecessary slices.
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length);
                }
              }
              HEAP8.set(contents, ptr);
            }
          }
          return { ptr, allocated };
        },
  msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        },
  },
  };
  
  /** @param {boolean=} noRunDep */
  var asyncLoad = (url, onload, onerror, noRunDep) => {
      var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : '';
      readAsync(url).then(
        (arrayBuffer) => {
          assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        },
        (err) => {
          if (onerror) {
            onerror();
          } else {
            throw `Loading data file "${url}" failed.`;
          }
        }
      );
      if (dep) addRunDependency(dep);
    };
  
  
  var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
      FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
    };
  
  var preloadPlugins = Module['preloadPlugins'] || [];
  var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
      // Ensure plugins are ready.
      if (typeof Browser != 'undefined') Browser.init();
  
      var handled = false;
      preloadPlugins.forEach((plugin) => {
        if (handled) return;
        if (plugin['canHandle'](fullname)) {
          plugin['handle'](byteArray, fullname, finish, onerror);
          handled = true;
        }
      });
      return handled;
    };
  var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
      // TODO we should allow people to just pass in a complete filename instead
      // of parent and name being that we just join them anyways
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`); // might have several active requests for the same fullname
      function processData(byteArray) {
        function finish(byteArray) {
          preFinish?.();
          if (!dontCreateFile) {
            FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
          }
          onload?.();
          removeRunDependency(dep);
        }
        if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
          onerror?.();
          removeRunDependency(dep);
        })) {
          return;
        }
        finish(byteArray);
      }
      addRunDependency(dep);
      if (typeof url == 'string') {
        asyncLoad(url, processData, onerror);
      } else {
        processData(url);
      }
    };
  
  var FS_modeStringToFlags = (str) => {
      var flagModes = {
        'r': 0,
        'r+': 2,
        'w': 512 | 64 | 1,
        'w+': 512 | 64 | 2,
        'a': 1024 | 64 | 1,
        'a+': 1024 | 64 | 2,
      };
      var flags = flagModes[str];
      if (typeof flags == 'undefined') {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    };
  
  var FS_getMode = (canRead, canWrite) => {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    };
  
  
  
  
  
  
  var strError = (errno) => {
      return UTF8ToString(_strerror(errno));
    };
  
  var ERRNO_CODES = {
      'EPERM': 63,
      'ENOENT': 44,
      'ESRCH': 71,
      'EINTR': 27,
      'EIO': 29,
      'ENXIO': 60,
      'E2BIG': 1,
      'ENOEXEC': 45,
      'EBADF': 8,
      'ECHILD': 12,
      'EAGAIN': 6,
      'EWOULDBLOCK': 6,
      'ENOMEM': 48,
      'EACCES': 2,
      'EFAULT': 21,
      'ENOTBLK': 105,
      'EBUSY': 10,
      'EEXIST': 20,
      'EXDEV': 75,
      'ENODEV': 43,
      'ENOTDIR': 54,
      'EISDIR': 31,
      'EINVAL': 28,
      'ENFILE': 41,
      'EMFILE': 33,
      'ENOTTY': 59,
      'ETXTBSY': 74,
      'EFBIG': 22,
      'ENOSPC': 51,
      'ESPIPE': 70,
      'EROFS': 69,
      'EMLINK': 34,
      'EPIPE': 64,
      'EDOM': 18,
      'ERANGE': 68,
      'ENOMSG': 49,
      'EIDRM': 24,
      'ECHRNG': 106,
      'EL2NSYNC': 156,
      'EL3HLT': 107,
      'EL3RST': 108,
      'ELNRNG': 109,
      'EUNATCH': 110,
      'ENOCSI': 111,
      'EL2HLT': 112,
      'EDEADLK': 16,
      'ENOLCK': 46,
      'EBADE': 113,
      'EBADR': 114,
      'EXFULL': 115,
      'ENOANO': 104,
      'EBADRQC': 103,
      'EBADSLT': 102,
      'EDEADLOCK': 16,
      'EBFONT': 101,
      'ENOSTR': 100,
      'ENODATA': 116,
      'ETIME': 117,
      'ENOSR': 118,
      'ENONET': 119,
      'ENOPKG': 120,
      'EREMOTE': 121,
      'ENOLINK': 47,
      'EADV': 122,
      'ESRMNT': 123,
      'ECOMM': 124,
      'EPROTO': 65,
      'EMULTIHOP': 36,
      'EDOTDOT': 125,
      'EBADMSG': 9,
      'ENOTUNIQ': 126,
      'EBADFD': 127,
      'EREMCHG': 128,
      'ELIBACC': 129,
      'ELIBBAD': 130,
      'ELIBSCN': 131,
      'ELIBMAX': 132,
      'ELIBEXEC': 133,
      'ENOSYS': 52,
      'ENOTEMPTY': 55,
      'ENAMETOOLONG': 37,
      'ELOOP': 32,
      'EOPNOTSUPP': 138,
      'EPFNOSUPPORT': 139,
      'ECONNRESET': 15,
      'ENOBUFS': 42,
      'EAFNOSUPPORT': 5,
      'EPROTOTYPE': 67,
      'ENOTSOCK': 57,
      'ENOPROTOOPT': 50,
      'ESHUTDOWN': 140,
      'ECONNREFUSED': 14,
      'EADDRINUSE': 3,
      'ECONNABORTED': 13,
      'ENETUNREACH': 40,
      'ENETDOWN': 38,
      'ETIMEDOUT': 73,
      'EHOSTDOWN': 142,
      'EHOSTUNREACH': 23,
      'EINPROGRESS': 26,
      'EALREADY': 7,
      'EDESTADDRREQ': 17,
      'EMSGSIZE': 35,
      'EPROTONOSUPPORT': 66,
      'ESOCKTNOSUPPORT': 137,
      'EADDRNOTAVAIL': 4,
      'ENETRESET': 39,
      'EISCONN': 30,
      'ENOTCONN': 53,
      'ETOOMANYREFS': 141,
      'EUSERS': 136,
      'EDQUOT': 19,
      'ESTALE': 72,
      'ENOTSUP': 138,
      'ENOMEDIUM': 148,
      'EILSEQ': 25,
      'EOVERFLOW': 61,
      'ECANCELED': 11,
      'ENOTRECOVERABLE': 56,
      'EOWNERDEAD': 62,
      'ESTRPIPE': 135,
    };
  var FS = {
  root:null,
  mounts:[],
  devices:{
  },
  streams:[],
  nextInode:1,
  nameTable:null,
  currentPath:"/",
  initialized:false,
  ignorePermissions:true,
  ErrnoError:class extends Error {
        // We set the `name` property to be able to identify `FS.ErrnoError`
        // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
        // - when using PROXYFS, an error can come from an underlying FS
        // as different FS objects have their own FS.ErrnoError each,
        // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
        // we'll use the reliable test `err.name == "ErrnoError"` instead
        constructor(errno) {
          super(runtimeInitialized ? strError(errno) : '');
          // TODO(sbc): Use the inline member declaration syntax once we
          // support it in acorn and closure.
          this.name = 'ErrnoError';
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
        }
      },
  genericErrors:{
  },
  filesystems:null,
  syncFSRequests:0,
  FSStream:class {
        constructor() {
          // TODO(https://github.com/emscripten-core/emscripten/issues/21414):
          // Use inline field declarations.
          this.shared = {};
        }
        get object() {
          return this.node;
        }
        set object(val) {
          this.node = val;
        }
        get isRead() {
          return (this.flags & 2097155) !== 1;
        }
        get isWrite() {
          return (this.flags & 2097155) !== 0;
        }
        get isAppend() {
          return (this.flags & 1024);
        }
        get flags() {
          return this.shared.flags;
        }
        set flags(val) {
          this.shared.flags = val;
        }
        get position() {
          return this.shared.position;
        }
        set position(val) {
          this.shared.position = val;
        }
      },
  FSNode:class {
        constructor(parent, name, mode, rdev) {
          if (!parent) {
            parent = this;  // root node sets parent to itself
          }
          this.parent = parent;
          this.mount = parent.mount;
          this.mounted = null;
          this.id = FS.nextInode++;
          this.name = name;
          this.mode = mode;
          this.node_ops = {};
          this.stream_ops = {};
          this.rdev = rdev;
          this.readMode = 292 | 73;
          this.writeMode = 146;
        }
        get read() {
          return (this.mode & this.readMode) === this.readMode;
        }
        set read(val) {
          val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
        }
        get write() {
          return (this.mode & this.writeMode) === this.writeMode;
        }
        set write(val) {
          val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
        }
        get isFolder() {
          return FS.isDir(this.mode);
        }
        get isDevice() {
          return FS.isChrdev(this.mode);
        }
      },
  lookupPath(path, opts = {}) {
        path = PATH_FS.resolve(path);
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        opts = Object.assign(defaults, opts)
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(32);
        }
  
        // split the absolute path
        var parts = path.split('/').filter((p) => !!p);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },
  getPath(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? `${mount}/${path}` : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },
  hashName(parentid, name) {
        var hash = 0;
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },
  hashAddNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
  hashRemoveNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
  lookupNode(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },
  createNode(parent, name, mode, rdev) {
        assert(typeof parent == 'object')
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },
  destroyNode(node) {
        FS.hashRemoveNode(node);
      },
  isRoot(node) {
        return node === node.parent;
      },
  isMountpoint(node) {
        return !!node.mounted;
      },
  isFile(mode) {
        return (mode & 61440) === 32768;
      },
  isDir(mode) {
        return (mode & 61440) === 16384;
      },
  isLink(mode) {
        return (mode & 61440) === 40960;
      },
  isChrdev(mode) {
        return (mode & 61440) === 8192;
      },
  isBlkdev(mode) {
        return (mode & 61440) === 24576;
      },
  isFIFO(mode) {
        return (mode & 61440) === 4096;
      },
  isSocket(mode) {
        return (mode & 49152) === 49152;
      },
  flagsToPermissionString(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },
  nodePermissions(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
  mayLookup(dir) {
        if (!FS.isDir(dir.mode)) return 54;
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
  mayCreate(dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },
  mayDelete(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },
  mayOpen(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },
  MAX_OPEN_FDS:4096,
  nextfd() {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
  getStreamChecked(fd) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },
  getStream:(fd) => FS.streams[fd],
  createStream(stream, fd = -1) {
        assert(fd >= -1);
  
        // clone it, so we can return an instance of FSStream
        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
  closeStream(fd) {
        FS.streams[fd] = null;
      },
  dupStream(origStream, fd = -1) {
        var stream = FS.createStream(origStream, fd);
        stream.stream_ops?.dup?.(stream);
        return stream;
      },
  chrdev_stream_ops:{
  open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          stream.stream_ops.open?.(stream);
        },
  llseek() {
          throw new FS.ErrnoError(70);
        },
  },
  major:(dev) => ((dev) >> 8),
  minor:(dev) => ((dev) & 0xff),
  makedev:(ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },
  getDevice:(dev) => FS.devices[dev],
  getMounts(mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push(...m.mounts);
        }
  
        return mounts;
      },
  syncfs(populate, callback) {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
  
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },
  mount(type, opts, mountpoint) {
        if (typeof type == 'string') {
          // The filesystem was not included, and instead we have an error
          // message stored in the variable.
          throw type;
        }
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type,
          opts,
          mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },
  unmount(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },
  lookup(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
  mknod(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
  create(path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
  mkdir(path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
  mkdirTree(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },
  mkdev(path, mode, dev) {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
  symlink(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
  rename(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
  
        // let the errors from non existent directories percolate up
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
  
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
          // update old node (we do this here to avoid each backend 
          // needing to)
          old_node.parent = new_dir;
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },
  rmdir(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
  readdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },
  unlink(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
  readlink(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },
  stat(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },
  lstat(path) {
        return FS.stat(path, true);
      },
  chmod(path, mode, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },
  lchmod(path, mode) {
        FS.chmod(path, mode, true);
      },
  fchmod(fd, mode) {
        var stream = FS.getStreamChecked(fd);
        FS.chmod(stream.node, mode);
      },
  chown(path, uid, gid, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },
  lchown(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
  fchown(fd, uid, gid) {
        var stream = FS.getStreamChecked(fd);
        FS.chown(stream.node, uid, gid);
      },
  truncate(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },
  ftruncate(fd, len) {
        var stream = FS.getStreamChecked(fd);
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },
  utime(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },
  open(path, flags, mode) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == 'string' ? FS_modeStringToFlags(flags) : flags;
        if ((flags & 64)) {
          mode = typeof mode == 'undefined' ? 438 /* 0666 */ : mode;
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path == 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // do truncation if necessary
        if ((flags & 512) && !created) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512 | 131072);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        });
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },
  close(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
  isClosed(stream) {
        return stream.fd === null;
      },
  llseek(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
  read(stream, buffer, offset, length, position) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
  write(stream, buffer, offset, length, position, canOwn) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
  allocate(stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },
  mmap(stream, length, position, prot, flags) {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        if (!length) {
          throw new FS.ErrnoError(28);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
  msync(stream, buffer, offset, length, mmapFlags) {
        assert(offset >= 0);
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },
  ioctl(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
  readFile(path, opts = {}) {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error(`Invalid encoding type "${opts.encoding}"`);
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },
  writeFile(path, data, opts = {}) {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },
  cwd:() => FS.currentPath,
  chdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
  createDefaultDirectories() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },
  createDefaultDevices() {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using err() rather than out()
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        // use a buffer to avoid overhead of individual crypto calls per byte
        var randomBuffer = new Uint8Array(1024), randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomLeft = randomFill(randomBuffer).byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice('/dev', 'random', randomByte);
        FS.createDevice('/dev', 'urandom', randomByte);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },
  createSpecialDirectories() {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
        // name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount() {
            var node = FS.createNode(proc_self, 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup(parent, name) {
                var fd = +name;
                var stream = FS.getStreamChecked(fd);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: () => stream.path },
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },
  createStandardStreams(input, output, error) {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (input) {
          FS.createDevice('/dev', 'stdin', input);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (output) {
          FS.createDevice('/dev', 'stdout', null, output);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (error) {
          FS.createDevice('/dev', 'stderr', null, error);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
        assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
        assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
        assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
      },
  staticInit() {
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [44].forEach((code) => {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },
  init(input, output, error) {
        assert(!FS.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.initialized = true;
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        input ??= Module['stdin'];
        output ??= Module['stdout'];
        error ??= Module['stderr'];
  
        FS.createStandardStreams(input, output, error);
      },
  quit() {
        FS.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        _fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },
  findObject(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },
  analyzePath(path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },
  createPath(parent, path, canRead, canWrite) {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },
  createFile(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
      },
  createDevice(parent, name, input, output) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open(stream) {
            stream.seekable = false;
          },
          close(stream) {
            // flush any pending line data
            if (output?.buffer?.length) {
              output(10);
            }
          },
          read(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },
  forceLoadFile(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else { // Command-line.
          try {
            obj.contents = readBinary(obj.url);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
      },
  createLazyFile(parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array).
        // Actual getting is abstracted away for eventual reuse.
        class LazyUint8Array {
          constructor() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize)|0;
            return this.getter(chunkNum)[chunkOffset];
          }
          setDataGetter(getter) {
            this.getter = getter;
          }
          cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
            var chunkSize = 1024*1024; // Chunk size in bytes
  
            if (!hasByteServing) chunkSize = datalength;
  
            // Function to get a range from the remote URL.
            var doXHR = (from, to) => {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
              // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
              // Some hints to the browser that we want binary data.
              xhr.responseType = 'arraybuffer';
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }
  
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
              }
              return intArrayFromString(xhr.responseText || '', true);
            };
            var lazyArray = this;
            lazyArray.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum+1) * chunkSize - 1; // including this byte
              end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') throw new Error('doXHR failed!');
              return lazyArray.chunks[chunkNum];
            });
  
            if (usesGzip || !datalength) {
              // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
              chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }
  
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          }
          get length() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
          get chunkSize() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
  
        if (typeof XMLHttpRequest != 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = (...args) => {
            FS.forceLoadFile(node);
            return fn(...args);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        // use a custom read function
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position)
        };
        // use a custom mmap function
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
  absolutePath() {
        abort('FS.absolutePath has been removed; use PATH_FS.resolve instead');
      },
  createFolder() {
        abort('FS.createFolder has been removed; use FS.mkdir instead');
      },
  createLink() {
        abort('FS.createLink has been removed; use FS.symlink instead');
      },
  joinPath() {
        abort('FS.joinPath has been removed; use PATH.join instead');
      },
  mmapAlloc() {
        abort('FS.mmapAlloc has been replaced by the top level function mmapAlloc');
      },
  standardizePath() {
        abort('FS.standardizePath has been removed; use PATH.normalize instead');
      },
  };
  
  var SYSCALLS = {
  DEFAULT_POLLMASK:5,
  calculateAt(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        // relative path
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);;
          }
          return dir;
        }
        return PATH.join2(dir, path);
      },
  doStat(func, path, buf) {
        var stat = func(path);
        HEAP32[((buf)>>2)] = stat.dev;
        HEAP32[(((buf)+(4))>>2)] = stat.mode;
        HEAPU32[(((buf)+(8))>>2)] = stat.nlink;
        HEAP32[(((buf)+(12))>>2)] = stat.uid;
        HEAP32[(((buf)+(16))>>2)] = stat.gid;
        HEAP32[(((buf)+(20))>>2)] = stat.rdev;
        (tempI64 = [stat.size>>>0,(tempDouble = stat.size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(24))>>2)] = tempI64[0],HEAP32[(((buf)+(28))>>2)] = tempI64[1]);
        HEAP32[(((buf)+(32))>>2)] = 4096;
        HEAP32[(((buf)+(36))>>2)] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        (tempI64 = [Math.floor(atime / 1000)>>>0,(tempDouble = Math.floor(atime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(40))>>2)] = tempI64[0],HEAP32[(((buf)+(44))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(48))>>2)] = (atime % 1000) * 1000 * 1000;
        (tempI64 = [Math.floor(mtime / 1000)>>>0,(tempDouble = Math.floor(mtime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(56))>>2)] = tempI64[0],HEAP32[(((buf)+(60))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(64))>>2)] = (mtime % 1000) * 1000 * 1000;
        (tempI64 = [Math.floor(ctime / 1000)>>>0,(tempDouble = Math.floor(ctime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(72))>>2)] = tempI64[0],HEAP32[(((buf)+(76))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(80))>>2)] = (ctime % 1000) * 1000 * 1000;
        (tempI64 = [stat.ino>>>0,(tempDouble = stat.ino,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(88))>>2)] = tempI64[0],HEAP32[(((buf)+(92))>>2)] = tempI64[1]);
        return 0;
      },
  doMsync(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          // MAP_PRIVATE calls need not to be synced back to underlying fs
          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
  getStreamFromFD(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      },
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  function _fd_close(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  /** @param {number=} offset */
  var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break; // nothing more to read
        if (typeof offset != 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
  
  function _fd_read(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  
  var convertI32PairToI53Checked = (lo, hi) => {
      assert(lo == (lo >>> 0) || lo == (lo|0)); // lo should either be a i32 or a u32
      assert(hi === (hi|0));                    // hi should be a i32
      return ((hi + 0x200000) >>> 0 < 0x400001 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
    };
  function _fd_seek(fd,offset_low, offset_high,whence,newOffset) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
  
    
  try {
  
      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble = stream.position,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[((newOffset)>>2)] = tempI64[0],HEAP32[(((newOffset)+(4))>>2)] = tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  ;
  }

  /** @param {number=} offset */
  var doWritev = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) {
          // No more space to write.
          break;
        }
        if (typeof offset != 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
  
  function _fd_write(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  var getCFunc = (ident) => {
      var func = Module['_' + ident]; // closure exported function
      assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
      return func;
    };
  
  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };
  
  
  
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
  
  
  
  
  
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */
  var ccall = (ident, returnType, argTypes, args, opts) => {
      // For fast lookup of conversion functions
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { // null string
            // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func(...cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
  
      ret = onDone(ret);
      return ret;
    };

  
  
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
  var cwrap = (ident, returnType, argTypes, opts) => {
      return (...args) => ccall(ident, returnType, argTypes, args, opts);
    };
embind_init_charCodes();
BindingError = Module['BindingError'] = class BindingError extends Error { constructor(message) { super(message); this.name = 'BindingError'; }};
InternalError = Module['InternalError'] = class InternalError extends Error { constructor(message) { super(message); this.name = 'InternalError'; }};
init_ClassHandle();
init_embind();;
init_RegisteredPointer();
UnboundTypeError = Module['UnboundTypeError'] = extendError(Error, 'UnboundTypeError');;
init_emval();;

  FS.createPreloadedFile = FS_createPreloadedFile;
  FS.staticInit();
  // Set module methods based on EXPORTED_RUNTIME_METHODS
  ;
function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}
var wasmImports = {
  /** @export */
  __assert_fail: ___assert_fail,
  /** @export */
  _abort_js: __abort_js,
  /** @export */
  _embind_register_bigint: __embind_register_bigint,
  /** @export */
  _embind_register_bool: __embind_register_bool,
  /** @export */
  _embind_register_class: __embind_register_class,
  /** @export */
  _embind_register_class_constructor: __embind_register_class_constructor,
  /** @export */
  _embind_register_class_function: __embind_register_class_function,
  /** @export */
  _embind_register_emval: __embind_register_emval,
  /** @export */
  _embind_register_enum: __embind_register_enum,
  /** @export */
  _embind_register_enum_value: __embind_register_enum_value,
  /** @export */
  _embind_register_float: __embind_register_float,
  /** @export */
  _embind_register_integer: __embind_register_integer,
  /** @export */
  _embind_register_memory_view: __embind_register_memory_view,
  /** @export */
  _embind_register_std_string: __embind_register_std_string,
  /** @export */
  _embind_register_std_wstring: __embind_register_std_wstring,
  /** @export */
  _embind_register_void: __embind_register_void,
  /** @export */
  _emscripten_memcpy_js: __emscripten_memcpy_js,
  /** @export */
  _emval_decref: __emval_decref,
  /** @export */
  _emval_take_value: __emval_take_value,
  /** @export */
  _tzset_js: __tzset_js,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  environ_get: _environ_get,
  /** @export */
  environ_sizes_get: _environ_sizes_get,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_read: _fd_read,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write
};
var wasmExports = createWasm();
var ___wasm_call_ctors = createExportWrapper('__wasm_call_ctors', 0);
var _malloc = createExportWrapper('malloc', 1);
var ___getTypeName = createExportWrapper('__getTypeName', 1);
var _fflush = createExportWrapper('fflush', 1);
var _strerror = createExportWrapper('strerror', 1);
var _free = createExportWrapper('free', 1);
var _emscripten_stack_init = wasmExports['emscripten_stack_init']
var _emscripten_stack_get_free = wasmExports['emscripten_stack_get_free']
var _emscripten_stack_get_base = wasmExports['emscripten_stack_get_base']
var _emscripten_stack_get_end = wasmExports['emscripten_stack_get_end']
var __emscripten_stack_restore = wasmExports['_emscripten_stack_restore']
var __emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc']
var _emscripten_stack_get_current = wasmExports['emscripten_stack_get_current']
var dynCall_viijii = Module['dynCall_viijii'] = createExportWrapper('dynCall_viijii', 7);
var dynCall_jiji = Module['dynCall_jiji'] = createExportWrapper('dynCall_jiji', 5);
var dynCall_iiiiij = Module['dynCall_iiiiij'] = createExportWrapper('dynCall_iiiiij', 7);
var dynCall_iiiiijj = Module['dynCall_iiiiijj'] = createExportWrapper('dynCall_iiiiijj', 9);
var dynCall_iiiiiijj = Module['dynCall_iiiiiijj'] = createExportWrapper('dynCall_iiiiiijj', 10);


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

Module['ccall'] = ccall;
Module['cwrap'] = cwrap;
var missingLibrarySymbols = [
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertU32PairToI53',
  'getTempRet0',
  'setTempRet0',
  'exitJS',
  'growMemory',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'emscriptenLog',
  'readEmAsmArgs',
  'jstoi_q',
  'listenOnce',
  'autoResumeAudioContext',
  'handleException',
  'keepRuntimeAlive',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'asmjsMangle',
  'HandleAllocator',
  'getNativeTypeSize',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'uleb128Encode',
  'sigToWasmTypes',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'addFunction',
  'removeFunction',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'intArrayToString',
  'AsciiToString',
  'stringToNewUTF8',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'getCallstack',
  'convertPCtoSourceLocation',
  'checkWasiClock',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'createDyncallWrapper',
  'safeSetTimeout',
  'setImmediateWrapped',
  'clearImmediateWrapped',
  'polyfillSetImmediate',
  'getPromise',
  'makePromise',
  'idsToPromises',
  'makePromiseCallback',
  'ExceptionInfo',
  'findMatchingCatch',
  'Browser_asyncPrepareDataCounter',
  'setMainLoop',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'getSocketFromFD',
  'getSocketAddress',
  'FS_unlink',
  'FS_mkdirTree',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'toTypedArrayIndex',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'webgl_enable_EXT_polygon_offset_clamp',
  'webgl_enable_EXT_clip_control',
  'webgl_enable_WEBGL_polygon_mode',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'runAndAbortIfError',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
  'setErrNo',
  'demangle',
  'stackTrace',
  'getFunctionArgsName',
  'createJsInvokerSignature',
  'registerInheritedInstance',
  'unregisterInheritedInstance',
  'validateThis',
  'getStringOrSymbol',
  'emval_get_global',
  'emval_returnValue',
  'emval_lookupTypes',
  'emval_addMethodCaller',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

var unexportedSymbols = [
  'run',
  'addOnPreRun',
  'addOnInit',
  'addOnPreMain',
  'addOnExit',
  'addOnPostRun',
  'addRunDependency',
  'removeRunDependency',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmMemory',
  'wasmExports',
  'writeStackCookie',
  'checkStackCookie',
  'intArrayFromBase64',
  'tryParseAsDataURI',
  'convertI32PairToI53Checked',
  'stackSave',
  'stackRestore',
  'stackAlloc',
  'ptrToString',
  'zeroMemory',
  'getHeapMax',
  'abortOnCannotGrowMemory',
  'ENV',
  'ERRNO_CODES',
  'strError',
  'DNS',
  'Protocols',
  'Sockets',
  'initRandomFill',
  'randomFill',
  'timers',
  'warnOnce',
  'readEmAsmArgsArray',
  'jstoi_s',
  'getExecutableName',
  'dynCallLegacy',
  'getDynCaller',
  'dynCall',
  'asyncLoad',
  'alignMemory',
  'mmapAlloc',
  'wasmTable',
  'noExitRuntime',
  'getCFunc',
  'freeTableIndexes',
  'functionsInTableMap',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'intArrayFromString',
  'stringToAscii',
  'UTF16Decoder',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'JSEvents',
  'specialHTMLTargets',
  'findCanvasEventTarget',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'UNWIND_CACHE',
  'ExitStatus',
  'getEnvStrings',
  'doReadv',
  'doWritev',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'Browser',
  'getPreloadedImageData__data',
  'wget',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'SYSCALLS',
  'preloadPlugins',
  'FS_createPreloadedFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_stdin_getChar_buffer',
  'FS_stdin_getChar',
  'FS_createPath',
  'FS_createDevice',
  'FS_readFile',
  'FS',
  'FS_createDataFile',
  'FS_createLazyFile',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'SDL',
  'SDL_gfx',
  'allocateUTF8',
  'allocateUTF8OnStack',
  'print',
  'printErr',
  'InternalError',
  'BindingError',
  'throwInternalError',
  'throwBindingError',
  'registeredTypes',
  'awaitingDependencies',
  'typeDependencies',
  'tupleRegistrations',
  'structRegistrations',
  'sharedRegisterType',
  'whenDependentTypesAreResolved',
  'embind_charCodes',
  'embind_init_charCodes',
  'readLatin1String',
  'getTypeName',
  'getFunctionName',
  'heap32VectorToArray',
  'requireRegisteredType',
  'usesDestructorStack',
  'createJsInvoker',
  'UnboundTypeError',
  'PureVirtualError',
  'GenericWireTypeSize',
  'EmValType',
  'init_embind',
  'throwUnboundTypeError',
  'ensureOverloadTable',
  'exposePublicSymbol',
  'replacePublicSymbol',
  'extendError',
  'createNamedFunction',
  'embindRepr',
  'registeredInstances',
  'getBasestPointer',
  'getInheritedInstance',
  'getInheritedInstanceCount',
  'getLiveInheritedInstances',
  'registeredPointers',
  'registerType',
  'integerReadValueFromPointer',
  'enumReadValueFromPointer',
  'floatReadValueFromPointer',
  'readPointer',
  'runDestructors',
  'newFunc',
  'craftInvokerFunction',
  'embind__requireFunction',
  'genericPointerToWireType',
  'constNoSmartPtrRawPointerToWireType',
  'nonConstNoSmartPtrRawPointerToWireType',
  'init_RegisteredPointer',
  'RegisteredPointer',
  'RegisteredPointer_fromWireType',
  'runDestructor',
  'releaseClassHandle',
  'finalizationRegistry',
  'detachFinalizer_deps',
  'detachFinalizer',
  'attachFinalizer',
  'makeClassHandle',
  'init_ClassHandle',
  'ClassHandle',
  'throwInstanceAlreadyDeleted',
  'deletionQueue',
  'flushPendingDeletes',
  'delayFunction',
  'setDelayFunction',
  'RegisteredClass',
  'shallowCopyInternalPointer',
  'downcastPointer',
  'upcastPointer',
  'char_0',
  'char_9',
  'makeLegalFunctionName',
  'emval_freelist',
  'emval_handles',
  'emval_symbols',
  'init_emval',
  'count_emval_handles',
  'Emval',
  'emval_methodCallers',
  'reflectConstruct',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);



var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run() {

  if (runDependencies > 0) {
    return;
  }

    stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    readyPromiseResolve(Module);
    Module['onRuntimeInitialized']?.();

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(() => {
      setTimeout(() => Module['setStatus'](''), 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    _fflush(0);
    // also flush in the JS FS layer
    ['stdout', 'stderr'].forEach((name) => {
      var info = FS.analyzePath('/dev/' + name);
      if (!info) return;
      var stream = info.object;
      var rdev = stream.rdev;
      var tty = TTY.ttys[rdev];
      if (tty?.output?.length) {
        has = true;
      }
    });
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

run();

// end include: postamble.js

// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
//
// We assign to the `moduleRtn` global here and configure closure to see
// this as and extern so it won't get minified.

moduleRtn = Module;

// Assertion for attempting to access module properties on the incoming
// moduleArg.  In the past we used this object as the prototype of the module
// and assigned properties to it, but now we return a distinct object.  This
// keeps the instance private until it is ready (i.e the promise has been
// resolved).
for (const prop of Object.keys(Module)) {
  if (!(prop in moduleArg)) {
    Object.defineProperty(moduleArg, prop, {
      configurable: true,
      get() {
        abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`)
      }
    });
  }
}
// end include: postamble_modularize.js



  return moduleRtn;
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], () => Module);
