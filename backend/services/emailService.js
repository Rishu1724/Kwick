const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your_email@example.com',
    pass: process.env.EMAIL_PASS || 'your_password'
  }
});

// Send email notification
const sendEmailNotification = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Kwick" <${process.env.EMAIL_FROM || 'noreply@kwick.com'}>`,
      to,
      subject,
      html
    });

    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send new message notification
const sendNewMessageNotification = async (userEmail, senderName, productName) => {
  const subject = 'New Message on Kwick';
  const html = `
    <h2>Hello!</h2>
    <p>You have received a new message from ${senderName} regarding your product "${productName}".</p>
    <p>Please log in to your account to view the message.</p>
    <p>Thank you for using Kwick!</p>
  `;

  return await sendEmailNotification(userEmail, subject, html);
};

// Send new review notification
const sendNewReviewNotification = async (userEmail, reviewerName, productName, rating) => {
  const subject = 'New Review on Kwick';
  const html = `
    <h2>Hello!</h2>
    <p>${reviewerName} has left a ${rating}-star review on your product "${productName}".</p>
    <p>Please log in to your account to view the review.</p>
    <p>Thank you for using Kwick!</p>
  `;

  return await sendEmailNotification(userEmail, subject, html);
};

// Send featured ad notification
const sendFeaturedAdNotification = async (userEmail, productName) => {
  const subject = 'Your Ad is Now Featured!';
  const html = `
    <h2>Congratulations!</h2>
    <p>Your product "${productName}" is now featured on Kwick!</p>
    <p>This will help increase visibility and attract more potential buyers.</p>
    <p>Thank you for using Kwick!</p>
  `;

  return await sendEmailNotification(userEmail, subject, html);
};

module.exports = {
  sendEmailNotification,
  sendNewMessageNotification,
  sendNewReviewNotification,
  sendFeaturedAdNotification
};