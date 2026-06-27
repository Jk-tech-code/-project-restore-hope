const Subscriber = require('../models/Subscriber');
const { sendNewsletterConfirmation } = require('../utils/sendEmail');
const { AppError } = require('../middleware/errorHandler');

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();

        try {
          await sendNewsletterConfirmation(email);
        } catch (emailErr) {
          console.error('Failed to send email:', emailErr.message);
        }

        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been re-subscribed to the newsletter.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
      });
    }

    await Subscriber.create({ email });

    try {
      await sendNewsletterConfirmation(email);
    } catch (emailErr) {
      console.error('Failed to send email:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
    });
  } catch (err) {
    next(err);
  }
};

const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (subscriber) {
      subscriber.isActive = false;
      await subscriber.save();
    }

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { subscribe, unsubscribe };
