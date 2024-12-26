import { Router } from "express";
import { register, signin, userExists } from "../controllers/userControllers";
import { authTypes } from "../middlewares/inputValidation";
import { authValidationRules, validate } from "../middlewares/inputValidation";

const userRouter = Router();

userRouter
  .route("/user-exists")
  .post(authValidationRules(authTypes.CHECK_USER), validate, userExists);
userRouter
  .route("/register")
  .post(authValidationRules(authTypes.SIGN_IN), validate, register);
userRouter
  .route("/sign-in")
  .post(authValidationRules(authTypes.SIGN_IN), validate, signin);

export default userRouter;
