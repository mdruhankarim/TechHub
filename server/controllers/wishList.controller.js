import wishlistService from "../services/wishlistService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * @desc    Toggle a product in the authenticated user's wishlist (add/remove)
 * @route   POST /api/v1/wishlist/toggle
 * @access  Private
 */
export const toggleWishlistController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { productId } = req.body;
  if (!productId) throw new ApiError(400, "Product ID is required");

  const result = await wishlistService.toggleWishlist({ userId, productId });

  const message = result.added
    ? "Product added to wishlist"
    : "Product removed from wishlist";

  return res.status(200).json(new ApiResponse(200, result, message));
});

/**
 * @desc    Get all wishlist items for the authenticated user
 * @route   GET /api/v1/wishlist
 * @access  Private
 */
export const getWishlistController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const items = await wishlistService.getWishlist({ userId });

  return res
    .status(200)
    .json(new ApiResponse(200, { items, count: items.length }, "Wishlist fetched successfully"));
});

/**
 * @desc    Remove a specific product from the authenticated user's wishlist
 * @route   DELETE /api/v1/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlistController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { productId } = req.params;
  if (!productId) throw new ApiError(400, "Product ID is required");

  try {
    await wishlistService.removeFromWishlist({ userId, productId });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product removed from wishlist"));
  } catch (error) {
    if (error.message === "ITEM_NOT_IN_WISHLIST") {
      throw new ApiError(404, "Product not found in wishlist");
    }
    throw new ApiError(500, error.message);
  }
});

/**
 * @desc    Check if a specific product is in the authenticated user's wishlist
 * @route   GET /api/v1/wishlist/check/:productId
 * @access  Private
 */
export const checkWishlistController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { productId } = req.params;
  if (!productId) throw new ApiError(400, "Product ID is required");

  const isWishlisted = await wishlistService.isWishlisted({ userId, productId });

  return res
    .status(200)
    .json(new ApiResponse(200, { isWishlisted }, "Wishlist status checked"));
});
