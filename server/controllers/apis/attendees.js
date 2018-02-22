const express = require('express');
const attendeesService = require('../../services/attendeesService');

const router = express.Router();

router.get('/:eventId/', attendeesService.getEventAttendees);
router.get('/:eventId/:userId', attendeesService.getOneAttendee);

router.put('/:eventId', attendeesService.addAttendee);
router.put('/:eventId/:userId', attendeesService.updateAttendee);

router.delete('/:eventId', attendeesService.deleteAllAttendees);
router.delete('/:eventId/:userId', attendeesService.deleteOneAttendee);

module.exports = router;
