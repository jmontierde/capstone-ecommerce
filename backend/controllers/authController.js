const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const TermsandConditions = require("../models/TermsAndConditions");
const TermsAndConditions = require("../models/TermsAndConditions");

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const validId = await cloudinary.v2.uploader.upload(req.body.validId, {
    folder: "validId",
    width: 150,
    crop: "scale",
  });

  const withBirthdayId = await cloudinary.v2.uploader.upload(
    req.body.withBirthdayId,
    {
      folder: "validId",
      width: 150,
      crop: "scale",
    }
  );

  const { name, email, password, phoneNumber } = req.body;

  console.log("PHONE NUMBER", phoneNumber);

  try {
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      verificationStatus: "Pending",
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      withBirthdayId: {
        public_id: withBirthdayId.public_id,
        url: withBirthdayId.secure_url,
      },
      validId: {
        public_id: validId.public_id,
        url: validId.secure_url,
      },
    });

    sendToken(user, 200, res);
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // Check if user is verified
  if (user.verificationStatus !== "Verified") {
    return next(new ErrorHandler("Your account is pending verification.", 403));
  }

  //Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/password/reset/${resetToken}`;

  // Frontend Url
  const resetUrl = `http://127.0.0.1:5173/password/reset/${resetToken}`;

  // const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  const message = `
  Subject: Password Reset Request
  
  Dear [Your Name],
  
  We have received a request to reset the password for your email account associated with ${user.email}. If you have not initiated this request, please ignore this email.
  
  To reset your password, please follow the link below:
  
  ${resetUrl}
  
  If you did not request this password reset or believe your account may be compromised, please contact our support team immediately by replying to this email. Your security is our priority, and we're here to assist you.
  
  Thank you for choosing Vaping Sidewalk for your email needs.
  
  Best regards,
  ${process.env.SMTP_FROM_EMAIL}
  Vaping Sidewalk
  `;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: "Password Recovery",
    //   message,
    // });

    // res.status(200).json({
    //   success: true,
    //   message: `Email sent to: ${user.email}`,
    // });

    await sendEmail(user.email, "Password Recovery Notification", message);

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update / Change Password => api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect"));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match")
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar
  if (req.body.avatar) {
    const user = await User.findById(req.user.id);
    const image_id = user.avatar.public_id;

    // Delete previous avatar
    const res = await cloudinary.v2.uploader.destroy(image_id);

    // Upload new avatar
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Logout user  => api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  req.headers.authorization = "";
  // res.cookie('token', null, {
  //     expires: new Date(Date.now()),
  //     httpOnly: true
  // })

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Admin Routes
// Get all users => /api/v1/admin/userrs
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().catch((error) => {
    throw error;
  });

  console.log("USERS ALL", users);

  res.status(200).json({
    success: true,
    users,
  });
});

// Get user details => /api/v1/admin/user:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Verify or reject a user's registration => approve/:userId
exports.verifyUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId;
  const verificationStatus = req.body.verificationStatus; // "Verified" or "Rejected"

  try {
    if (verificationStatus === "Rejected") {
      // If the verificationStatus is "Rejected," delete the user
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      return res.status(200).json({ message: "User rejected and deleted." });
    }
    const user = await User.findByIdAndUpdate(userId, { verificationStatus });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("USER VERIFY", user);

    res
      .status(200)
      .json({ message: "User verification status updated successfully." });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  const message = `Subject: Account Deletion Notification\n\nDear ${user.name},\n\nWe regret to inform you that your account with Vaping Sidewalk has been deleted.\n\nReason for Deletion: You've violated our rules and regulations.\n\nIf you believe this action was taken in error or if you have any questions, please contact our support team at ${process.env.SMTP_FROM_EMAIL}.\n\nThank you for your understanding.\n\nSincerely,\nThe Vapers Sidewalk Team`;

  try {
    await sendEmail(user.email, "Account Deletion Notification", message);
    await user.remove();

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.newTerms = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const termsAndConditions = new TermsAndConditions({ title, content });
    await termsAndConditions.save();
    res.status(201).json({
      success: true,
      termsAndConditions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Terms and Conditions creation failed",
    });
  }
});

exports.allTerms = catchAsyncErrors(async (req, res, next) => {
  try {
    const termsAndConditions = await TermsAndConditions.find();
    res.status(201).json({
      success: true,
      termsAndConditions,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.updateTerms = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const updatedTermsAndConditions =
      await TermsAndConditions.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true }
      );

    if (!updatedTermsAndConditions) {
      return res
        .status(404)
        .json({ success: false, message: "Terms and Conditions not found" });
    }

    res.status(200).json({
      success: true,
      updatedTermsAndConditions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Update Terms and Conditions section failed",
    });
  }
});

exports.deleteTerms = catchAsyncErrors(async (req, res, next) => {
  try {
    const deletedTermsAndConditions =
      await TermsAndConditions.findByIdAndDelete(req.params.id);

    if (!deletedTermsAndConditions) {
      return res
        .status(404)
        .json({ success: false, message: "Terms and Conditions not found" });
    }

    res.status(200).json({
      success: true,
      message: "Delete Terms and Conditions failed",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Update Terms and Conditions section failed",
    });
  }
});

