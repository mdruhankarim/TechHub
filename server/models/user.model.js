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
      unique: true, // already creates an index — no index:true needed
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

    // FIX: added missing password reset fields
    password_reset_token: {
      type: String,
      default: null,
      select: false,
    },

    password_reset_expiry: {
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

    // FIX: removed address_details array — Address model owns the
    // relationship via Address.userId. Storing IDs on both sides creates
    // sync risk with no benefit. Query addresses with: Address.find({ userId })
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// admin dashboard: filter by role + status
userSchema.index({ role: 1, status: 1 });

// activity sorting
userSchema.index({ last_login_date: -1 });

// admin cleanup: find unverified active users
userSchema.index({ verify_email: 1, status: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
