const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true only for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async ({
  fullName,
  email,
  subject,
  message,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `📩 Contact Form - ${subject}`,
    html: `
      <h2>New Contact Message</h2>

      <p><strong>Name:</strong> ${fullName}</p>

      <p><strong>Email:</strong> ${email}</p>

      <p><strong>Subject:</strong> ${subject}</p>

      <hr>

      <p>${message}</p>
    `,
  });

  // Auto reply to the user
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "We've received your message - BudgetWise",
    html: `
      <h2>Hello ${fullName},</h2>

      <p>Thank you for contacting <strong>BudgetWise</strong>.</p>

      <p>We've received your message and our team will get back to you as soon as possible.</p>

      <br>

      <p>Regards,</p>

      <h3>BudgetWise Team</h3>
    `,
  });
};

module.exports = {
  sendContactEmail,
};