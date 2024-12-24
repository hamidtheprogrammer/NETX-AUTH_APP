import { Router } from "express";
import { userExists } from "../controllers/userControllers";
import { authValidationRules, validate } from "../middlewares/inputValidation";

const userRouter = Router();

userRouter
  .route("/user-exists")
  .post(authValidationRules(), validate, userExists);
userRouter.route("/sign-in").post();

export default userRouter;
