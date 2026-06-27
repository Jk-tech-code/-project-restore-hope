const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/sendEmail');
const { AppError } = require('../middleware/errorHandler');

const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      throw new AppError('Name, email, and message are required', 400);
    }

    const contact = await Contact.create({ name, email, phone, message });

    try {
      await sendContactNotification({ name, email, phone, message });
    } catch (emailErr) {
      console.error('Failed to send email notification:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. We will get back to you within 2–3 business days.',
      data: { id: contact._id },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact };
