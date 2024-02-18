const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.Mixed,
    ref: "User",
    required: true,
  },
  requestedBook: {
    type: mongoose.Schema.Types.Mixed,
    ref: "Book",
    required: true,
  },
  proposalBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  requestedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    default: "",
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ExchangeRequest = mongoose.model(
  "ExchangeRequest",
  exchangeRequestSchema
);

module.exports = ExchangeRequest;
