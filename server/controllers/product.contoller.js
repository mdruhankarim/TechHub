import { redis } from "../config/redis.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { detectProductCategory } from "../utils/gemini.js";

// getProductController
export const getProductController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page ?? "1", 10);
  const limit = parseInt(req.query.limit ?? "20", 10);
  const skip = (page - 1) * limit;

  const { search, category, minPrice, maxPrice } = req.query;

  // AI Category Detection
  let aiCategory = null;
  if (search && search.trim() !== "") {
    aiCategory = await detectProductCategory(search);
  }

  // MongoDB Query
  const mongoQuery = { isPublished: true };

  if (category) {
    mongoQuery.category = category;
  }

  if (minPrice || maxPrice) {
    mongoQuery.price = {};
    if (minPrice) mongoQuery.price.$gte = Number(minPrice);
    if (maxPrice) mongoQuery.price.$lte = Number(maxPrice);
  }

  if (search && search.trim() !== "") {
    if (aiCategory) {
      // AI category + title search দুইটাই apply
      mongoQuery.category = aiCategory;
      mongoQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    } else {
      // শুধু title/description search
      mongoQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
  }

  // Cache Key
  const cacheKey = `products:${page}:${limit}:${search || ""}:${category || aiCategory || ""}:${minPrice || ""}:${maxPrice || ""}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      fromCached: true,
      ...JSON.parse(cached),
    });
  }

  const [products, total] = await Promise.all([
    Product.find(mongoQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Product.countDocuments(mongoQuery),
  ]);

  const totalPages = Math.ceil(total / limit);

  const payload = {
    products,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    appliedFilters: {
      search: search || null,
      aiDetectedCategory: aiCategory,
      category: category || aiCategory || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    },
  };

  await redis.set(cacheKey, JSON.stringify(payload), { ex: 600 });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Products fetched successfully"));
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
