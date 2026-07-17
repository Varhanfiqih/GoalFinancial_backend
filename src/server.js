const { createApp } = require('./app');
const { port } = require('./config');

const server = createApp();

server.listen(port, () => {
  console.log(`Ethena backend running at http://localhost:${port}`);
});
