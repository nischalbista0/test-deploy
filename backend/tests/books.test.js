const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Books = require("../models/Books");
const mongoose = require("mongoose");
const User = require("../models/User");

let token = "";

beforeAll(async () => {
  await Books.deleteMany();
  await User.deleteMany({});
  await Books.create({
    title: "Book 1",
    author: "Nischal Bista",
    description: "This is a test book",
    genre: "Fantasy",
    language: "English",
    bookCover: "https://picsum.photos/200",
  });

  await api.post("/users/register").send({
    username: "testUser",
    password: "test123",
    fullname: "Test User",
    email: "test2@gmail.com",
  });

  const res = await api.post("/users/login").send({
    username: "testUser",
    password: "test123",
  });

  token = res.body.token;
});

test("Logged in user can get list of Books", async () => {
  await api
    .get("/books")
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("Book 1");
    });
});

test("Logged in user can get a single Book", async () => {
  const books = await Books.find({});
  const book = books[0];
  await api
    .get(`/books/${book._id}`)
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.data[0].title).toBe("Book 1");
    });
});

test("Logged in user can create a new Book", async () => {
  await api
    .post("/books")
    .set("authorization", `Bearer ${token}`)
    .send({
      title: "Book 2",
      author: "Nischal Bista",
      description: "This is a test book",
      genre: "Fantasy",
      language: "English",
      bookCover: "https://picsum.photos/200",
    })
    .expect(201)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.title).toBe("Book 2");
    });
});

test("Logged in user can update a Book", async () => {
  const books = await Books.find({});
  const book = books[0];
  await api
    .put(`/books/${book._id}`)
    .set("authorization", `Bearer ${token}`)
    .send({
      title: "Updated Book Title",
    })
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.title).toBe("Updated Book Title");
    });
});

test("Logged in user can delete a Book", async () => {
  const books = await Books.find({});
  const book = books[0];
  await api
    .delete(`/books/${book._id}`)
    .set("authorization", `Bearer ${token}`)
    .expect(204);
});

test("Logged in user can bookmark a Book", async () => {
  const books = await Books.find({});
  const book = books[0];
  await api
    .post(`/books/bookmark/${book._id}`)
    .set("authorization", `Bearer ${token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.message).toMatch(/bookmarked successfully/);
    });
});

test("Logged in user can get list of Bookmarks", async () => {
  await api
    .get("/books/bookmarked-books")
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.data).toHaveLength(1);
    });
});

test("Logged in user can remove bookmark a Book", async () => {
  const books = await Books.find({});
  const book = books[0];
  await api
    .delete(`/books/bookmark/${book._id}`)
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.message).toMatch(/removed successfully/);
    });
});

test("Logged in can search for a Book", async () => {
  await api
    .get("/books/search?query=Book 2")
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.data[0].title).toBe("Book 2");
    });
});

test("Logged in user can get books uploaded by others", async () => {
  await api
    .get("/books/others")
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.data).toHaveLength(0);
    });
});

test("Logged in user can get books uploaded by current user", async () => {
  await api
    .get("/books/my-books")
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.data).toHaveLength(1);
      // Add more assertions as needed
    });
});

test("Logged in user can update a Book's information", async () => {
  const books = await Books.find({});
  const book = books[0];
  await api
    .put(`/books/${book._id}`)
    .set("authorization", `Bearer ${token}`)
    .send({
      title: "Updated Book Title",
      description: "Updated description",
    })
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.title).toBe("Updated Book Title");
      expect(res.body.description).toBe("Updated description");
      // Add more assertions as needed
    });
});

test("Logged in user can delete a Book", async () => {
  const books = await Books.find({});
  const book = books[0];
  await api
    .delete(`/books/${book._id}`)
    .set("authorization", `Bearer ${token}`)
    .expect(204);
});

afterAll(async () => await mongoose.connection.close());

jest.setTimeout(10000);
