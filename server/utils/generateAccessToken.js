import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    role: user.role || "User",
  };
  return jwt.sign(payload, process.env.SECRET_KEY_ACCESSTOKEN, {
    expiresIn: "5h",
  });
};

export default generateAccessToken;
