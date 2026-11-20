import type { Request, Response } from "express";
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from "../services/commentService";
import { sendSuccess } from "../utils/apiResponse";

export const listCommentsController = async (req: Request, res: Response) => {
  const comments = await listComments(req.auth!.organizationId, req.params.id);
  return sendSuccess(res, comments);
};

export const createCommentController = async (
  req: Request<Record<string, string>, unknown, Record<string, unknown>>,
  res: Response,
) => {
  const comment = await createComment(req.auth!, req.params.id, req.body);
  return sendSuccess(res, comment, 201);
};

export const updateCommentController = async (
  req: Request<Record<string, string>, unknown, Record<string, unknown>>,
  res: Response,
) => {
  const { id, commentId } = req.params;
  const comment = await updateComment(req.auth!, id, commentId, req.body);
  return sendSuccess(res, comment);
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const { id, commentId } = req.params;
  const result = await deleteComment(req.auth!, id, commentId);
  return sendSuccess(res, result);
};
