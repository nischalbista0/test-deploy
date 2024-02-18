const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const ExchangeRequest = require("../models/ExchangeRequest");
const User = require("../models/User");
const Book = require("../models/Books");
const mongoose = require("mongoose");

let user1Token, user2Token;
let book1Id, book2Id;
let exchangeRequest1Id;

beforeAll(async () => {
  await User.deleteMany({});
  await Book.deleteMany({});
  await ExchangeRequest.deleteMany({});

  // Establish a connection to the database
  await mongoose.connect(process.env.TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  // Register two new users
  await api.post("/users/register").send({
    username: "user1",
    password: "user1pass",
    fullname: "User One",
    email: "user1@example.com",
  });

  await api.post("/users/register").send({
    username: "user2",
    password: "user2pass",
    fullname: "User Two",
    email: "user2@example.com",
  });

  // Login and get tokens for both users
  const login1Response = await api.post("/users/login").send({
    username: "user1",
    password: "user1pass",
  });
  user1Token = login1Response.body.token;

  const login2Response = await api.post("/users/login").send({
    username: "user2",
    password: "user2pass",
  });
  user2Token = login2Response.body.token;

  // Create a book for each user
  const book1Response = await api
    .post("/books")
    .set("authorization", `Bearer ${user1Token}`)
    .send({
      title: "Book One",
      author: "Author One",
      description: "Description for Book One",
      genre: "Genre One",
      language: "Language One",
      bookCover: "https://example.com/book-one.jpg",
    });

  const book2Response = await api
    .post("/books")
    .set("authorization", `Bearer ${user2Token}`)
    .send({
      title: "Book Two",
      author: "Author Two",
      description: "Description for Book Two",
      genre: "Genre Two",
      language: "Language Two",
      bookCover: "https://example.com/book-two.jpg",
    });

  // Save the book IDs for the exchange request
  book1Id = book1Response.body._id;
  book2Id = book2Response.body._id;
});

afterAll(async () => {
  // Close the mongoose connection and clear the database
  await mongoose.connection.close();
});

describe("Exchange Request API", () => {
  test("Should successfully create an exchange request", async () => {
    const exchangeRequestData = {
      proposalBook: book2Id,
      message: "I want to exchange my book with yours",
    };

    // User 1 creates the exchange request with their book
    const res1 = await api
      .post(`/exchange/${book1Id}/exchange-request`)
      .set("authorization", `Bearer ${user2Token}`)
      .send(exchangeRequestData)
      .expect(200);

    expect(res1.body.proposalBook).toBe(book2Id);

    // Save the request ID to the global space for use in other tests
    exchangeRequest1Id = res1.body._id;
  });

  test("Should successfully get all exchange requests", async () => {
    const res = await api
      .get("/exchange/")
      .set("Authorization", `Bearer ${user1Token}`)
      .expect(200);

    // Assuming you expect an array of exchange requests
    expect(res.body).toHaveLength(1);
  });

  test("User should successfully get requests requested by others to them", async () => {
    // User 2 gets all exchange requests
    const res = await api
      .get("/exchange/exchange-requests")
      .set("authorization", `Bearer ${user1Token}`)
      .expect(200);

    expect(res.body.data).toHaveLength(1);
  });

  // accept request
  test("User should successfully accept an exchange request", async () => {
    const res = await api
      .put(`/exchange/exchange-request/${exchangeRequest1Id}/accept`)
      .set("authorization", `Bearer ${user1Token}`)
      .expect(200);

    expect(res.body.status).toBe("accepted");
  });

  // decline request
  test("User should successfully decline an exchange request", async () => {
    const res = await api
      .delete(`/exchange/exchange-request/${exchangeRequest1Id}/decline`)
      .set("authorization", `Bearer ${user1Token}`)
      .expect(200);

    expect(res.body.message).toBe("Exchange request declined");
  });
});
