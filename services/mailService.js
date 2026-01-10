const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use "host", "port", etc. for other providers
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail({ to, subject, html }) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM_ADDRESS,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Email not sent');
  }
}

module.exports = { sendEmail };
