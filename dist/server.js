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

_mongodb.MongoClient.connect('mongodb://localhost/confriends').then(connection => {
  db = connection;
  app.listen(3001, () => logger('running on port 3001'));
}).catch(err => logger('Error connecting to DB:', err));

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

const deleteConferenceAttendees = (req, res) => {
  db.collection(req.params.collectionName).deleteMany({ eventId: req.params.eventId }).then(attendees => {
    logger('deleteConferenceAttendees');
    res.json({ attendees });
  }).catch(err => {
    logger('error deleting conference attendees: ', err);
    res.json({ message: `Could not delete conference attendees: ${err}` });
  });
};

const deleteConference = (req, res) => {
  const eventId = getMongoId(req.params.eventId);

  db.collection(req.params.collectionName).deleteOne({ _id: eventId }).then(event => {
    logger('deleteConference');
    res.json({ event });
  }).catch(err => {
    logger('Error deleting conference: ', err);
    res.json({ message: `Could not delete conference: ${err}` });
  });
};

const getEventAttendees = (req, res) => {
  const { params } = req;

  db.collection('attendees').find({
    eventId: params.eventId
  }).toArray().then(attendees => {
    logger('getEventAttendees response: ', attendees);
    res.json({ attendees });
  }).catch(err => {
    logger('error getting event attendees: ', err);
    res.json({ message: `Could not get event attendees: ${err}` });
  });
};

const getOneEvent = (req, res) => {
  const { params } = req;

  const eventId = getMongoId(params.eventId, res);

  db.collection(params.collectionName).find({ _id: eventId }).limit(1).next().then(event => {
    logger('getOneEvent response', event);
    res.json({ event });
  }).catch(err => {
    logger('error getting event: ', err);
    res.json({ message: `Could not get event: ${err}` });
  });
};

/**
 * Delete API
 */

// delete an attendee
app.delete('/api/:collectionName/:eventId/:userId', (req, res) => {
  const { eventId, userId } = req.params;
  db.collection(req.params.collectionName).findOneAndDelete({ eventId, userId }, err => {
    if (err) {
      logger('error deleting attendee: ', err);
      res.json({ message: `Could not delete attendee: ${err}` });
      return;
    }
    getEventAttendees(req, res);
    // db
    //   .collection(req.params.collectionName)
    //   .find({ eventId })
    //   .toArray()
    //   .then(attendees => {
    //     logger('attendees after delete', attendees);
    //     res.json({ attendees });
    //   })
    //   .catch(error => {
    //     logger('error getting attendees after delete: ', error);
    //     res.json({
    //       message: `Could not get updated attendee list: ${error}`,
    //     });
    //   });
  });
});

// delete a conference
app.delete('/api/:collectionName/:eventId', (req, res) => {
  if (req.params.collectionName === 'attendees') {
    deleteConferenceAttendees(req, res);
  } else if (req.params.collectionName === 'conferences') {
    deleteConference(req, res);
  }
});

/**
 * Create API
 */

// updating an event's attendee with new approval info
app.put('/api/:collectionName/:eventId/:userId', (req, res) => {
  logger('body', req.body);
  db.collection(req.params.collectionName).updateOne(
  // filter
  { eventId: req.params.eventId, userId: req.body.userId },
  // info to update
  {
    $set: {
      eventId: req.body.eventId,
      userId: req.body.userId,
      name: req.body.name,
      procurementLink: req.body.procurementLink,
      approved: req.body.approved
    }
  },
  // callback
  err => {
    if (err) {
      logger('error updating attendee: ', err);
      res.json({ message: `Could not update attendee info: ${err}` });
      return;
    }
    db.collection(req.params.collectionName).findOne({ eventId: req.params.eventId, userId: req.body.userId }).then(attendee => {
      logger('updatedAttendee: ', attendee);
      res.json(attendee);
    });
  });
});

// adding event to collection
app.put('/api/:collectionName', (req, res) => {
  logger('body', req.body);
  const { name, website, date, city, country, description } = req.body;
  db.collection(req.params.collectionName).updateOne(
  // filter
  {
    website
  },
  // data to update
  {
    name,
    website,
    date,
    city,
    country,
    description
  },
  // options
  { upsert: true },
  // callback
  err => {
    if (err) {
      logger('error adding event to collection: ', err);
      res.json({ message: `Could not add event: ${err}` });
      return;
    }
    db.collection(req.params.collectionName).findOne({ website }).then(responseEvent => {
      logger('response', responseEvent);
      res.json(responseEvent);
    });
  });
});

// add attendee to event
app.put('/api/:collectionName/:id', (req, res) => {
  logger('body', req.body);
  db.collection(req.params.collectionName).updateOne({
    eventId: req.body.eventId,
    userId: req.body.userId
  }, {
    eventId: req.body.eventId,
    userId: req.body.userId,
    name: req.body.name,
    procurementLink: req.body.procurementLink,
    approved: req.body.approved
  }, { upsert: true }, err => {
    if (err) {
      logger('Error adding attendee: ', err);
      res.json({ message: `Could not add attendee: ${err}` });
      return;
    }
    db.collection(req.params.collectionName).findOne({ eventId: req.body.eventId, userId: req.body.userId }).then(responseAttendee => {
      logger('response', responseAttendee);
      res.json(responseAttendee);
    });
  });
});

/**
 * Read API
 */

// endpoint for edit attendee page
// each event attendee has a unique
// entry in the database so we have to
// filter on eventId and userId
app.get('/api/:collectionName/:eventId/:userId', (req, res) => {
  db.collection(req.params.collectionName)
  // find the attendee to edit
  .findOne({ eventId: req.params.eventId, userId: req.params.userId }).then(attendee => {
    logger('sending', attendee);
    res.json({ attendee });
  });
});

// endpoint for event detail page
app.get('/api/:collectionName/:eventId', (req, res) => {
  if (req.params.collectionName === 'conferences') {
    getOneEvent(req, res);
  } else if (req.params.collectionName === 'attendees') {
    getEventAttendees(req, res);
  }
});

// endpoint for a list of events
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