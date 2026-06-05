import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

import userRouter from "./routes/user.routes.js";
import { globalRateLimiter } from "./middleware/globalRateLimiter.js";
import AdminRouter from "./routes/admin.routes.js";
import productRouter from "./routes/product.route.js";
import chatRouter from "./routes/chat.routes.js";

app.use("/api/v1", globalRateLimiter);
app.use("/api/v1/products", productRouter); // ← Public products route
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/admin", AdminRouter);

export { app };