// exports.newVersion = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { version } = req.params;
//     const { title, content } = req.body;
//     const updatedTermsAndConditions = await TermsAndConditions.findOne({
//       version,
//     });

//     if (!updatedTermsAndConditions) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Terms and Conditions not found" });
//     }

//     // Create a new section
//     const newSection = {
//       title,
//       content,
//     };

//     updatedTermsAndConditions.sections.push(newSection);

//     await updatedTermsAndConditions.save();

//     res.status(201).json({
//       success: true,
//       updatedTermsAndConditions,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Create Terms and Conditions section failed",
//     });
//   }
// });

// exports.updateTerms = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { version, sectionsIndex } = req.params;
//     const { title, content } = req.body;
//     const updatedTermsAndConditions = await TermsAndConditions.findOne({
//       version,
//     });

//     if (!updatedTermsAndConditions) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Terms and Conditions not found" });
//     }

//     if (
//       sectionsIndex < 0 ||
//       sectionsIndex >= updatedTermsAndConditions.sections.length
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid sectionsIndex" });
//     }

//     // Update the specified section
//     updatedTermsAndConditions.sections[sectionsIndex].title = title;
//     updatedTermsAndConditions.sections[sectionsIndex].content = content;

//     await updatedTermsAndConditions.save();

//     res.status(200).json({
//       success: true,
//       updatedTermsAndConditions,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Update Terms and Conditions section failed",
//     });
//   }
// });

// exports.allTerms = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const termsAndConditions = await TermsAndConditions.find();
//     res.status(201).json({
//       success: true,
//       termsAndConditions,
//     });
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });

// exports.deleteTerms = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { version, sectionsIndex } = req.params;
//     const updatedTermsAndConditions = await TermsAndConditions.findOne({
//       version,
//     });

//     if (!updatedTermsAndConditions) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Terms and Conditions not found" });
//     }

//     if (
//       sectionsIndex < 0 ||
//       sectionsIndex >= updatedTermsAndConditions.sections.length
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid sectionsIndex" });
//     }

//     // Remove the specified section
//     updatedTermsAndConditions.sections.splice(sectionsIndex, 1);

//     await updatedTermsAndConditions.save();

//     res.status(201).json({
//       success: true,
//       message: "Delete Terms and Conditions",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Delete Terms and Conditions section failed",
//     });
//   }
// });

// Terms and Condtion /api/v1/terms
// exports.termsandcondition = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   try {
//     const termsAndConditions = `

//   1. Intellectual Property Rights:

// a. Unless otherwise stated, we own the intellectual property rights for all content on the website. This includes text, images, logos, graphics, and other materials.

// b. You may not reproduce, distribute, or use our intellectual property without obtaining prior written consent from us.

// 2. Age Restriction:

// a. By using our website, you confirm that you are of legal age to purchase vaping products in your jurisdiction.

// b. We reserve the right to refuse service, terminate accounts, or cancel orders if we believe the user is underage or in violation of applicable laws.

// 3. Product Information:

// a. We strive to provide accurate and up-to-date information about our products, including descriptions, pricing, and availability.

// b. However, we do not warrant or guarantee the accuracy, completeness, or reliability of any product information on the website.

// c. We reserve the right to modify or discontinue products without prior notice.

// 4. Product Refund/Return/Warranty

// a. The product refund/ return will be analyze by admin within 7 days.

// b. The warranty should be effective on the day the parcel is received by the customer.

// 5. Delivery

// a. There will be an additional charge for deliveries outside of Metro Manila.

// 6. Product Customization

// a. The customization segment refers to the section of our website or platform where customers can personalize and modify their chosen products.

// 7. Product Inclusion:

//  a. Only the products listed on our platform are eligible for customization. Customers can select from the available product options to begin the customization process.

// 8. Selection Availability:

//    a. Customers are advised that customization options are limited to the products included in the selection available on our platform. We do not provide customization services for products not listed or offered on our website.

// 9. Customization Limitations:

//    a. While we strive to provide a wide range of customization options, please note that certain product features or characteristics may have predefined limitations or constraints. These limitations will be clearly communicated during the customization process.

// 10. Customization Accuracy:

//    a. We make every effort to accurately display the customization options available for each product. However, please be aware that the final customized product may slightly differ from the visual representation displayed on our platform due to variations in materials, colors, or other factors.

// 11. Order Confirmation:

//    a. Once the customization selections are made, customers must review and confirm their order before finalizing the purchase. It is the customer's responsibility to ensure that all selected options and details are correct before submitting the order.

// 12. Modification or Cancellation:

//    a. Once an order has been placed for a customized product, modifications or cancellations may not be possible. It is important to carefully review the customization selections and order details before finalizing the purchase.

// 13. Modification of Terms:

//     a. We reserve the right to modify or update these terms and conditions related to our customization segment at any time. Customers will be notified of any changes, and continued use of the customization segment after such modifications constitutes acceptance of the updated terms.

// Please note that these terms and conditions are provided as a general guideline and should be adapted to suit the specific requirements and policies of our business.

//   `;

//     res.status(200).json({
//       success: true,
//       content: termsAndConditions,
//     });
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// });
