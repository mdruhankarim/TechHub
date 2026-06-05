import { redis } from "../config/redis.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { detectProductCategory } from "../utils/gemini.js";

// getProductController
export const getProductController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page ?? "1", 10);
  const limit = parseInt(req.query.limit ?? "20", 20);
  const skip = (page - 1) * limit;
  

  return res
    .status(200)
    .json(new ApiResponse(200, "Products fetched successfully"));
});
// getFeaturedProductController
export const getFeaturedProductConroller = asyncHandler(async (req, res) => {
  const cached = await redis.get("featured_products");
  if (cached) {
    const products = JSON.parse(cached);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { products, total: products.length },
          "Featured products fetched successfully",
        ),
      );
  }

  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  if (!featuredProducts || featuredProducts.length === 0) {
    throw new ApiError(404, "No featured products found");
  }

  await redis.set("featured_products", JSON.stringify(featuredProducts), {
    ex: 600,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products: featuredProducts, total: featuredProducts.length },
        "Featured products fetched successfully",
      ),
    );
});

// getSingleProductController
export const getSingleProductController = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Product slug is required");
  }

  const cacheKey = `product:${slug}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { product: cached },
          "Product fetched successfully",
        ),
      );
  }

  const product = await Product.findOne({
    slug,
    isPublished: true,
    isArchived: false,
  }).lean();

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await redis.set(cacheKey, product, { ex: 3600 });

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product fetched successfully"));
});
