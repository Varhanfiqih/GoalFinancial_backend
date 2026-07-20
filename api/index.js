const { createApp } = require('../src/app');

const app = createApp();

module.exports = function handler(req, res) {
  return new Promise((resolve) => {
    res.once('finish', resolve);
    res.once('close', resolve);
    res.once('error', (error) => {
      sendFallbackError(res, error);
      resolve();
    });

    try {
      app.emit('request', req, res);
    } catch (error) {
      sendFallbackError(res, error);
      resolve();
    }
  });
};

function sendFallbackError(res, error) {
  if (res.writableEnded) return;
  const payload = JSON.stringify({
    message: error.message || 'Server error',
  });
  res.writeHead(500, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}
