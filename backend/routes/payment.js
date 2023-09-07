const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendStripApi,
  refundPayment,
} = require("../controllers/paymentController");

const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/refund").post(isAuthenticatedUser, refundPayment);

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, sendStripApi);

module.exports = router;
