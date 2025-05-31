import EmailTemplate from "../models/email-template"; // Import your EmailTemplate model
const nodemailer = require('nodemailer');

interface SendEmail {
  to: string | string[];
  subject?: string;
  from?: string;
  html?: string;
}

export class EmailService {
  // General sendEmail function
  sendEmail = async (data: SendEmail) => {
    const { to, subject, html, from = '"FGA Hub" <esanni5@gmail.com>' } = data;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASSWORD,  // Your Gmail password or App Password
      },
    });

    const mailOptions = {
      from,
      to,
      subject,
      html, // Use the html from the SendEmail object
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Send welcome email with dynamic content
  sendWelcomeEmail = async (to: string, data: { hash: string; name: string }) => {
    const link = `${process.env.FRONTEND_URL}/confirm-email?hash=${data.hash}`;

    // Fetch the email template (assuming it is stored as HTML)
    const temp = await EmailTemplate.findOne({ type: "welcome" });

    // Check if template is found and replace the placeholder
    if (temp && temp.body) {
      let htmlContent = temp.body;

      // Replace placeholders with dynamic values (for example, name and link)
      htmlContent = htmlContent.replace('{{username}}', data.name);
      htmlContent = htmlContent.replace('{{verification_link}}', link);

      // Send the email with the dynamic content
      await this.sendEmail({
        to,
        subject: temp.subject,
        html: htmlContent,
      });
    } else {
      console.error('Welcome email template not found!');
    }
  };
}
