import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      default: null,
    },
    refresh_token: {
      type: String,
      default: null,
      select: false,
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    email_verify_token: {
      type: String,
      default: null,
      select: false,
    },
    email_verify_expiry: {
      type: Date,
      default: null,
      select: false,
    },
    forgot_password_otp: {
      type: String,
      default: null,
      select: false,
    },
    forgot_password_expiry: {
      type: Date,
      default: null,
      select: false,
    },
    last_login_date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ role: 1, status: 1 });
userSchema.index({ last_login_date: -1 });
userSchema.index({ verify_email: 1, status: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
