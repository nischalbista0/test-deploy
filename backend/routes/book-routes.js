const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book-controller");
const { verifyUser } = require("../middlewares/auth");
const upload = require("../middlewares/uploads");

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(verifyUser, bookController.createBook)
  .put((req, res) => res.status(405).json({ error: "Method not allowed" }))
  .delete((req, res) => res.status(405).json({ error: "Method not allowed" }));

router.post(
  "/uploadBookCover",
  verifyUser,
  upload,
  bookController.uploadBookCover
);

// Get books uploaded by others
router.get("/others", verifyUser, bookController.getBooksUploadedByOthers);

// Get books uploaded by current user
router.get(
  "/my-books",
  verifyUser,
  bookController.getBooksUploadedByCurrentUser
);

// Get all bookmarked books
router.get("/bookmarked-books", bookController.getAllBookmarkedBooks);

// Search books
router.get("/search", bookController.searchBooks);

router
  .route("/:book_id")
  .get(bookController.getBookById)
  .post((req, res) => {
    res.status(405).json({ error: "POST request is not allowed" });
  })
  .put(bookController.updateBookById)
  .delete(bookController.deleteBookById);

// Bookmark a book
router.post("/bookmark/:book_id", verifyUser, bookController.bookmarkBook);

// Remove bookmark from a book
router.delete("/bookmark/:book_id", verifyUser, bookController.removeBookmark);

module.exports = router;
