import { Router } from "express";
import {
  forgotPasswordController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
  resetPasswordController,
  updateAvatarController,
  updateUserDetailsController,
  userDetailsController,
  verifyEmailController,
  verifyForgotPasswordOtpController,
} from "../controllers/user.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";
import { otpRateLimiter } from "../middleware/otpRateLimiter.js";
import {
  addToCartController,
  removeFromCartController,
} from "../controllers/cart.controller.js";

const userRouter = Router();

/**
 * AUTH ROUTES
 */
userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", otpRateLimiter, verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.post("/refresh-token", refreshTokenController);
userRouter.post("/logout", authMiddleware, logoutUserController);

/**
 * PASSWORD FLOW
 */
userRouter.post("/forgot-password", otpRateLimiter, forgotPasswordController);
userRouter.post(
  "/verify-forgot-password-otp",
  otpRateLimiter,
  verifyForgotPasswordOtpController,
);
userRouter.post("/reset-password", otpRateLimiter, resetPasswordController);

/**
 * PROFILE
 */
userRouter.get("/me", authMiddleware, userDetailsController);
userRouter.put("/update-details", authMiddleware, updateUserDetailsController);
userRouter.put(
  "/update-avatar",
  authMiddleware,
  upload.single("avatar"),
  updateAvatarController,
);

/**
 * CART
 */
userRouter.post("/cart/add", authMiddleware, addToCartController);
userRouter.post("/cart/remove", authMiddleware, removeFromCartController);

export default userRouter;
