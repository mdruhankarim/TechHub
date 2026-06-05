import { redis } from "../config/redis.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { detectProductCategory } from "../utils/gemini.js";

// getProductController
// getProductController
export const getProductController = asyncHandler(async (req, res) => {
  // =========================
  // Query Params
  // =========================

  // limit protection
  // nobody can request 5000 products
  // max = 50
  const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);

  // cursor pagination
  // frontend sends last product _id
  const cursor = req.query.cursor;

  // optional filters
  const category = req.query.category;
  const featured = req.query.featured;
  const search = req.query.search;

  // =========================
  // Mongo Query
  // =========================

  const query = {
    isPublished: true,
    isArchived: false,
  };

  // category filtering
  if (category) {
    query.category = category;
  }

  // featured filtering
  if (featured === "true") {
    query.isFeatured = true;
  }

  // text search
  if (search) {
    query.title = {
      $regex: search,
      $options:'i'
    };
  }

  // =========================
  // Cursor Pagination
  // =========================

  // very fast for large database
  // better than skip()
  if (cursor) {
    query._id = {
      $lt: cursor,
    };
  }

  // =========================
  // Redis Cache
  // =========================

  // unique cache per query
  const cacheKey = `products:${JSON.stringify({
    limit,
    cursor,
    category,
    featured,
    search,
  })}`;

  // check cache first
  const cachedProducts = await redis.get(cacheKey);

  if (cachedProducts) {
    let parsedData = null;

    // ১. চেক করা হচ্ছে ডেটা কি ইতিমধ্যেই অবজেক্ট হিসেবে এসেছে কি না
    if (typeof cachedProducts === "object" && cachedProducts !== null) {
      parsedData = cachedProducts;
    }
    // ২. ডেটা যদি স্ট্রিং হয়, তবে সেটাকে পার্স করার চেষ্টা করা হচ্ছে
    else if (typeof cachedProducts === "string") {
      try {
        if (cachedProducts !== "[object Object]") {
          parsedData = JSON.parse(cachedProducts);
        } else {
          // যদি ভুল করে "[object Object]" স্ট্রিং সেভ হয়ে থাকে, তবে কারাপ্টেড ক্যাশ ডিলিট করে দেওয়া হবে
          await redis.del(cacheKey);
        }
      } catch (e) {
        // কোনো কারণে JSON পার্স করতে না পারলে ক্যাশ ডিলিট করে দেওয়া হবে
        await redis.del(cacheKey);
      }
    }

    // যদি ডেটা সঠিকভাবে পাওয়া যায়, তবে এখান থেকেই রেসপন্স রিটার্ন হবে
    if (parsedData && parsedData.products) {
      // 🚀 এখানে ক্যাশ লগার অ্যাড করা হলো
      console.log("⚡ [CACHE HIT]: Products fetched from Redis!");

      return res.status(200).json({
        statusCode: 200,
        data: parsedData,
        message: "Products fetched successfully",
        success: true
      });
    }
  }

  // =========================
  // Database Query
  // =========================

  const products = await Product.find(query)
    // only needed fields
    // smaller response = faster API
    .select(
      "title slug price compareAtPrice images category stock ratingAverage",
    )
    // return plain javascript object
    // faster than mongoose document
    .lean()
    // newest first
    // scalable sorting
    .sort({ _id: -1 })
    // +1 for next page detection
    .limit(limit + 1);

  // 🗄️ এখানে ডেটাবেজ লগার অ্যাড করা হলো
  console.log("💾 [DB MISS]: Products fetched from MongoDB Database!");

  // =========================
  // Next Cursor Logic
  // =========================

  let nextCursor = null;

  // if extra product exists
  // means more products available
  if (products.length > limit) {
    const nextItem = products.pop();
    nextCursor = nextItem._id;
  }

  // =========================
  // Final Response Data
  // =========================

  const responseData = {
    products,
    nextCursor,
    hasMore: Boolean(nextCursor),
  };

  // =========================
  // Store In Redis
  // =========================

  // cache for 60 sec
  // reduces mongodb load
  try {
    await redis.set(cacheKey, JSON.stringify(responseData), {
      ex: 300,
    });
  } catch (redisError) {
    console.error("Redis set error:", redisError);
    // ক্যাশ সেভ করতে না পারলেও যেন API ক্রাশ না করে, তাই শুধু এরর লগ করা হলো
  }

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Products fetched successfully"));
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
