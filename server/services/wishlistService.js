import wishlistRepository from "../repositories/wishlistRepository.js";

const wishlistService = {
  // toggle: add if not present, remove if already present
  // returns { added: true/false, item }
  toggleWishlist: async ({ userId, productId }) => {
    const existing = await wishlistRepository.findOne(userId, productId);

    if (existing) {
      await wishlistRepository.removeItem(userId, productId);
      return { added: false, productId };
    }

    const item = await wishlistRepository.addItem(userId, productId);
    return { added: true, item };
  },

  // get all wishlist items for user with product details populated
  getWishlist: async ({ userId }) => {
    const items = await wishlistRepository.findAllByUser(userId);
    return items;
  },

  // remove a specific item (direct remove, no toggle)
  removeFromWishlist: async ({ userId, productId }) => {
    const removed = await wishlistRepository.removeItem(userId, productId);
    if (!removed) throw new Error("ITEM_NOT_IN_WISHLIST");
    return removed;
  },

  // check if a single product is wishlisted by this user
  isWishlisted: async ({ userId, productId }) => {
    const exists = await wishlistRepository.exists(userId, productId);
    return !!exists;
  },
};

export default wishlistService;
