import sendEmail from "../config/sendEmail.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import crypto from "crypto";
import dotenv from "dotenv";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import generateOTP from "../utils/generateOTP.js";
import verifyOtpTemplate from "../utils/verifyOtpTemplate.js";
import jwt from "jsonwebtoken";

dotenv.config();

// register user
export const registerUserController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Required fields check
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  // 2. Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered. Please login.");
  }

  // 3. Hash password
  const salt = await bcryptjs.genSalt(12);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // 4. Generate verification token
  const emailVerifyToken = crypto.randomBytes(32).toString("hex");

  // 5. Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    email_verify_token: emailVerifyToken,
    email_verify_expiry: Date.now() + 3600000, // 1 hour
  });

  await newUser.save();

  // 6. Generate verification URL
  const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerifyToken}`;

  // 7. Send verification email
  await sendEmail({
    sendTo: email,
    subject: "Verify your email - GroStore",
    html: verifyEmailTemplate({
      name,
      url: verifyEmailUrl,
    }),
  });

  // 8. Success response using ApiResponse
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        null,
        "User registered successfully. Please check your email to verify.",
      ),
    );
});

// verify user email
export const verifyEmailController = asyncHandler(async (req, res) => {
  const token = req.query.token || req.body.token;

  if (!token) {
    throw new ApiError(400, "Verification token is missing");
  }

  const user = await User.findOne({
    email_verify_token: token,
    email_verify_expiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification link");
  }

  // Verify and clean up
  user.verify_email = true;
  user.email_verify_token = null;
  user.email_verify_expiry = null;
  await user.save();

  // Success response using ApiResponse
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Email verified successfully! You can now login.",
      ),
    );
});

// login a user
export const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  if (user.status !== "Active") {
    throw new ApiError(403, "Your account is not active. Contact admin.");
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or password");
  }

  // Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user._id);

  // Update last login date (Fixed - No warning)
  await User.findByIdAndUpdate(user._id, {
    last_login_date: new Date(),
  });

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    path: "/",
  };

  // Set cookies
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 5 * 60 * 60 * 1000, // 5 hours
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          name: user.name,
          email: user.email,
        },
        accessToken,
      },
      "Login successful"
    )
  );
});

// get user details
export const userDetailsController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  console.log(userId);

  if (!userId) {
    throw new ApiError(400, "Unauthorized Access");
  }
  const user = await User.findById(userId).select("-password -refresh_token");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "User details fetched successfully",
    ),
  );
});

// logout user
export const logoutUserController = asyncHandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    path: "/",
  };

  const refreshToken = req.cookies?.refreshToken;

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  if (refreshToken) {
    await User.updateOne(
      { refresh_token: refreshToken },
      { refresh_token: null },
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

// update avatar
export const updateAvatarController = asyncHandler(async (req, res) => {
  // Check if file exists (Multer puts it in req.file)
  if (!req.file) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Get current user from authMiddleware
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized - Please login first");
  }

  // Upload to Cloudinary
  const cloudinaryResult = await uploadOnCloudinary(
    req.file.buffer,
    req.file.originalname || "avatar.jpg", // fallback filename
  );

  if (!cloudinaryResult || !cloudinaryResult.secure_url) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  const newAvatarUrl = cloudinaryResult.secure_url;

  // Delete old avatar if exists
  if (user.avatar && user.avatar !== "") {
    await deleteFromCloudinary(user.avatar);
  }

  // Update user
  user.avatar = newAvatarUrl;
  await user.save({ validateBeforeSave: false });

  // Success
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: newAvatarUrl },
        "Avatar updated successfully",
      ),
    );
});

// update user details
export const updateUserDetailsController = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized - Please login first");
  }

  const { name, mobile } = req.body;

  if (!name && !mobile) {
    throw new ApiError(400, "At least one field is required to update");
  }

  // Optional validation
  if (name && name.trim().length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters long");
  }

  if (mobile && !/^[0-9]{10,15}$/.test(mobile)) {
    throw new ApiError(400, "Invalid mobile number");
  }

  if (name) user.name = name.trim();
  if (mobile) user.mobile = mobile;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        name: user.name,
        mobile: user.mobile,
      },
      "User details updated successfully",
    ),
  );
});

// forgot password
export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not available");
  }
  // console.log(user);

  const otp = generateOTP();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  user.forgot_password_otp = hashedOtp;
  user.forgot_password_expiry = Date.now() + 60 * 60 * 1000; // 1 hour

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    sendTo: user?.email,
    subject: "Your Password Reset OTP - GroStore",
    html: verifyOtpTemplate({
      name: user?.name,
      otp,
    }),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent to your email"));
});

// verify forgot password otp
export const verifyForgotPasswordOtpController = asyncHandler(
  async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ApiError(400, "Email and otp are required");
    }
    const user = await User.findOne({ email }).select(
      "+forgot_password_otp +forgot_password_expiry",
    );
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    if (
      !user.forgot_password_expiry ||
      user.forgot_password_expiry < Date.now()
    ) {
      throw new ApiError(400, "OTP expired. Please request a new one.");
    }
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    if (hashedOtp !== user.forgot_password_otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    const updateUser = await User.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: "",
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "OTP verified successfully. You can now reset your password.",
        ),
      );
  },
);

// reset forgot pass
export const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    throw new ApiError(
      400,
      "Email, OTP, new password and confirm password are required",
    );
  }

  // confirm password check
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }

  // optional strong password check
  if (newPassword.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  const user = await User.findOne({ email }).select(
    "+forgot_password_otp +forgot_password_expiry +password",
  );

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (
    !user.forgot_password_expiry ||
    user.forgot_password_expiry < Date.now()
  ) {
    throw new ApiError(400, "OTP expired");
  }

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  if (hashedOtp !== user.forgot_password_otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // hash new password
  const salt = await bcryptjs.genSalt(12);
  user.password = await bcryptjs.hash(newPassword, salt);

  // cleanup OTP (one-time use)
  user.forgot_password_otp = null;
  user.forgot_password_expiry = null;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

// refresh token
export const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken =
    req?.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  let decode;
  try {
    decode = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESHTOKEN);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // IMPORTANT: Fetch user WITH refresh_token field
  const user = await User.findById(decode?.id).select("+refresh_token");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (user.refresh_token !== refreshToken) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  if (!user.verify_email) {
    throw new ApiError(403, "Email not verified");
  }

  const newAccessToken = generateAccessToken(user);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    path: "/",
  };

  res.cookie("accessToken", newAccessToken, {
    ...cookieOptions,
    maxAge: 5 * 60 * 60 * 1000, // 5 hours
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken },
        "Access token refreshed successfully",
      ),
    );
});
