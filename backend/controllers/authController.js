const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    sendToken(user, 200, res);
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

// Register a user => /api/v1/register
// exports.registerUser = catchAsyncErrors(async (req, res, next) => {
//   const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
//     folder: "avatars",
//     width: 150,
//     crop: "scale",
//   });

//   const validId = await cloudinary.v2.uploader.upload(req.body.validId, {
//     folder: "validId",
//     width: 150,
//     crop: "scale",
//   });

//   const withBirthdayId = await cloudinary.v2.uploader.upload(
//     req.body.withBirthdayId,
//     {
//       folder: "validId",
//       width: 150,
//       crop: "scale",
//     }
//   );

//   const { name, email, password, phoneNumber } = req.body;

//   try {
//     const user = await User.create({
//       name,
//       email,
//       password,
//       avatar: {
//         public_id: result.public_id,
//         url: result.secure_url,
//       },
//       phoneNumber,
//       verificationStatus: "Pending",
//       avatar: {
//         public_id: result.public_id,
//         url: result.secure_url,
//       },
//       withBirthdayId: {
//         public_id: withBirthdayId.public_id,
//         url: withBirthdayId.secure_url,
//       },
//       validId: {
//         public_id: validId.public_id,
//         url: validId.secure_url,
//       },
//     });

//     sendToken(user, 200, res);
//   } catch (error) {
//     next(new ErrorHandler(error.message, 400));
//   }

// });

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
  // if (user.verificationStatus !== "Verified") {
  //   return next(new ErrorHandler("Your account is pending verification.", 403));
  // }

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
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

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
    const user = await User.findByIdAndUpdate(userId, { verificationStatus });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

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

  // Remove avatar from cloudinary - TODO
  await user.remove();

  res.status(200).json({
    success: true,
  });
});
