import { Router } from "express";
import adminAuthMiddleware from "../middleware/adminMiddleware.js";
import {
  addToCartController,
  getCartController,
  removeFromCartController,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.use(adminAuthMiddleware);

cartRouter.post("/", addToCartController);
cartRouter.delete("/:productId", removeFromCartController);
cartRouter.get("/", getCartController);

export default cartRouter;
