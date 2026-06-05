import { Router } from "express";
import {
  getProductController,
  getSingleProductController,
} from "../controllers/product.contoller.js";

const productRouter = Router();

// Public Route - Anyone can access
productRouter.get("/", getProductController);
productRouter.get("/featured", getProductController);
productRouter.get("/:slug", getSingleProductController);

export default productRouter;
