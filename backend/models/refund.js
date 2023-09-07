// models/refund.js

const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  imageReason: {
    public_id: String,
    url: String,
  },
  orderId: {
    type: String, // Array of reasons
    required: true,
  },
  reasons: {
    type: [String], // Array of reasons
    required: true,
  },
  otherReason: {
    type: String, // Array of reasons
    required: false,
  },
  status: {
    type: String, // 'pending', 'accepted', 'rejected'
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Refund", refundSchema);
