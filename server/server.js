import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const path = require('path');
const logger = require('debug')('expressServer');
require('dotenv').config();

const app = express();
let db;

MongoClient.connect('mongodb://localhost/confriends')
  .then(connection => {
    db = connection;
    app.listen(3001, () => logger('running on port 3001'));
  })
  .catch(err => logger('ERROR:', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// eslint-disable-next-line no-unused-vars
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // YOUR-AUTH0-DOMAIN name e.g prosper.auth0.com
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  // This is the identifier we set when we created the API
  audience: `https://${process.env.AUTH0_AUDIENCE}`,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

// helper function

const getMongoId = (idString, res) => {
  // convert the id string to a MongoDB ObjectId
  try {
    return ObjectId(idString);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
  }
};

const deleteConferenceAttendees = (req, res) => {
  db
    .collection(req.params.collectionName)
    .deleteMany({ eventId: req.params.eventId })
    .then(attendees => {
      logger('deleteConferenceAttendees');
      res.json({ attendees });
    });
};

const deleteConference = (req, res) => {
  const eventId = getMongoId(req.params.eventId);

  db
    .collection(req.params.collectionName)
    .deleteOne({ _id: eventId })
    .then(event => {
      logger('deleteConference');
      res.json({ event });
    });
};

const getEventAttendees = (req, res) => {
  const { params } = req;

  db
    .collection('attendees')
    .find({
      eventId: params.id,
    })
    .toArray()
    .then(attendees => {
      logger('getEventAttendees response', attendees);
      res.json({ attendees });
    });
};

const getOneEvent = (req, res) => {
  const { params } = req;

  const eventId = getMongoId(params.id, res);

  db
    .collection(params.collectionName)
    .find({ _id: eventId })
    .limit(1)
    .next()
    .then(event => {
      logger('getOneEvent response', event);
      res.json({ event });
    });
};

/**
 * Delete API
 */

// delete an attendee
app.delete('/api/:collectionName/:eventId/:userId', (req, res) => {
  const { eventId, userId } = req.params;
  db
    .collection(req.params.collectionName)
    .findOneAndDelete({ eventId, userId }, err => {
      db
        .collection(req.params.collectionName)
        .find({ eventId })
        .toArray()
        .then(attendees => {
          logger('attendees after delete', attendees);
          res.json({ attendees });
        });
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
    { eventId: req.params.eventId, userId: req.body.userId },
    {
      $set: {
        eventId: req.body.eventId,
        userId: req.body.userId,
        name: req.body.name,
        procurementLink: req.body.procurementLink,
        approved: req.body.approved,
      },
    },
    result => {
      db
        .collection(req.params.collectionName)
        .findOne({ eventId: req.params.eventId, userId: req.body.userId })
        .then(attendee => {
          logger('updatedAttendee: ', attendee);
          res.json(attendee);
        });
    }
  );
});

// adding event to collection
app.put('/api/:collectionName', (req, res) => {
  logger('body', req.body);
  const { name, website, date, city, country, description } = req.body;
  db.collection(req.params.collectionName).updateOne(
    {
      website,
    },
    {
      name,
      website,
      date,
      city,
      country,
      description,
    },
    { upsert: true },
    err => {
      db
        .collection(req.params.collectionName)
        .findOne({ website })
        .then(responseEvent => {
          logger('response', responseEvent);
          res.json(responseEvent);
        });
    }
  );
});

// updating attendee collection
app.put('/api/:collectionName/:id', (req, res) => {
  logger('body', req.body);
  db.collection(req.params.collectionName).updateOne(
    {
      eventId: req.body.eventId,
      userId: req.body.userId,
    },
    {
      eventId: req.body.eventId,
      userId: req.body.userId,
      name: req.body.name,
      procurementLink: req.body.procurementLink,
      approved: req.body.approved,
    },
    { upsert: true },
    err => {
      db
        .collection(req.params.collectionName)
        .findOne({ eventId: req.body.eventId, userId: req.body.userId })
        .then(responseAttendee => {
          logger('response', responseAttendee);
          res.json(responseAttendee);
        });
    }
  );
});

/**
 * Read API
 */

// endpoint for edit attendee page
// each event attendee has a unique
// entry in the database so we have to
// filter on eventId and userId
app.get('/api/:collectionName/:eventId/:userId', (req, res) => {
  db
    .collection(req.params.collectionName)
    // find the attendee to edit
    .findOne({ eventId: req.params.eventId, userId: req.params.userId })
    .then(attendee => {
      logger('sending', attendee);
      res.json({ attendee });
    });
});

// endpoint for event detail page
app.get('/api/:collectionName/:id', (req, res) => {
  if (req.params.collectionName === 'conferences') {
    getOneEvent(req, res);
  } else if (req.params.collectionName === 'attendees') {
    getEventAttendees(req, res);
  }
});

// endpoint for a list of events
app.get('/api/:collectionName', (req, res) => {
  db
    .collection(req.params.collectionName)
    .find()
    .toArray()
    .then(events => {
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
