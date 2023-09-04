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

// version: {
//   type: String, // You can use a version number or name here
//   required: true,
// },
// sections: [
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     content: [
//       {
//         type: String,
//       },
//     ],
//   },
// ],
