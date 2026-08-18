/**
 * Stockfish Web Worker Communication Handler
 * AOKIRA GAME CHESS 2026
 */

self.importScripts('engine/stockfish.js');

let stockfish = null;

if (typeof Stockfish === 'function') {
  Stockfish().then((engine) => {
    stockfish = engine;
    
    // UCI engine output proxying back to main UI script
    stockfish.addMessageListener((line) => {
      self.postMessage({ type: 'uci', data: line });
    });

    self.postMessage({ type: 'status', data: 'READY' });
  }).catch((err) => {
    self.postMessage({ type: 'error', data: 'Engine loading failed: ' + err.message });
  });
} else {
  self.postMessage({ type: 'error', data: 'Stockfish initializer not found.' });
}

self.onmessage = function (e) {
  const msg = e.data;
  if (!stockfish) return;

  if (msg.cmd === 'uci') {
    stockfish.postMessage(msg.str);
  }
};
