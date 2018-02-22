const path = require('path');
// const logger = require('debug')('serverRouter');
const apiRoute = require('./apis');

function init(server) {
  server.use('/api', apiRoute);

  server.get('*', (req, res, next) => {
    // move log below to a middleware
    // logger(`Request was made to: ${req.originalUrl}`);
    res.sendFile(path.join(__dirname, '..', `build/index.html`));
    return next();
  });
}

module.exports = {
  init,
};
