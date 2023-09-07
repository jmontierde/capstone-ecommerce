const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "php",

    metadata: { integration_check: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

// Refund
// Send stripe API Key   =>   /api/v1/stripeapi
exports.refundPayment = catchAsyncErrors(async (req, res, next) => {
  try {
    const { paymentId, amount, orderItems } = req.body;

    // Create a refund using the Stripe API
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
      amount: Math.round(amount * 100), // Amount in cents
      orderid: orderId,
    });

    // You can save refund details to your database here if needed

    res
      .status(200)
      .json({ success: true, message: "Refund request successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Refund request failed" });
  }
});

// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});

// const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
// const paypal = require("paypal-rest-sdk");

// paypal.configure({
//   mode: "sandbox", // Use 'sandbox' for testing, 'live' for production
//   client_id: `${process.env.PAYPAL_CLIENT_ID}`,
//   client_secret: `${process.env.PAYPAL_CLIENT_SECRET}`,
// });

// // Process PayPal payment => /api/v1/payment/process
// exports.processPayment = catchAsyncErrors(async (req, res, next) => {
//   const paymentData = {
//     intent: "sale",
//     payer: {
//       payment_method: "paypal",
//     },
//     redirect_urls: {
//       return_url: "http://localhost:7000/success", // Replace with your success URL
//       cancel_url: "http://localhost:7000/cancel", // Replace with your cancel URL
//     },
//     transactions: [
//       {
//         amount: {
//           total: "10.00", // Replace with the actual amount from req.body or your logic
//           currency: "USD",
//         },
//         description: "Payment for your eCommerce order",
//       },
//     ],
//   };

//   paypal.payment.create(paymentData, (error, payment) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send("Failed to create PayPal payment.");
//     } else {
//       const { links } = payment;
//       const approvalUrl = links.find(
//         (link) => link.rel === "approval_url"
//       ).href;
//       res.redirect(approvalUrl);
//     }
//   });
// });

// // Send PayPal API credentials => /api/v1/paypalapi
// exports.sendPayPalApi = catchAsyncErrors(async (req, res, next) => {
//   res.status(200).json({
//     client_id: `${process.env.PAYPAL_CLIENT_ID}`, // Replace with your actual PayPal client ID
//     client_secret: `${process.env.PAYPAL_CLIENT_SECRET}`, // Replace with your actual PayPal client secret
//   });
// });
