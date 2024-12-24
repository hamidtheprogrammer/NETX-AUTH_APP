import { Request, Response } from "express";
import bycrypt from "bcryptjs";
import { db } from "../database/dbConfig";

const userExists = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  try {
    const doesUserExist = await db.users.findFirst({ where: { email } });

    if (doesUserExist) {
      res.status(201).json(doesUserExist);
    } else {
      const newUser = await db.users.create({
        data: { email, name },
      });

      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { userExists };
