// admin-controller.js

const User = require("../models/User");
const ExchangeRequest = require("../models/ExchangeRequest");
const Book = require("../models/Books");

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalExchangeRequests = await ExchangeRequest.countDocuments();

    // Get counts for pending, accepted, and declined exchange requests
    const pendingExchangeRequests = await ExchangeRequest.countDocuments({
      status: "pending",
    });
    const acceptedExchangeRequests = await ExchangeRequest.countDocuments({
      status: "accepted",
    });
    const declinedExchangeRequests = await ExchangeRequest.countDocuments({
      status: "declined",
    });

    res.json({
      totalUsers,
      totalBooks,
      totalExchangeRequests,
      pendingExchangeRequests,
      acceptedExchangeRequests,
      declinedExchangeRequests,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// View all users
exports.viewAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from the results
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    User.findByIdAndDelete(req.params.userId)
    .then((reply) => res.status(204).end())
    .catch(next);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
