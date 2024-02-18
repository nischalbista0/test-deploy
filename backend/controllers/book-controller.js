const upload = require("../middlewares/uploads");
const Book = require("../models/Books");
const User = require("../models/User");

const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({
      data: books,
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const getBooksUploadedByOthers = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;

    const books = await Book.find().sort({ createdAt: -1 });

    const userInfo = await User.findById(loggedInUserId);

    const currentTime = new Date();
    const otherBooks = books.map((book) => {
      const createdAt = new Date(book.createdAt);
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

      const isBookmarked = userInfo.bookmarkedBooks.includes(
        book.id.toString()
      );

      return {
        ...book.toObject(),
        formattedCreatedAt: formattedTime,
        isBookmarked: isBookmarked,
      };
    });

    // Filter out the books uploaded by the logged-in user
    const otherBooksUploadedBy = otherBooks.filter((book) => {
      return book.user && book.user.id !== loggedInUserId;
    });

    res.json({
      data: otherBooksUploadedBy,
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const getAllBookmarkedBooks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by userId and populate the bookmarkedBooks field
    const user = await User.findById(userId).populate("bookmarkedBooks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookmarkedBooks = user.bookmarkedBooks.map((book) => {
      const createdAt = new Date(book.createdAt);
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
        ...book.toObject(),
        formattedCreatedAt: formattedTime,
        isBookmarked: true, // Since it's a bookmarked book, set isBookmarked to true
      };
    });

    res.status(200).json({ data: bookmarkedBooks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get books uploaded by current user
const getBooksUploadedByCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const books = await Book.find({ "user.id": userId }).sort({
      createdAt: -1,
    });

    res.json({
      data: books,
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

let uploadedFilename; // Shared variable to store the uploaded filename

/* istanbul ignore next */
const uploadBookCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    // Save the book cover image and get the filename
    const filename = req.file.filename;

    uploadedFilename = filename; // Store the filename in the shared variable

    res.status(200).json({ success: true, data: filename });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const createBook = async (req, res, next) => {
  const { title, author, description, genre, language } = req.body;
  const user = req.user;

  // Use the uploadedFilename from the shared variable
  const bookCover = uploadedFilename || "";

  try {
    if (!title || !author || !description || !genre || !language) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const bookData = {
      title,
      author,
      description,
      genre,
      language,
      bookCover,
      user: user,
    };

    const book = await Book.create(bookData);
    res.status(201).json(book);
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  } finally {
    uploadedFilename = undefined; // Reset the shared variable after use
  }
};

const getBookById = (req, res, next) => {
  Book.findById(req.params.book_id)
    .then((book) => {
      if (!book) {
        res.status(404).json({ error: "book not found" });
      }
      res.json({
        data: [book],
      });
    })
    .catch(next);
};

const updateBookById = (req, res, next) => {
  Book.findByIdAndUpdate(req.params.book_id, { $set: req.body }, { new: true })
    .then((updated) => res.json(updated))
    .catch(next);
};

const deleteBookById = (req, res, next) => {
  Book.findByIdAndDelete(req.params.book_id)
    .then((reply) => res.status(204).end())
    .catch(next);
};

const searchBooks = (req, res, next) => {
  const { query } = req.query;

  Book.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { author: { $regex: query, $options: "i" } },
    ],
  })
    .then((books) => {
      if (books.length === 0) {
        // No books found
        res.json({ message: "No books found" });
      } else {
        // Matching books found
        res.json({
          data: books,
        });
      }
    })
    .catch((error) => {
      /* istanbul ignore next */
      next(error);
    });
};

const bookmarkBook = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.book_id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.bookmarkedBooks.includes(bookId)) {
      return res.status(400).json({ error: "Book is already bookmarked" });
    }

    user.bookmarkedBooks.push(bookId);
    await user.save();

    res.status(201).json({ message: "Book bookmarked successfully" });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.book_id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.bookmarkedBooks.includes(bookId)) {
      return res.status(400).json({ error: "Book is not bookmarked" });
    }

    user.bookmarkedBooks = user.bookmarkedBooks.filter(
      (bookmark) => bookmark.toString() !== bookId
    );
    await user.save();

    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBooksUploadedByOthers,
  getAllBookmarkedBooks,
  getBooksUploadedByCurrentUser,
  uploadBookCover,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
  searchBooks,
  bookmarkBook,
  removeBookmark,
};
