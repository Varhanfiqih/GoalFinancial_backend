const { createApp } = require('../src/app');

const app = createApp();

module.exports = function handler(req, res) {
  return app.emit('request', req, res);
};
