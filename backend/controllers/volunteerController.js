const Volunteer = require('../models/Volunteer');
const { sendVolunteerNotification } = require('../utils/sendEmail');
const { AppError } = require('../middleware/errorHandler');

const submitVolunteer = async (req, res, next) => {
  try {
    const { name, email, phone, interest, availability, message } = req.body;

    if (!name || !email || !interest) {
      throw new AppError('Name, email, and interest area are required', 400);
    }

    const validInterests = ['mission-trip', 'skills-based', 'prayer-advocacy', 'fundraising', 'other'];
    if (!validInterests.includes(interest)) {
      throw new AppError('Invalid interest area selected', 400);
    }

    const volunteer = await Volunteer.create({ name, email, phone, interest, availability, message });

    try {
      await sendVolunteerNotification({ name, email, phone, interest, availability, message });
    } catch (emailErr) {
      console.error('Failed to send email notification:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your volunteer application! Our team will contact you within 3–5 business days.',
      data: { id: volunteer._id },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitVolunteer };
