const Donation = require('../models/Donation');
const { sendDonationReceipt } = require('../utils/sendEmail');
const { AppError } = require('../middleware/errorHandler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency, frequency, name, email, note } = req.body;

    if (!name || !email || !amount) {
      throw new AppError('Name, email, and amount are required', 400);
    }

    if (amount < 1) {
      throw new AppError('Donation amount must be at least $1', 400);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
      metadata: {
        name,
        email,
        frequency: frequency || 'one-time',
      },
      receipt_email: email,
    });

    const donation = await Donation.create({
      name,
      email,
      amount,
      currency: currency || 'usd',
      frequency: frequency || 'one-time',
      note,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      data: { id: donation._id },
    });
  } catch (err) {
    next(err);
  }
};

const confirmDonation = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      throw new AppError('Payment intent ID is required', 400);
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment has not been completed', 400);
    }

    const donation = await Donation.findOne({ stripePaymentIntentId: paymentIntentId });

    if (!donation) {
      throw new AppError('Donation record not found', 404);
    }

    donation.status = 'succeeded';
    await donation.save();

    try {
      await sendDonationReceipt({
        name: donation.name,
        email: donation.email,
        amount: donation.amount,
        frequency: donation.frequency,
        stripePaymentIntentId: donation.stripePaymentIntentId,
        note: donation.note,
      });
    } catch (emailErr) {
      console.error('Failed to send donation receipt:', emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Donation confirmed successfully. Thank you for your generosity!',
    });
  } catch (err) {
    next(err);
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: 'Webhook signature verification failed' });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const donation = await Donation.findOne({ stripePaymentIntentId: paymentIntent.id });

    if (donation && donation.status !== 'succeeded') {
      donation.status = 'succeeded';
      await donation.save();

      try {
        await sendDonationReceipt({
          name: donation.name,
          email: donation.email,
          amount: donation.amount,
          frequency: donation.frequency,
          stripePaymentIntentId: donation.stripePaymentIntentId,
          note: donation.note,
        });
      } catch (emailErr) {
        console.error('Failed to send donation receipt:', emailErr.message);
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    await Donation.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: 'failed' }
    );
  }

  res.json({ received: true });
};

const getDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPaymentIntent, confirmDonation, stripeWebhook, getDonations };
