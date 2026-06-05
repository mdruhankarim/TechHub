import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { chatWithAssistant } from "../utils/gemini.js";

export const chatController = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    throw new ApiError(400, "Message is required");
  }

  // DB থেকে published products আনো
  const products = await Product.find({ isPublished: true, isArchived: false })
    .select("title price category stock slug description")
    .lean();

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  // Gemini কে পাঠাও
  const reply = await chatWithAssistant(message, products);

  if (!reply) {
    throw new ApiError(500, "AI assistant failed to respond");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { reply }, "Chat response generated"));
});
