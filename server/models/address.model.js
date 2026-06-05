import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    address_line: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      // FIX: removed standalone index:true on city — city alone is never
      // a query filter here; addresses are always queried by userId
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      default: "Bangladesh",
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["shipping", "billing"],
      default: "shipping",
    },

    // FIX: flag for the user's default address — needed for pre-filling
    // checkout without an extra round-trip.
    // Enforce only one default per user in your service layer
    // (unset others when setting a new default).
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// primary access pattern: user's addresses, newest first
addressSchema.index({ userId: 1, createdAt: -1 });

// fast lookup of a user's default address
addressSchema.index({ userId: 1, isDefault: 1 });

const Address =
  mongoose.models.address || mongoose.model("address", addressSchema);

export default Address;
