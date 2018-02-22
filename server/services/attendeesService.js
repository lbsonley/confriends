const logger = require('debug')('attendeesService');

const collectionName = 'attendees';

const getEventAttendees = (req, res) => {
  const { params } = req;

  req.db
    .collection(collectionName)
    .find({
      eventId: params.eventId,
    })
    .toArray()
    .then(attendees => {
      logger('getEventAttendees response: ', attendees);
      res.json({ attendees });
    })
    .catch(err => {
      logger('error getting event attendees: ', err);
      res.json({ message: `Could not get event attendees: ${err}` });
    });
};

const getOneAttendee = (req, res) => {
  const { eventId, userId } = req.params;
  logger(eventId, userId);

  req.db
    .collection(collectionName)
    // find the attendee to edit
    .findOne({ eventId, userId })
    .then(attendee => {
      logger('sending', attendee);
      res.json({ attendee });
    });
};

const addAttendee = (req, res) => {
  logger('body', req.body);
  req.db.collection(collectionName).updateOne(
    {
      eventId: req.body.eventId,
      userId: req.body.userId,
    },
    {
      $set: {
        eventId: req.body.eventId,
        userId: req.body.userId,
        name: req.body.name,
        procurementLink: req.body.procurementLink,
        approved: req.body.approved,
      },
    },
    { upsert: true },
    err => {
      if (err) {
        logger('Error adding attendee: ', err);
        res.json({ message: `Could not add attendee: ${err}` });
        return;
      }
      req.db
        .collection(collectionName)
        .findOne({ eventId: req.body.eventId, userId: req.body.userId })
        .then(responseAttendee => {
          logger('response', responseAttendee);
          res.json(responseAttendee);
        });
    }
  );
};

const updateAttendee = (req, res) => {
  logger('body', req.body);
  req.db.collection(collectionName).updateOne(
    // filter
    { eventId: req.params.eventId, userId: req.body.userId },
    // info to update
    {
      $set: {
        eventId: req.body.eventId,
        userId: req.body.userId,
        name: req.body.name,
        procurementLink: req.body.procurementLink,
        approved: req.body.approved,
      },
    },
    // callback
    err => {
      if (err) {
        logger('error updating attendee: ', err);
        res.json({ message: `Could not update attendee info: ${err}` });
        return;
      }
      req.db
        .collection(collectionName)
        .findOne({ eventId: req.params.eventId, userId: req.body.userId })
        .then(attendee => {
          logger('updatedAttendee: ', attendee);
          res.json(attendee);
        });
    },
  );
};

const deleteOneAttendee = (req, res) => {
  const { eventId, userId } = req.params;
  req.db
    .collection(collectionName)
    .findOneAndDelete({ eventId, userId }, err => {
      if (err) {
        logger('error deleting attendee: ', err);
        res.json({ message: `Could not delete attendee: ${err}` });
        return;
      }
      getEventAttendees(req, res);
    });
};

const deleteAllAttendees = (req, res) => {
  req.db
    .collection(collectionName)
    .deleteMany({ eventId: req.params.eventId })
    .then(attendees => {
      logger('deleteConferenceAttendees');
      res.json({ attendees });
    })
    .catch(err => {
      logger('error deleting conference attendees: ', err);
      res.json({ message: `Could not delete conference attendees: ${err}` });
    });
};

module.exports = {
  getOneAttendee,
  getEventAttendees,
  addAttendee,
  updateAttendee,
  deleteOneAttendee,
  deleteAllAttendees,
};
