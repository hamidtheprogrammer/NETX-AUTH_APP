import { Request, Response } from "express";
import hashPasssword from "../utils/hashPassword";
import { checkUser, createUser } from "../services/authService";

const userExists = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  try {
    const doesUserExist = await checkUser(email);

    if (doesUserExist) {
      res.status(200).json(doesUserExist);
    } else {
      const newUser = await createUser(email, name);

      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const register: any = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    const doesUserExists = await checkUser(email);
    if (doesUserExists) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const hashed = await hashPasssword(password);

    const newUser = await createUser(email, name, hashed as string);
    console.log(newUser);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const signin: any = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const doesUserExists = await checkUser(email);

    if (!checkUser) return false;
  } catch (error) {}
};

export { userExists, signin, register };
