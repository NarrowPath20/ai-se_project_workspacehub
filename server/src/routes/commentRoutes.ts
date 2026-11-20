import { Router } from "express";
import {
  createCommentController,
  deleteCommentController,
  listCommentsController,
  updateCommentController,
} from "../controllers/commentController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router({ mergeParams: true });

router.get("/", asyncHandler(listCommentsController));
router.post("/", asyncHandler(createCommentController));
router.patch("/:commentId", asyncHandler(updateCommentController));
router.delete("/:commentId", asyncHandler(deleteCommentController));

export default router;
