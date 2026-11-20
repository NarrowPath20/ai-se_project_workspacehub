import { isObjectIdOrHexString, type HydratedDocument } from "mongoose";
import { Comment, type CommentDocument } from "../models/Comment";
import type { AuthPayload } from "../types/domain";
import { AppError } from "../utils/appError";
import { assertFound } from "../utils/scopedQuery";
import { requireString } from "../utils/validators";
import { canManageComment } from "./permissionService";
import { getTaskById } from "./taskService";

const getCommentTask = (organizationId: string, taskId: string) => {
  if (!isObjectIdOrHexString(taskId)) {
    throw new AppError("Task not found", 404);
  }

  return getTaskById(organizationId, taskId);
};

export const listComments = async (organizationId: string, taskId: string) => {
  const task = await getCommentTask(organizationId, taskId);
  return Comment.find({ organizationId, taskId: task._id }).sort({
    createdAt: -1,
    _id: -1,
  });
};

export const createComment = async (
  actor: AuthPayload,
  taskId: string,
  payload: Record<string, unknown>,
) => {
  const content = requireString(payload?.content, "Content");
  const task = await getCommentTask(actor.organizationId, taskId);
  return Comment.create({
    organizationId: actor.organizationId,
    taskId: task._id,
    authorId: actor.userId,
    content,
  });
};

const getManageableComment = async (
  actor: AuthPayload,
  taskId: string,
  commentId: string,
) => {
  const task = await getCommentTask(actor.organizationId, taskId);
  if (!isObjectIdOrHexString(commentId)) {
    throw new AppError("Comment not found", 404);
  }

  const comment = assertFound<HydratedDocument<CommentDocument>>(
    await Comment.findOne({
      _id: commentId,
      organizationId: actor.organizationId,
      taskId: task._id,
    }),
    "Comment",
  );

  if (!canManageComment(actor, String(comment.authorId))) {
    throw new AppError(
      "You do not have permission to manage this comment",
      403,
    );
  }

  return comment;
};

export const updateComment = async (
  actor: AuthPayload,
  taskId: string,
  commentId: string,
  payload: Record<string, unknown>,
) => {
  const comment = await getManageableComment(actor, taskId, commentId);
  comment.content = requireString(payload?.content, "Content");
  return comment.save();
};

export const deleteComment = async (
  actor: AuthPayload,
  taskId: string,
  commentId: string,
) => {
  const comment = await getManageableComment(actor, taskId, commentId);
  await comment.deleteOne();
  return { deleted: true };
};
