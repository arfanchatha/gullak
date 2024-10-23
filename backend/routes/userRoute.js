const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.route("/signup").post(authController.signup);
router
  .route("/signupforassistant")
  .post(
    authController.protect,
    authController.restricTo("admin"),
    authController.signup
  );
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/forgotpassword").patch(authController.forgotPassword);
router.route("/resetpassword/:token").patch(authController.resetPassword);
router
  .route("/updatepassword")
  .patch(authController.protect, authController.updatePassword);
router
  .route("/updateme")
  .patch(authController.protect, userController.updateMe);
router
  .route("/deleteme")
  .delete(authController.protect, userController.deleteMe);

router.route("/").get(authController.protect, userController.getAllUsers);
router.route("/me").get(authController.protect, userController.getUser);

module.exports = router;
