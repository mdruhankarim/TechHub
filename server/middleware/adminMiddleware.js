import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  let token = "";

  // 1. Check Authorization Header (Recommended)
  if (req.header("Authorization")?.startsWith("Bearer ")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }
  // 2. Fallback: Check Cookie
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized - No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESSTOKEN);

    const user = await User.findById(decoded.id).select(
      "-password -refresh_token -email_verify_token -email_verify_expiry",
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (user.role !== "Admin") {
      throw new ApiError(403, "Access denied. Admin privileges required");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired. Please login again");
    }
    throw new ApiError(401, "Invalid or expired access token");
  }
});

export default adminAuthMiddleware;
