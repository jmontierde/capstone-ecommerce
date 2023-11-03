// Import required modules
require("dotenv").config();
const twilio = require("twilio");

// Create a Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to send an SMS
const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_FROM_NUMBER,
      to: to, // The 'to' parameter should be passed as an argument
    });
    console.log("SMS sent successfully. Message SID:", message.sid);
    console.log("to", to);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
  }
};
module.exports = sendSMS;

// Test sending an SMS

// Pass a valid 'to' phone number
