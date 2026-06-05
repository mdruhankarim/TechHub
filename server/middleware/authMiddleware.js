import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized - No token provided");
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESSTOKEN);

    const user = await User.findById(decode.id).select(
      "-password -refresh_token -email_verify_token -email_verify_expiry"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    // if (!user.verify_email) {
    //   throw new ApiError(
    //     403,
    //     "Email not verified. Please verify your email first"
    //   );
    // }

    req.user = user;
    next();
  } catch (error) {

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired access token");
  }
});

export default authMiddleware;
