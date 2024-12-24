import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

const authValidationRules = () => {
  return [
    body("name").isLength({ min: 2 }).withMessage("Invalid name"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password too short"),
  ];
};

const validate: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export { validate, authValidationRules };
