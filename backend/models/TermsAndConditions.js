const mongoose = require("mongoose");

const termsAndConditionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("TermsAndConditions", termsAndConditionsSchema);
