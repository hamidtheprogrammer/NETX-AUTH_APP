import supertest from "supertest";
import "@testing-library/jest-dom";
import "@testing-library/react";
import { app } from "..";

describe("POST /api/user-exits", () => {
  it("should return status 400 if credentials are not valid", async () => {
    const response = await supertest(app)
      .post("/api/user-exists")
      .send({ name: "Test", email: "test@gmacom", password: "Test1234" });

    expect(response.status).toBe(400);
  });

  it("should return true for existing user", async () => {
    const response = await supertest(app)
      .post("/api/user-exists")
      .send({ name: "Test", email: "test@gmail.com", password: "Test1234" });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
  });

  it("should create a new user if user does not exist", async () => {
    const response = await supertest(app)
      .post("/api/user-exists")
      .send({ name: "Test", email: "test@gmail.com", password: "Test1234" });

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
  });
});
