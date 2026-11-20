import { useId, useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { commentService } from "../services/commentService";
import type { Comment, User } from "../types/models";
import { formatDateTime } from "../utils/date";
import { canManageComment } from "../utils/permissions";

interface TaskCommentsProps {
  taskId: string;
  commentCount: number;
  users: User[];
}

const buttonClassName =
  "rounded-[10px] bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50";

export const TaskComments = ({
  taskId,
  commentCount,
  users,
}: TaskCommentsProps) => {
  const { user } = useAuth();
  const panelId = useId();
  const [isExpanded, setIsExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [managingComment, setManagingComment] = useState(false);
  const [manageError, setManageError] = useState<string | null>(null);

  const loadComments = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      setComments(await commentService.list(taskId));
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load comments",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && comments === null && !isLoading) {
      void loadComments();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isPosting || comments === null) {
      return;
    }

    setIsPosting(true);
    setPostError(null);

    try {
      const comment = await commentService.create(taskId, { content });
      setComments((current) => [comment, ...(current ?? [])]);
      setDraft("");
    } catch (error) {
      setPostError(
        error instanceof Error ? error.message : "Unable to post comment",
      );
    } finally {
      setIsPosting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content);
    setManageError(null);
  };

  const handleSave = async (
    event: FormEvent<HTMLFormElement>,
    comment: Comment,
  ) => {
    event.preventDefault();
    const content = editingContent.trim();
    if (!content || managingComment || !canManageComment(user, comment)) {
      return;
    }

    setManagingComment(true);
    setManageError(null);
    try {
      const updated = await commentService.update(taskId, comment._id, {
        content,
      });
      setComments(
        (current) =>
          current?.map((item) => (item._id === updated._id ? updated : item)) ??
          null,
      );
      setEditingCommentId(null);
    } catch (error) {
      setManageError(
        error instanceof Error ? error.message : "Unable to update comment",
      );
    } finally {
      setManagingComment(false);
    }
  };

  const handleDelete = async (comment: Comment) => {
    if (managingComment || !canManageComment(user, comment)) {
      return;
    }

    setManagingComment(true);
    setManageError(null);
    try {
      await commentService.delete(taskId, comment._id);
      setComments(
        (current) =>
          current?.filter((item) => item._id !== comment._id) ?? null,
      );
      if (editingCommentId === comment._id) {
        setEditingCommentId(null);
      }
    } catch (error) {
      setManageError(
        error instanceof Error ? error.message : "Unable to delete comment",
      );
    } finally {
      setManagingComment(false);
    }
  };

  return (
    <>
      <button
        aria-controls={isExpanded ? panelId : undefined}
        aria-expanded={isExpanded}
        className={buttonClassName}
        onClick={handleToggle}
        type="button"
      >
        {isExpanded
          ? "Hide Comments"
          : `Show Comments (${comments?.length ?? commentCount})`}
      </button>
      {isExpanded && (
        <div
          className="mt-4 basis-full space-y-4 rounded-2xl border border-slate-200 p-4"
          id={panelId}
        >
          <form
            className="flex flex-wrap items-start gap-3"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <textarea
              aria-label="New comment"
              className="w-full flex-1 rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 disabled:bg-slate-100"
              disabled={comments === null || isPosting}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a comment"
              rows={2}
              value={draft}
            />
            <button
              className={buttonClassName}
              disabled={comments === null || isPosting || !draft.trim()}
              type="submit"
            >
              {isPosting ? "Posting..." : "Add Comment"}
            </button>
          </form>
          {isLoading && <p role="status">Loading comments...</p>}
          {loadError && (
            <div className="space-y-2">
              <p className="text-sm text-danger" role="alert">
                {loadError}
              </p>
              <button
                className={buttonClassName}
                onClick={() => void loadComments()}
                type="button"
              >
                Retry
              </button>
            </div>
          )}
          {postError && (
            <p className="text-sm text-danger" role="alert">
              {postError}
            </p>
          )}
          {manageError && (
            <p className="text-sm text-danger" role="alert">
              {manageError}
            </p>
          )}
          {comments?.length === 0 && (
            <p className="text-sm text-slate-600">No comments yet.</p>
          )}
          {comments && comments.length > 0 && (
            <ul className="space-y-3">
              {comments.map((comment) => {
                const author = users.find(
                  ({ _id }) => _id === comment.authorId,
                );
                const canManage = canManageComment(user, comment);
                const isEditing = canManage && editingCommentId === comment._id;
                return (
                  <li
                    className="space-y-1 rounded-2xl border border-slate-200 p-4 text-sm"
                    key={comment._id}
                  >
                    <p className="font-medium text-ink">
                      {author
                        ? `${author.firstName} ${author.lastName}`
                        : "Unknown user"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <time dateTime={comment.createdAt}>
                        {formatDateTime(comment.createdAt)}
                      </time>
                      {canManage && (
                        <>
                          {!isEditing && (
                            <button
                              className="font-medium text-ink hover:underline disabled:opacity-50"
                              disabled={managingComment}
                              onClick={() => handleEdit(comment)}
                              type="button"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            className="font-medium text-danger hover:underline disabled:opacity-50"
                            disabled={managingComment}
                            onClick={() => void handleDelete(comment)}
                            type="button"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                    {isEditing ? (
                      <form
                        className="flex flex-wrap items-start gap-3"
                        onSubmit={(event) => void handleSave(event, comment)}
                      >
                        <textarea
                          aria-label="Edit comment"
                          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 disabled:bg-slate-100"
                          disabled={managingComment}
                          onChange={(event) =>
                            setEditingContent(event.target.value)
                          }
                          rows={2}
                          value={editingContent}
                        />
                        <button
                          className={buttonClassName}
                          disabled={managingComment || !editingContent.trim()}
                          type="submit"
                        >
                          Save
                        </button>
                        <button
                          className="rounded-[10px] px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                          disabled={managingComment}
                          onClick={() => setEditingCommentId(null)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-slate-700">
                        {comment.content}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
};
