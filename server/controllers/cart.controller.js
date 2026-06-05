import { cartService } from "../services/cartService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// ── reusable validator ──────────────────────────────────────────
const assertValidObjectId = (id, label = "ID") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `A valid ${label} is required`);
  }
};

// ── service error → HTTP error mapper ──────────────────────────
const mapError = (err) => {
  const map = {
    PRODUCT_NOT_FOUND: new ApiError(404, "Product not found"),
    ITEM_NOT_IN_CART: new ApiError(404, "Item not found in cart"),
  };
  return map[err.message] ?? new ApiError(500, "Internal Server Error");
};

// 1. Add To Cart
export const addToCartController = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.id;

  assertValidObjectId(productId, "Product ID");

  try {
    const cartItem = await cartService.addItem(userId, productId);

    return res
      .status(200)
      .json(
        new ApiResponse(200, cartItem, "Product added to cart successfully"),
      );
  } catch (err) {
    throw mapError(err);
  }
});

// 2. Remove From Cart
export const removeFromCartController = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.id;

  assertValidObjectId(productId, "Product ID");

  try {
    await cartService.removeItem(userId, productId);

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Product removed from cart successfully"),
      );
  } catch (err) {
    throw mapError(err);
  }
});

// 3. Get Cart
export const getCartController = asyncHandler(async (req, res) => {
  const userId = req.id;

  const cart = await cartService.getCart(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});
