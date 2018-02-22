const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const logger = require('debug')('serverConstructor');
const { dbConstructor } = require('./database');

module.exports = function serverConstructor() {
  const app = express();

  const create = config => {
    const routes = require('./routes'); // eslint-disable-line global-require
    logger(config);

    // server variables
    app.set('port', process.env.port || config.port);

    // middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(express.static(path.join(__dirname, '..', 'build')));
    app.use(dbConstructor(`${config.DB_URI}`));

    routes.init(app);
  };

  const start = () => {
    const port = app.get('port');

    app.listen(port, () => logger(`running on port ${port}`));
  };

  return {
    create,
    start,
  };
};
