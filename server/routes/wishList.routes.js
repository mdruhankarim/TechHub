import express from "express";
import {
  toggleWishlistController,
  getWishlistController,
  removeFromWishlistController,
  checkWishlistController,
} from "../controllers/wishList.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
const wishlistRouter = express.Router();

// all wishlist routes are private
wishlistRouter.use(authMiddleware);

wishlistRouter.post("/toggle", toggleWishlistController);
wishlistRouter.get("/", getWishlistController);
wishlistRouter.get("/check/:productId", checkWishlistController);
wishlistRouter.delete("/:productId", removeFromWishlistController);

export default wishlistRouter;
