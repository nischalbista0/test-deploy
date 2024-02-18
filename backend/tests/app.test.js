const request = require("supertest");
const app = require("../app"); // Make sure the path is correct

describe("App", () => {
  test("GET unknown path - It should respond with 404 and error message", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Path Not Found");
  });

  test('Error handling - It should respond with 404 and "Path Not Found"', async () => {
    app.get("/error-test", (req, res, next) => {
      next(new Error("Something went wrong"));
    });

    const response = await request(app).get("/error-test");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Path Not Found");
  });

  // Add more tests for other routes and scenarios as needed
});
