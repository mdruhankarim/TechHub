import { Router } from "express";
import {
  AddCategoryController,
  addProductController,
  getAllCategoryController,
  getAllUserController,
} from "../controllers/admin.controller.js";
import adminAuthMiddleware from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";
const AdminRouter = Router();

AdminRouter.get("/users", adminAuthMiddleware, getAllUserController);
AdminRouter.post(
  "/add-product",
  adminAuthMiddleware,
  upload.array("images", 5), // single → array
  addProductController,
);

AdminRouter.post(
  "/add-category",
  adminAuthMiddleware,
  upload.single("image"),
  AddCategoryController,
);

export default AdminRouter;
