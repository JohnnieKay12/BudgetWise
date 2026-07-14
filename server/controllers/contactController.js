const nodemailer = require("nodemailer");

exports.sendContactMessage = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.sendMail({
      from: `"BudgetWise Contact Form" <${process.env.EMAIL_USER}>`,
      replyTo: email, // So you can reply directly to the sender
      to: process.env.EMAIL_USER,

      subject: `📩 BudgetWise Contact: ${subject}`,

      html: `
        <div style="font-family: Arial, sans-serif; padding:20px">
          <h2>New Contact Message</h2>

          <p><strong>Full Name:</strong> ${fullName}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Subject:</strong> ${subject}</p>

          <hr>

          <p>${message}</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });
  }
};