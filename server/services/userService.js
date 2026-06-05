import userRepository from "../repositories/userRepository.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

const userService = {
  // register
  register: async ({ name, email, password }) => {
    // find user
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // hash password
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");

    // create new user
    const newUser = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      email_verify_token: emailVerifyToken,
      email_verify_expiry: Date.now() + 3600000,
    });

    // send email
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerifyToken}`;
    sendEmail({
      sendTo: email,
      subject: "Verify your email - GroStore",
      html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
    });

    return newUser;
  },

  // login
  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email, "+password");
    if (!user) throw new Error("INVALID_CREDENTIALS");

    if (user.status !== "Active") throw new Error("ACCOUNT_INACTIVE");

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) throw new Error("INVALID_CREDENTIALS");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    userRepository
      .updateById(user._id, { last_login_date: new Date() })
      .catch((err) =>
        console.error("Failed to update login date timestamp:", err),
      );
    return {
      user: { name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  },
};

export default userService;
