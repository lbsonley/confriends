const server = require('./index')();
const config = require('./config');

server.create(config);
server.start();
