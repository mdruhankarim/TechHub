import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  addToCartController,
  clearCartController,
  removeFromCart,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.use(authMiddleware);

/**
 * CART
 */
cartRouter.post("/addToCart", addToCartController);
cartRouter.patch("/removeFromCart", removeFromCart);
cartRouter.delete("/clearCart", clearCartController);

export default cartRouter;
