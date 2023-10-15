// user
const express = require("express");
const router = express.Router();
const sendToken = require("../utils/jwtToken");

const {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  verifyUser,
  // termsandcondition,
  newTerms,
  deleteTerms,
  updateTerms,
  allTerms,
  newAddress,
  updateAddress,
  deleteAddress,
  allAddresses,
  allUserTerms,
} = require("../controllers/authController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const User = require("../models/user");
router.route("/register").post(registerUser);
router.route("/login").post(login);

router.route("/logout").get(logout);
router.route("/address").post(newAddress);
router
  .route("/address/:id")
  .put(isAuthenticatedUser, updateAddress)
  .delete(isAuthenticatedUser, deleteAddress);

router.route("/admin/users").get(isAuthenticatedUser, allUsers);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// Admin
router
  .route("/admin/verify/:userId")
  .put(isAuthenticatedUser, authorizeRoles("admin"), verifyUser);

router
  .route("/admin/term")
  .post(isAuthenticatedUser, authorizeRoles("admin", "staff"), newTerms);

router.route("/terms").get(isAuthenticatedUser, allTerms);
router.route("/user/terms").get(allUserTerms);

router
  .route("/admin/term/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin", "staff"), updateTerms)
  .delete(isAuthenticatedUser, authorizeRoles("admin", "staff"), deleteTerms);

router
  .route("/admin/address")
  .get(isAuthenticatedUser, authorizeRoles("admin", "staff"), allAddresses);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin", "staff"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin", "staff"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin", "staff"), deleteUser);

module.exports = router;
