const logger = require('debug')('dbMiddleware');
const { MongoClient } = require('mongodb');

const dbConstructor = dbURI => {
  let dbPromise;

  if (!dbPromise) {
    // this returns a promise that will resolve
    // to the connection with the database
    dbPromise = MongoClient.connect(dbURI);
  }

  const dbMiddleware = (req, res, next) => {
    dbPromise
      .then(connection => {
        logger('adding db to req object');
        req.db = connection.db('confriends');
        next();
      })
      .catch(err => {
        dbPromise = null;
        logger('failed to connect to db', err);
        next(err);
      });
  };

  return dbMiddleware;
};

module.exports = {
  dbConstructor,
};
