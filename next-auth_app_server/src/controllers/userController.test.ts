import supertest from "supertest";
import "@testing-library/jest-dom";
import "@testing-library/react";
import { app } from "..";
import { nanoid } from "nanoid";

function generateRandomUser() {
  const randomId = Math.round(Math.random() * 100000);

  return {
    name: "Test" + randomId,
    email: "test" + randomId + "@gmail.com",
  };
}

describe("generate random user", () => {
  it("should return a random user with prefix test", () => {
    const user = generateRandomUser();

    expect(user.name.substring(0, 4).toLowerCase()).toBe("test");
    expect(
      user.name.substring(5, user.name.length).toLowerCase()
    ).toBeDefined();
  });
});

describe("POST /api/user-exits", () => {
  it("should return status 400 if credentials are not valid", async () => {
    const response = await supertest(app)
      .post("/api/user-exists")
      .send({ name: "Test", email: "test@gmacom" });

    expect(response.status).toBe(400);
  });

  it("should return true for existing user", async () => {
    const response = await supertest(app)
      .post("/api/user-exists")
      .send({ name: "Test", email: "test@gmail.com" });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
  });

  it("should create a new user if user does not exist", async () => {
    const user = generateRandomUser();
    const response = await supertest(app).post("/api/user-exists").send(user);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
  });
});
