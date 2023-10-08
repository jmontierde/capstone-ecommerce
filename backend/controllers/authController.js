const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const isEmailValid = require("../utils/emailValidator");
const TermsAndConditions = require("../models/TermsAndConditions");
const Address = require("../models/address");
// Register a user => /api/v1/register
// Email validator function
function isGmailEmail(email) {
  // Regular expression to match Gmail email addresses
  const gmailRegex = /^[a-zA-Z0-9._-]+@gmail.com$/;

  return gmailRegex.test(email);
}
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

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

  try {
    // const isEmailValid = validateEmail(email);

    // if (!isEmailValid) {
    //   throw new Error("Invalid email address");
    // }
    const user = await User.create({
      firstName,
      lastName,
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

    // const smsMessage = "Thank you for signing up!";
    // await sendSMS(user.phoneNumber, smsMessage);

    sendToken(user, 200, res);
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

const validateEmail = (email) => {
  // Check if the email address is valid according to the RFC 5322 standard.
  if (!emailValidator.validate(email)) {
    return false;
  }

  // Check if the email address is a Gmail address.
  const domain = email.split("@")[1];
  return domain === "gmail.com";
};

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
  const user = await User.findOne({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  });

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
    await sendEmail(user.email, "Password Recovery Notification", message);
    await sendSMS(user.phoneNumber, message);
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
  console.log("Received request to update password");
  console.log("Request body:", req.body);

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect"));
  }

  // if (req.body.newPassword !== req.body.confirmPassword) {
  //   return next(
  //     new ErrorHandler("New password and confirm password do not match")
  //   );
  // }

  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

//Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
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
    firstName: req.body.firstName,
    lastName: req.body.lastName,
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

  const message = `Subject: Account Deletion Notification\n\nDear ${user.firstName} ${user.lastName},\n\nWe regret to inform you that your account with Vaping Sidewalk has been deleted.\n\nReason for Deletion: You've violated our rules and regulations.\n\nIf you believe this action was taken in error or if you have any questions, please contact our support team at ${process.env.SMTP_FROM_EMAIL}.\n\nThank you for your understanding.\n\nSincerely,\nThe Vapers Sidewalk Team`;

  try {
    await sendEmail(user.email, "Account Deletion Notification", message);
    await user.remove();

    // await sendSMS(user.phoneNumber, message);
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

exports.allUserTerms = catchAsyncErrors(async (req, res, next) => {
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

// Address
// Address
exports.newAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    const { street, apartment, city, zipCode } = req.body;

    const address = new Address({
      street,
      apartment,
      city,
      zipCode,
    });

    await address.save();
    res.status(201).json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Address creation failed",
    });
  }
});

// Retrieve all addresses
exports.allAddresses = catchAsyncErrors(async (req, res, next) => {
  try {
    const addresses = await Address.find();
    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update an address
exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, street, city, zipCode } = req.body;
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { name, street, city, zipCode },
      { new: true }
    );

    if (!updatedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res.status(200).json({
      success: true,
      updatedAddress,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Update address failed",
    });
  }
});

// Delete an address
exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);

    if (!deletedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Delete address failed",
    });
  }
});
