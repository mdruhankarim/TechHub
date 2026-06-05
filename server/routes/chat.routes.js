import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/", chatController);

export default chatRouter;
