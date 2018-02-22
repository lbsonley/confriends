const express = require('express');
const conferenceService = require('../../services/conferencesService');

const router = express.Router();

router.get('/', conferenceService.getEvents);
router.get('/:eventId', conferenceService.getOneEvent);

router.put('/', conferenceService.addOneEvent);

router.delete('/:eventId', conferenceService.deleteOneEvent);

module.exports = router;
