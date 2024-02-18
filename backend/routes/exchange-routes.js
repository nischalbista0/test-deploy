const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/auth");
const exchangeRequestController = require("../controllers/exchangeRequest-controller");

// Get all exchange requests
router.get("/", verifyUser, exchangeRequestController.getAllExchangeRequests);

// Get user's exchange request
router.get(
  "/exchange-requests",
  verifyUser,
  exchangeRequestController.getUserExchangeRequests
);

// Create an exchange request
router.post(
  "/:book_id/exchange-request",
  verifyUser,
  exchangeRequestController.createExchangeRequest
);

// Accept an exchange request
router.put(
  "/exchange-request/:request_id/accept",
  exchangeRequestController.acceptExchangeRequest
);

// Decline an exchange request
router.delete(
  "/exchange-request/:request_id/decline",
  exchangeRequestController.declineExchangeRequest
);

// Get accepted exchange requests of current user
router.get(
  "/exchange-requests/accepted",
  verifyUser,
  exchangeRequestController.getAcceptedExchangeRequests
);

module.exports = router;
