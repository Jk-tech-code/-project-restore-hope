const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: parseInt(process.env.SMTP_PORT, 10) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

const sendContactNotification = async (data) => {
  const adminHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `;

  const autoReplyHtml = `
    <h2>Thank You for Contacting Project Restore Hope</h2>
    <p>Hi ${data.name},</p>
    <p>We have received your message and will get back to you within 2–3 business days.</p>
    <p>If you have an urgent need, please reach us at ${process.env.ADMIN_EMAIL}.</p>
    <p>Blessings,<br/>The Project Restore Hope Team</p>
  `;

  await Promise.all([
    sendEmail({ to: process.env.ADMIN_EMAIL, subject: 'New Contact Form Submission - Project Restore Hope', html: adminHtml }),
    sendEmail({ to: data.email, subject: 'Thank You for Contacting Project Restore Hope', html: autoReplyHtml }),
  ]);
};

const sendVolunteerNotification = async (data) => {
  const interestLabels = {
    'mission-trip': 'Mission Trip',
    'skills-based': 'Skills-Based',
    'prayer-advocacy': 'Prayer / Advocacy',
    'fundraising': 'Fundraising',
    'other': 'Other',
  };

  const adminHtml = `
    <h2>New Volunteer Application</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
    <p><strong>Interest Area:</strong> ${interestLabels[data.interest] || data.interest}</p>
    <p><strong>Availability:</strong> ${data.availability || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message || 'N/A'}</p>
  `;

  const autoReplyHtml = `
    <h2>Thank You for Your Volunteer Application</h2>
    <p>Hi ${data.name},</p>
    <p>Thank you for your interest in volunteering with Project Restore Hope!</p>
    <p>We have received your application and our volunteer coordinator will reach out to you within 3–5 business days to discuss next steps.</p>
    <p>Blessings,<br/>The Project Restore Hope Team</p>
  `;

  await Promise.all([
    sendEmail({ to: process.env.ADMIN_EMAIL, subject: 'New Volunteer Application - Project Restore Hope', html: adminHtml }),
    sendEmail({ to: data.email, subject: 'Thank You for Your Volunteer Application', html: autoReplyHtml }),
  ]);
};

const sendPartnerNotification = async (data) => {
  const interestLabels = {
    'church-partner': 'Church Partner',
    'corporate-sponsor': 'Corporate Sponsor',
    'foundation-grant': 'Foundation Grant',
    'inkind-support': 'In-Kind Support',
    'media-partner': 'Media Partner',
    'other': 'Other',
  };

  const adminHtml = `
    <h2>New Partner / Sponsor Inquiry</h2>
    <p><strong>Organization:</strong> ${data.organizationName}</p>
    <p><strong>Contact Person:</strong> ${data.contactPerson}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
    <p><strong>Interest Type:</strong> ${interestLabels[data.interest] || data.interest}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message || 'N/A'}</p>
  `;

  const autoReplyHtml = `
    <h2>Thank You for Your Partnership Interest</h2>
    <p>Hi ${data.contactPerson},</p>
    <p>Thank you for your interest in partnering with Project Restore Hope!</p>
    <p>Our partnerships team will review your inquiry and contact you within 5–7 business days.</p>
    <p>Blessings,<br/>The Project Restore Hope Team</p>
  `;

  await Promise.all([
    sendEmail({ to: process.env.ADMIN_EMAIL, subject: 'New Partner / Sponsor Inquiry - Project Restore Hope', html: adminHtml }),
    sendEmail({ to: data.email, subject: 'Thank You for Your Partnership Interest', html: autoReplyHtml }),
  ]);
};

const sendDonationReceipt = async (data) => {
  const html = `
    <h2>Donation Receipt — Project Restore Hope</h2>
    <p>Hi ${data.name},</p>
    <p>Thank you for your generous donation of <strong>$${data.amount.toFixed(2)}</strong>!</p>
    <p>Your contribution helps us restore hope and transform communities.</p>
    <p><strong>Transaction Details:</strong></p>
    <ul>
      <li><strong>Amount:</strong> $${data.amount.toFixed(2)}</li>
      <li><strong>Frequency:</strong> ${data.frequency === 'monthly' ? 'Monthly' : 'One-Time'}</li>
      <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
      <li><strong>Payment ID:</strong> ${data.stripePaymentIntentId}</li>
    </ul>
    ${data.note ? `<p><strong>Your Note:</strong> ${data.note}</p>` : ''}
    <p>This receipt serves as your official record for tax purposes.</p>
    <p>Blessings,<br/>The Project Restore Hope Team</p>
  `;

  await Promise.all([
    sendEmail({ to: process.env.ADMIN_EMAIL, subject: `New Donation - $${data.amount.toFixed(2)} - Project Restore Hope`, html }),
    sendEmail({ to: data.email, subject: 'Your Donation Receipt — Project Restore Hope', html }),
  ]);
};

const sendNewsletterConfirmation = async (email) => {
  const html = `
    <h2>Welcome to Project Restore Hope Newsletter!</h2>
    <p>Thank you for subscribing!</p>
    <p>You will receive updates on our programs, impact stories, and ways to get involved.</p>
    <p>If you did not subscribe, please ignore this email.</p>
    <p>Blessings,<br/>The Project Restore Hope Team</p>
  `;

  await sendEmail({ to: email, subject: 'Welcome to the Project Restore Hope Newsletter!', html });
};

module.exports = {
  sendEmail,
  sendContactNotification,
  sendVolunteerNotification,
  sendPartnerNotification,
  sendDonationReceipt,
  sendNewsletterConfirmation,
};
