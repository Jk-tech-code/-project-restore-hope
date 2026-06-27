const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmDonation, getDonations, stripeWebhook } = require('../controllers/donationController');

router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm', confirmDonation);
router.post('/webhook', stripeWebhook);
router.get('/', getDonations);

module.exports = router;
