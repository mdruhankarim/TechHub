import { Router } from "express";
import { getProductController } from "../controllers/product.contoller.js";

const productRouter = Router();

// Public Route - Anyone can access
productRouter.get("/", getProductController);

export default productRouter;
