const express = require('express');
const router = express.Router();
const { submitVolunteer } = require('../controllers/volunteerController');

router.post('/', submitVolunteer);

module.exports = router;
