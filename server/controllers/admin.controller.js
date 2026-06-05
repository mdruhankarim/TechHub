import { redis } from "../config/redis.js";
import Category from "../models/category.mode.js";
import { Product } from "../models/product.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { detectProductCategory } from "../utils/gemini.js";

// getAllUserController
export const getAllUserController = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select(
      "-password -refresh_token -email_verify_token -email_verify_expiry -__v",
    )
    .sort({ createdAt: -1 });

  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalUsers: users.length, users },
        "Users fetched successfully",
      ),
    );
});

// addProductController
export const addProductController = asyncHandler(async (req, res) => {
  if (req.user?.role !== "Admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const {
    title,
    description,
    price,
    compareAtPrice,
    category,
    stock,
    isPublished,
  } = req.body;

  if (!title || !price || !category || stock === undefined) {
    throw new ApiError(400, "title, price, category and stock are required");
  }

  let slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const existing = await Product.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now()}`;

  let images = [];
  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(
      req.files.map((file) =>
        uploadOnCloudinary(
          file.buffer,
          file.originalname || `product-${Date.now()}`,
        ),
      ),
    );
    images = uploads
      .filter((r) => r?.secure_url)
      .map((r) => ({ url: r.secure_url, publicId: r.public_id }));
  }

  const product = await Product.create({
    title,
    slug,
    description: description || "",
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
    category,
    images,
    stock: Number(stock),
    isPublished: isPublished === "true" || isPublished === true,
    vendorId: req.user._id,
  });

  await redis.del("all_products");

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
});

// updateProductController
export const updateProductController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    compareAtPrice,
    category,
    stock,
    isPublished,
    removeImages,
  } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (title && title !== product.title) {
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const existing = await Product.findOne({ slug, _id: { $ne: id } });
    if (existing) slug = `${slug}-${Date.now()}`;
    product.slug = slug;
    product.title = title;
  }

  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (compareAtPrice !== undefined)
    product.compareAtPrice = compareAtPrice ? Number(compareAtPrice) : null;
  if (category) product.category = category;
  if (stock !== undefined) product.stock = Number(stock);
  if (isPublished !== undefined)
    product.isPublished = isPublished === "true" || isPublished === true;

  if (removeImages) {
    const toRemove = JSON.parse(removeImages);
    await Promise.all(toRemove.map((url) => deleteFromCloudinary(url)));
    product.images = product.images.filter(
      (img) => !toRemove.includes(img.url),
    );
  }

  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(
      req.files.map((file) =>
        uploadOnCloudinary(
          file.buffer,
          file.originalname || `product-${Date.now()}`,
        ),
      ),
    );
    const newImages = uploads
      .filter((r) => r?.secure_url)
      .map((r) => ({ url: r.secure_url, publicId: r.public_id }));

    product.images = [...product.images, ...newImages];
  }

  await product.save();
  await redis.del("all_products");

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// toggleFeaturedProduct
export const toggleFeaturedProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isFeatured = !product.isFeatured;
  await product.save();

  await redis.del("all_products");
  await redis.del("featured_products");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        productId: product._id,
        title: product.title,
        isFeatured: product.isFeatured,
      },
      `Product ${product.isFeatured ? "marked as featured" : "removed from featured"} successfully`,
    ),
  );
});

// deleteProductController
export const deleteProductController = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.images && product.images.length > 0) {
    await Promise.all(
      product.images.map((image) => {
        if (image.url) return deleteFromCloudinary(image.url);
      }),
    );
  }

  await Product.findByIdAndDelete(productId);
  await redis.del("all_products");

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

// AddCategoryController
export const AddCategoryController = asyncHandler(async (req, res) => {
  const file = req.file;
  const { name } = req.body;

  if (!name || !file) {
    throw new ApiError(400, "Enter required fields.");
  }

  const cloudinaryResult = await uploadOnCloudinary(
    req.file.buffer,
    req.file.originalname || `${name}-${Date.now()}`,
  );

  if (!cloudinaryResult || !cloudinaryResult.secure_url) {
    throw new ApiError(500, "Failed to upload image to Cloudinary");
  }

  const newCategory = await Category.create({
    name,
    image: cloudinaryResult.secure_url,
    imagePublicId: cloudinaryResult.public_id,
  });

  await redis.del("all_categories");

  return res
    .status(201)
    .json(new ApiResponse(201, newCategory, "Category added successfully"));
});

// updateCategoryController
export const updateCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const file = req.file;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (name) category.name = name;

  if (file) {
    if (category.image) {
      await deleteFromCloudinary(category.image);
    }

    const result = await uploadOnCloudinary(
      file.buffer,
      file.originalname || `${name}-${Date.now()}`,
    );

    if (!result?.secure_url) {
      throw new ApiError(500, "Failed to upload image");
    }

    category.image = result.secure_url;
    category.imagePublicId = result.public_id;
  }

  await category.save();
  await redis.del("all_categories");

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

// getAllCategoryController
export const getAllCategoryController = asyncHandler(async (req, res) => {
  const cached = await redis.get("all_categories");
  if (cached) {
    const categories = JSON.parse(cached);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalCategories: categories.length, categories },
          "Categories fetched successfully",
        ),
      );
  }

  const categories = await Category.find();
  if (!categories || categories.length === 0) {
    throw new ApiError(404, "No categories found");
  }

  await redis.set("all_categories", JSON.stringify(categories), { ex: 3600 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalCategories: categories.length, categories },
        "Categories fetched successfully",
      ),
    );
});
