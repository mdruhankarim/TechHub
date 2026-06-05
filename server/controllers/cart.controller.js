import CartProductModel from "../models/cartProduct.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addToCartController = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user?._id; // Handled securely by your auth middleware

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // 1. Fetch only the price from the product model to satisfy the snapshot requirement
  const product = await Product.findById(productId).select("price");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // 2. Perform an atomic upsert operation
  const cartItem = await CartProductModel.findOneAndUpdate(
    {
      userId,
      productId,
    },
    {
      $inc: { quantity: quantity }, // If item exists, increment quantity
      $setOnInsert: { priceAtAdd: product.price }, // If item is new, set the price snapshot
    },
    {
      returnDocument: "after",
      upsert: true, // Create it if it doesn't exist
      runValidators: true,
    },
  );

  return res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cartItem,
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?._id;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // 1. Atomically decrement the quantity by 1
  const cartItem = await CartProductModel.findOneAndUpdate(
    { userId, productId },
    { $inc: { quantity: -1 } },
    { returnDocument: "after" },
  );

  if (!cartItem) {
    throw new ApiError(404, "Product not found in your cart");
  }

  // 2. Clean up: If quantity falls to 0 or below, remove it
  if (cartItem.quantity <= 0) {
    await CartProductModel.deleteOne({ _id: cartItem._id });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart completely",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Cart item quantity decreased",
    data: cartItem,
  });
});

/**
 * CLEAR ENTIRE CART
 */
export const clearCartController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // Atomically delete all cart documents matching this user ID
  await CartProductModel.deleteMany({ userId });

  return res.status(200).json({
    success: true,
    message: "Cart cleared completely successfully",
  });
});
