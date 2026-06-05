import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// prevents duplicate entries + fast lookup by userId
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

// fast "get all wishlist items for user" query
wishlistSchema.index({ userId: 1, createdAt: -1 });

const WishlistModel =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

export default WishlistModel;
