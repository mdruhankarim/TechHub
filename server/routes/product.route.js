import { Router } from "express";
import {
  getFeaturedProductConroller,
  getProductController,
  getSingleProductController,
} from "../controllers/product.contoller.js";
import { getAllCategoryController } from "../controllers/admin.controller.js";

const productRouter = Router();

// Public Route - Anyone can access
productRouter.get("/", getProductController);
productRouter.get("/featured", getFeaturedProductConroller);
productRouter.get("/categories", getAllCategoryController);
productRouter.get("/:slug", getSingleProductController);

export default productRouter;
