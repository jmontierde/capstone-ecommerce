// require("dotenv").config();
// const twilio = require("twilio");

// console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
// console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
// console.log("TWILIO_FROM_NUMBER:", process.env.TWILIO_FROM_NUMBER);

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const sendSMS = async (to, body) => {
//   try {
//     const message = await client.messages.create({
//       body: body,
//       from: process.env.TWILIO_FROM_NUMBER,
//       to: to,
//     });
//     console.log("SMS sent successfully. Message SID:", message.sid);
//     console.log("to", to);
//   } catch (error) {
//     console.error("Error sending SMS:", error.message);
//   }
// };

// module.exports = sendSMS;

require("dotenv").config();
const axios = require("axios");

console.log("SEMAPHORE_API_KEY:", process.env.SEMAPHORE_API_KEY);
console.log("SENDER_NAME:", process.env.SEMAPHORE_SENDER_NAME);

const API_KEY = process.env.SEMAPHORE_API_KEY;
const SENDER_NAME = process.env.SEMAPHORE_SENDER_NAME;

const sendSMS = async (to, body) => {
  try {
    const response = await axios.post(
      "https://api.semaphore.co/api/v4/messages",
      {
        apikey: API_KEY,
        number: to,
        message: body,
        // sendername: SENDER_NAME,
      }
    );

    console.log("SMS sent successfully. Response:", response.data);
    console.log("to", to);
  } catch (error) {
    console.error("Error sending SMS:", error.response.data);
    throw error;
  }
};

module.exports = sendSMS;

// Your other code...
// (Replace your current Twilio-related code with the above Semaphore code)
