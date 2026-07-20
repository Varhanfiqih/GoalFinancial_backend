const { createApp } = require('../src/app');

const app = createApp();

module.exports = function handler(req, res) {
  try {
    return app.emit('request', req, res);
  } catch (error) {
    const payload = JSON.stringify({
      message: error.message || 'Server error',
    });
    res.writeHead(500, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    });
    res.end(payload);
    return undefined;
  }
};
