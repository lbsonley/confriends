const express = require('express');
const conferencesController = require('../../../controllers/apis/conferences');
const attendeesController = require('../../../controllers/apis/attendees');

const router = express.Router();

router.use('/conferences', conferencesController);
router.use('/attendees', attendeesController);

module.exports = router;
