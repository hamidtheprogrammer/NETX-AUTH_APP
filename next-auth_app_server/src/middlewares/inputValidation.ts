import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export enum authTypes {
  SIGN_IN = "sign-in",
  CHECK_USER = "check_user",
}

const authValidationRules = (authType: authTypes) => {
  if (authType === authTypes.SIGN_IN) {
    return [
      body("name").isLength({ min: 2 }).withMessage("Invalid name"),
      body("email").isEmail().withMessage("Invalid email"),
      body("password").isLength({ min: 8 }).withMessage("Password too short"),
    ];
  }
  return [
    body("name").isLength({ min: 2 }).withMessage("Invalid name"),
    body("email").isEmail().withMessage("Invalid email"),
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
