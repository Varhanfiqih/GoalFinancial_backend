const { handleRequest } = require('../src/app');

module.exports = function handler(req, res) {
  return handleRequest(req, res).catch((error) => {
    sendFallbackError(res, error);
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
