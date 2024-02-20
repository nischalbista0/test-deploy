const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads");
const userController = require("../controllers/user-controller");
const passwordRecoveryController = require("../controllers/passwordRecoveryController");
const { verifyUser } = require("../middlewares/auth");

// User registration
router.post("/register", userController.registerUser);

// User login
router.post("/login", userController.loginUser);

// Get user profile
router.get("/", verifyUser, userController.getUserProfile);

// Get user info from user id
router.get("/:user_id", userController.getUserInfoById);

// Update password
router.put("/change-password", verifyUser, userController.updatePassword);

// Update user profile
router.put("/edit-profile", verifyUser, userController.updateUserProfile);

// Add points to user
router.put("/add-points", verifyUser, userController.addPointsToUser);
router.put("/subtract-points", verifyUser, userController.subtractPointsToUser);

// Upload image
router.post("/uploadImage", verifyUser, upload, userController.uploadImage);

// Get all exchange requests for a user
router.get(
  "/:user_id/exchange-requests",
  userController.getAllExchangeRequests
);

// Password recovery routes
router.post(
  "/password-recovery/request-password-reset",
  passwordRecoveryController.requestPasswordReset
);
router.post(
  "/password-recovery/reset-password/:token",
  passwordRecoveryController.resetPassword
);

// Route to set character name and/or avatar name
router.put('/set-character-avatar', verifyUser, userController.setCharacterAndAvatar);

module.exports = router;
