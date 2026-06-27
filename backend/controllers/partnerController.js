const Partner = require('../models/Partner');
const { sendPartnerNotification } = require('../utils/sendEmail');
const { AppError } = require('../middleware/errorHandler');

const submitPartner = async (req, res, next) => {
  try {
    const { organizationName, contactPerson, email, phone, interest, message } = req.body;

    if (!organizationName || !contactPerson || !email || !interest) {
      throw new AppError('Organization name, contact person, email, and interest type are required', 400);
    }

    const validInterests = ['church-partner', 'corporate-sponsor', 'foundation-grant', 'inkind-support', 'media-partner', 'other'];
    if (!validInterests.includes(interest)) {
      throw new AppError('Invalid partnership type selected', 400);
    }

    const partner = await Partner.create({ organizationName, contactPerson, email, phone, interest, message });

    try {
      await sendPartnerNotification({ organizationName, contactPerson, email, phone, interest, message });
    } catch (emailErr) {
      console.error('Failed to send email notification:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your partnership interest! Our team will contact you within 5–7 business days.',
      data: { id: partner._id },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitPartner };
