const ExchangeRequest = require("../models/ExchangeRequest");
const Book = require("../models/Books");
const User = require("../models/User");

const getUserExchangeRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find exchange requests where the requestedUser matches the currently logged-in user
    const exchangeRequests = await ExchangeRequest.find({
      requestedUser: userId,
    })
      .sort({ createdAt: -1 })
      .populate("requestedBook")
      .populate("proposalBook"); // Include only the _id field of proposalBook

    // Extract only the proposalBook id from the populated result and fetch the book data
    const exchangeRequestsData = await Promise.all(
      exchangeRequests.map(async (request) => {
        const proposalBookData = await Book.findById(request.proposalBook._id);

        const user = await User.findById(proposalBookData.user.id);

        const createdAt = new Date(request.createdAt);
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - createdAt);

        let formattedTime;

        /* istanbul ignore next */
        if (timeDifference < 60000) {
          formattedTime = Math.floor(timeDifference / 1000) + " seconds ago";
        } else if (timeDifference < 3600000) {
          formattedTime = Math.floor(timeDifference / 60000) + " minutes ago";
        } else if (timeDifference < 86400000) {
          formattedTime = Math.floor(timeDifference / 3600000) + " hours ago";
        } else {
          formattedTime = Math.floor(timeDifference / 86400000) + " days ago";
        }

        return {
          _id: request._id,
          requester: user.toObject(), // Spread properties of the user object
          requestedBook: request.requestedBook.toObject(),
          proposalBookTitle: proposalBookData.title,
          proposalBookAuthor: proposalBookData.user.username,
          proposalBookCover: proposalBookData.bookCover,
          proposalBook: request.proposalBook._id,
          status: request.status,
          message: request.message,
          formattedCreatedAt: formattedTime,
        };
      })
    );

    res.json({
      data: exchangeRequestsData,
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

// Get all exchange requests
const getAllExchangeRequests = async (req, res, next) => {
  try {
    const exchangeRequests = await ExchangeRequest.find()
      .populate("requester")
      .populate("requestedBook")
      .populate("proposalBook");

    res.json(exchangeRequests);
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

// Get accepted exchange requests of current user

const createExchangeRequest = async (req, res, next) => {
  try {
    const { book_id } = req.params;
    const { proposalBook, message } = req.body;
    const requester = req.user.id;

    // Retrieve the user and book records based on the IDs
    const user = await User.findById(requester);
    const requestedBook = await Book.findById(book_id);
    const proposalBookk = await Book.findById(proposalBook);

    if (!user) {
      return res.status(404).json({ error: "Requester user not found" });
    }

    if (!requestedBook) {
      return res.status(404).json({ error: "Requested book not found" });
    }

    if (!proposalBook) {
      return res.status(404).json({ error: "Proposal book not found" });
    }

    // Create the exchange request
    const exchangeRequest = new ExchangeRequest({
      requester: user.toObject(),
      requestedBook: requestedBook.toObject(),
      proposalBook: proposalBookk.toObject(),
      requestedUser: requestedBook.user.id,
      statusUpdatedAt: Date.now(),
      message: message || "", // Use the provided message or an empty string if not provided
    });

    // Save the exchange request to the database
    const savedExchangeRequest = await exchangeRequest.save();

    res.json(savedExchangeRequest);
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

// Accept an exchange request
const acceptExchangeRequest = async (req, res, next) => {
  try {
    const requestId = req.params.request_id;

    const exchangeRequest = await ExchangeRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted", statusUpdatedAt: Date.now() },
      { new: true }
    );

    if (!exchangeRequest) {
      return res.status(404).json({ error: "Exchange request not found" });
    }

    res.json(exchangeRequest);
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

// Decline an exchange request
const declineExchangeRequest = async (req, res, next) => {
  try {
    const requestId = req.params.request_id;

    // delete
    const exchangeRequest = await ExchangeRequest.findByIdAndDelete(requestId);

    if (!exchangeRequest) {
      return res.status(404).json({ error: "Exchange request not found" });
    }

    res.json({ message: "Exchange request declined" });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

/* istanbul ignore next */
const getAcceptedExchangeRequests = async (req, res, next) => {
  const axios = require("axios");

  try {
    const userId = req.user.id;

    // Find all accepted exchange requests
    const allAcceptedExchangeRequests = await ExchangeRequest.find({
      status: "accepted",
    })
      .sort({ createdAt: -1 })
      .populate("requestedBook")
      .populate("proposalBook");

    // Fetch the proposal book author data for all requests
    const proposalBookUsers = await Promise.all(
      allAcceptedExchangeRequests.map(async (request) => {
        const proposalBookData = request.proposalBook.toObject();

        // get proposal book author data using async/await
        const response = await axios.get(
          `http://localhost:3001/users/${proposalBookData.user.id}`
        );
        return response.data;
      })
    );

    // Map the exchangeRequestsData and include the proposalBookUser for each request
    const exchangeRequestsData = allAcceptedExchangeRequests
      .filter((request) => request.requester._id.toString() === userId)
      .map((request, index) => {
        const proposalBookData = request.proposalBook.toObject();

        const createdAt = new Date(request.createdAt);
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - createdAt);

        let formattedTime;
        if (timeDifference < 60000) {
          formattedTime = Math.floor(timeDifference / 1000) + " seconds ago";
        } else if (timeDifference < 3600000) {
          formattedTime = Math.floor(timeDifference / 60000) + " minutes ago";
        } else if (timeDifference < 86400000) {
          formattedTime = Math.floor(timeDifference / 3600000) + " hours ago";
        } else {
          formattedTime = Math.floor(timeDifference / 86400000) + " days ago";
        }

        return {
          _id: request._id,
          requester: request.requester,
          requestedBook: request.requestedBook.toObject(),
          proposalBook: request.proposalBook,
          proposalBookAuthor: proposalBookUsers[index],
          status: request.status,
          message: request.message,
          formattedCreatedAt: formattedTime,
        };
      });

    res.json({
      data: exchangeRequestsData,
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

module.exports = {
  getAllExchangeRequests,
  getUserExchangeRequests,
  createExchangeRequest,
  acceptExchangeRequest,
  declineExchangeRequest,
  getAcceptedExchangeRequests,
};
