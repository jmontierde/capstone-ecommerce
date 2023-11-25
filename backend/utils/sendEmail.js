const nodemailer = require("nodemailer");

const sendEmail = async (toEmail, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "vapingsidewalk@gmail.com", // Your Gmail email address
        pass: "wrjxxwqzgepnbrpf", // Generate an app password for your Gmail account
      },
    });

    const message = {
      from: "Vaping Sidewalk <vapingsidewalk@gmail.com>",
      to: toEmail,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(message);
    console.log("Email sent successfully", await transporter.sendMail(message));
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error; // You can choose to handle this error as needed
  }
};

module.exports = sendEmail;
