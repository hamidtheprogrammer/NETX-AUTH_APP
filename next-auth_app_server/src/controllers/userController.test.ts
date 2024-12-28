import supertest from "supertest";
import "@testing-library/jest-dom";
import "@testing-library/react";
import { app } from "..";
import hashPasssword, { verifyHash } from "../utils/hashPassword";
import bcrypt from "bcryptjs";
import * as authService from "../services/authService";
import { db } from "../database/dbConfig";
import { register, userExists } from "./userControllers";

jest.mock("bcryptjs");
jest.mock("../database/dbConfig", () => ({
  db: { users: { findFirst: jest.fn(), create: jest.fn() } },
}));

//Unit tests

describe("Hash password", () => {
  it("should return hashed password", async () => {
    const plain = "plain-text";

    const hashedPassword = "hashedPassword";

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    const result = await hashPasssword(plain);

    expect(result).toBe(hashedPassword);
    expect(bcrypt.hash).toHaveBeenCalledWith(plain, 5);
  });
});

describe("Verifying hash", () => {
  it("Should return true if passwords match", async () => {
    const plainText = "plain-password";
    const hashedPassword = "hashed-password";

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const passwordMatch = await verifyHash(plainText, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(plainText, hashedPassword);
    expect(passwordMatch).toBe(true);
  });
});

describe("userExists", () => {
  it("Should return user if they exist", async () => {
    const user = { id: 1, name: "Test", email: "test@gmail.com" };

    jest.spyOn(authService, "checkUser").mockResolvedValueOnce(user);

    const req = { body: user };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userExists(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("Should create new user if user does not exist", async () => {
    const user = { id: 1, name: "Test", email: "test@gmail.com" };

    jest.spyOn(authService, "checkUser").mockResolvedValueOnce(null);

    jest.spyOn(authService, "createUser").mockResolvedValueOnce(user);

    const req = { body: user };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await userExists(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(user);
  });
});

describe("register", () => {
  it("should return 400 if email already exists", async () => {
    const existingUser = { id: 1, name: "Test", email: "test@gmail.com" };

    jest.spyOn(authService, "checkUser").mockResolvedValueOnce(existingUser);

    const req = { body: existingUser };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email" });
  });

  it("should register new user", async () => {
    const user = {
      id: 1,
      name: "Test",
      email: "test@gmail.com",
      password: "Test123",
    };

    jest.spyOn(authService, "checkUser").mockResolvedValueOnce(null);
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hashedPassword");
    jest.spyOn(authService, "createUser").mockResolvedValueOnce({
      id: 1,
      name: "Test",
      email: "test@gmail.com",
    });

    const req = { body: user };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      name: "Test",
      email: "test@gmail.com",
    });
  });
});

describe("Sign in", () => {
  beforeAll(() => {
    jest.mock("bcryptjs");
    jest.mock("../database/dbConfig", () => ({
      db: { users: { findFirst: jest.fn(), create: jest.fn() } },
    }));
  });
  it("Should return 404 if email not found", () => {});

  it("Should return 404 if password dont match", () => {});

  it("Should return 200 if credentials are valid", () => {});
});

//Integrated tests

describe("Check user", () => {
  it("should return a userId, name, and email", async () => {
    const payload = "test@gmail.com";

    const expectedResult = {
      id: 1,
      name: "Test",
      email: "test@gmail.com",
      password: "Test1234",
    };

    jest.spyOn(db.users, "findFirst").mockResolvedValueOnce(expectedResult);

    const result = await authService.checkUser(payload);

    expect(result).toEqual(expectedResult);
  });
});

describe("Create user", () => {
  it("should create a new user with password", async () => {
    const expectedResult = {
      id: 1,
      name: "Test",
      email: "test@gmail.com",
      password: "Test1234",
    };

    jest.spyOn(db.users, "create").mockResolvedValueOnce(expectedResult);

    const result = await authService.createUser(
      "Test",
      "test@gmail.com",
      "Test1234"
    );

    expect(result).toEqual(expectedResult);
  });

  it("should create a new user without password", async () => {
    const expectedResult = {
      id: 1,
      name: "Test",
      email: "test@gmail.com",
      password: "Test1234",
    };

    jest.spyOn(db.users, "create").mockResolvedValueOnce(expectedResult);

    const result = await authService.createUser("Test", "test@gmail.com");

    expect(result).toEqual(expectedResult);
  });
});

// Route tests

function generateRandomUser() {
  const randomId = Math.round(Math.random() * 100000);

  return {
    name: "Test" + randomId,
    email: "test" + randomId + "@gmail.com",
    password: "Test" + randomId + "###",
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

describe.only("POST /api/user-exists", () => {
  jest.mock("../database/dbConfig", () => ({
    db: { users: { findFirst: jest.fn(), create: jest.fn() } },
  }));

  it("should return status 400 if credentials are not valid", async () => {
    const response = await supertest(app)
      .post("/api/user-exists")
      .send({ name: "Test", email: "invalid_email" });

    expect(response.status).toBe(400);
  });

  it("should return true for existing user", async () => {
    jest.spyOn(db.users, "findFirst").mockResolvedValueOnce({
      id: 123,
      name: "Test",
      email: "test@gmail.com",
      password: "Test123",
    });
    const response = await supertest(app)
      .post("/api/user-exists")
      .send({ name: "Test", email: "test@gmail.com" });

    jest.spyOn(db.users, "findFirst").mockResolvedValueOnce({
      id: 123,
      name: "Test",
      email: "test@gmail.com",
      password: "Test123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
  });

  it("should create a new user if user does not exist", async () => {
    const user = generateRandomUser();
    jest.spyOn(db.users, "findFirst").mockResolvedValueOnce(null);
    jest.spyOn(db.users, "create").mockResolvedValueOnce({ ...user, id: 123 });

    const response = await supertest(app).post("/api/user-exists").send(user);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
  });
});

describe("POST /api/register", () => {
  it("Should return a 400 with invalid credentials", async () => {
    jest.spyOn(db.users, "findFirst").mockResolvedValueOnce(null);
    jest
      .spyOn(db.users, "create")
      .mockResolvedValueOnce({
        id: 123,
        name: "Test",
        email: "test@gmacom",
        password: "Test",
      });
    const response = await supertest(app).post("/api/register").send({
      name: "Test",
      email: "test@gmacom",
      password: "Test",
    });

    expect(response.status).toBe(400);
  });

  it("should create a new user if credentials are valid", async () => {
    const user = generateRandomUser();

    const response = await supertest(app).post("/api/register").send(user);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
  });
});
