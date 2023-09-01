// const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         auth: {
//             user: process.env.SMTP_EMAIL,
//             pass: process.env.SMTP_PASSWORD
//         }
//     });

//     const message = {
//         from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     }

//     await transporter.sendMail(message)
// }
// module.exports = sendEmail;

// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   const message = {
//     from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message, // Use the 'html' property for HTML content
//   };

//   await transporter.sendMail(message);
// };

// module.exports = sendEmail;

// const nodemailer = require("nodemailer");

// // Create a transporter using Gmail SMTP
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "montierdejayson@gmail.com", // Your Gmail email address
//     pass: "evxkyyogrjtqvlcw", // Generate an app password for your Gmail account
//   },
// });

// // Function to send the email
// const sendEmail = async (toEmail, subject, text) => {
//   try {
//     // Send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: "Jayson Montierde <montierdejayson@gmail.com>",
//       to: toEmail,
//       subject: subject,
//       text: text,
//     });

//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.error("Error sending email: ", error);
//   }
// };

// module.exports = sendEmail;
const nodemailer = require("nodemailer");

const sendEmail = async (toEmail, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "montierdejayson@gmail.com", // Your Gmail email address
        pass: "evxkyyogrjtqvlcw", // Generate an app password for your Gmail account
      },
    });

    const message = {
      from: "Jayson Montierde <montierdejayson@gmail.com>",
      to: toEmail,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(message);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error; // You can choose to handle this error as needed
  }
};

module.exports = sendEmail;
