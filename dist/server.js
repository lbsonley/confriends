'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const path = require('path');
const logger = require('debug')('expressServer');
require('dotenv').config();

const app = (0, _express2.default)();
let db;

_mongodb.MongoClient.connect('mongodb://localhost/events').then(connection => {
  db = connection;
  app.listen(3001, () => logger('running on port 3001'));
}).catch(err => logger('ERROR:', err));

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the React app
app.use(_express2.default.static(path.join(__dirname, '../client/build')));

// eslint-disable-next-line no-unused-vars
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // YOUR-AUTH0-DOMAIN name e.g prosper.auth0.com
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  // This is the identifier we set when we created the API
  audience: `https://${process.env.AUTH0_AUDIENCE}`,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// helper function

const getMongoId = (idString, res) => {
  // convert the id string to a MongoDB ObjectId
  try {
    return (0, _mongodb.ObjectId)(idString);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
  }
};

// ** Create API **

/**
 * updating a record
 */
app.put('/api/:collectionName/:id', (req, res) => {
  const eventId = getMongoId(req.params.id, res);

  db.collection(req.params.collectionName).update({ _id: eventId }, {
    $push: {
      attendees: {
        name: req.body.name,
        id: req.body.id,
        procurementLink: req.body.procurementLink,
        approved: req.body.approved
      }
    }
  }, () => {
    db.collection(req.params.collectionName).find({ _id: eventId }).limit(1).next().then(savedEvent => {
      logger(savedEvent);
      res.json(savedEvent);
    }).catch(err => {
      logger('error', err);
      res.status.json({ message: `Error: ${err}` });
    });
  });
});

// ** Read API **

/**
 * endpoint for edit event attendee page
 */
app.get('/api/:collectionName/:id/edit/:userId', (req, res) => {
  const eventId = getMongoId(req.params.id, res);
  db.collection(req.params.collectionName)
  // find the matching event and return it's attendees array
  .findOne({ _id: eventId }, { attendees: 1 }).then(event => {
    // filter the attendees array for the attendee to be edited
    const matchingAttendee = event.attendees.filter(attendee => attendee.id === req.params.userId);
    logger('sending', matchingAttendee);
    res.json({ attendee: matchingAttendee[0] });
  });
});

/**
 * endpoint for event detail page
 */
app.get('/api/:collectionName/:id', (req, res) => {
  const eventId = getMongoId(req.params.id, res);

  db.collection(req.params.collectionName).find({ _id: eventId }).limit(1).next().then(event => {
    res.json({ event });
  });
});

/**
 * endpoint for a list of events
 */
app.get('/api/:collectionName', (req, res) => {
  db.collection(req.params.collectionName).find().toArray().then(events => {
    res.json({ events });
  });
});

app.get('/api', (req, res) => {
  res.send('Using the confriends REST API');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}../client/build/index.html`));
});
//# sourceMappingURL=server.js.map