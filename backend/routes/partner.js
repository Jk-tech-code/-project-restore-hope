const express = require('express');
const router = express.Router();
const { submitPartner } = require('../controllers/partnerController');

router.post('/', submitPartner);

module.exports = router;
