import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes";
import { db } from "./database/dbConfig";

dotenv.config();

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", userRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("SERVER UP!!!");
});

async function test() {
  try {
    const result = await db.users.findFirst({
      where: { email: "test@gmail.com" },
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

test();
