import express from "express";
import { getAllComments, postComment } from "../controllers/commentController";
const commentRouter = express.Router();
commentRouter.get("/", getAllComments);
commentRouter.post("/", postComment);
export default commentRouter;
