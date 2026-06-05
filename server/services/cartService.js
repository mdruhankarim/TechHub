import { Product } from "../models/product.model.js";
import { cartRepository } from "../repositories/cartRepository.js";

export const cartService = {
  async addItem(userId, productId) {
    const product = await Product.findById(productId).lean();
    if (!product) throw new Error("PRODUCT_NOT_FOUND");

    const existing = await cartRepository.findItem(userId, productId);

    if (existing) {
      return cartRepository.incrementQuantity(userId, productId);
    }

    return cartRepository.createItem(userId, productId, product.price);
  },

  async removeItem(userId, productId) {
    const existing = await cartRepository.findItem(userId, productId);
    if (!existing) throw new Error("ITEM_NOT_IN_CART");

    return cartRepository.removeItem(userId, productId);
  },

  async getCart(userId) {
    return cartRepository.getUserCart(userId);
  },
};
