const queryHelpers = require('./queryHelpers');
const logger = require('debug')('conferenceService');

const collectionName = 'conferences';

const getEvents = (req, res) => {
  req.db
    .collection(collectionName)
    .find()
    .toArray()
    .then(events => {
      logger('get all events response', events);
      res.json({ events });
    });
};

const getOneEvent = (req, res) => {
  const { params } = req;

  const eventId = queryHelpers.getMongoId(params.eventId, res);

  req.db
    .collection(collectionName)
    .find({ _id: eventId })
    .limit(1)
    .next()
    .then(event => {
      logger('getOneEvent response', event);
      res.json({ event });
    })
    .catch(err => {
      logger('error getting event: ', err);
      res.json({ message: `Could not get event: ${err}` });
    });
};

const addOneEvent = (req, res) => {
  const { name, website, date, city, country, description } = req.body;
  req.db.collection(collectionName).updateOne(
    // filter
    {
      website,
    },
    // data to update
    {
      $set: {
        name,
        website,
        date,
        city,
        country,
        description,
      },
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
      req.db
        .collection(collectionName)
        .findOne({ website })
        .then(responseEvent => {
          logger('response', responseEvent);
          res.json(responseEvent);
        });
    },
  );
};

const deleteOneEvent = (req, res) => {
  const eventId = queryHelpers.getMongoId(req.params.eventId);

  req.db
    .collection(collectionName)
    .deleteOne({ _id: eventId })
    .then(event => {
      logger('deleteConference');
      res.json({ event });
    })
    .catch(err => {
      logger('Error deleting conference: ', err);
      res.json({ message: `Could not delete conference: ${err}` });
    });
};

module.exports = {
  getEvents,
  getOneEvent,
  addOneEvent,
  deleteOneEvent,
};
