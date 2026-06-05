import userRepository from "../repositories/userRepository.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";

const userService = {
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
    await sendEmail({
      sendTo: email,
      subject: "Verify your email - GroStore",
      html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
    });

    return newUser;
  },
};

export default userService;
