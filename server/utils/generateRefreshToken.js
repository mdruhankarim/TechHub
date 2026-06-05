import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateRefreshToken = async (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_REFRESHTOKEN,
      {
        expiresIn: "7d",
      },
    );

    await User.findByIdAndUpdate(
      userId,
      { refresh_token: token },
      {
        returnDocument: "after",
      },
    );

    return token;
  } catch (error) {
    console.error("Error generating refresh token:", error.message);
    throw new Error("Failed to generate refresh token");
  }
};

export default generateRefreshToken;
