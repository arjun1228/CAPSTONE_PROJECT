import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import { loadingClass, errorClass } from "../styles/common.js";

function ArticleByID() {
  const articlePageWrapper = "mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";
  const articleHeader = "space-y-3 border-b border-slate-100 pb-4";
  const articleCategory = "inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700";
  const articleMainTitle = "text-3xl font-black tracking-tight text-slate-900";
  const articleAuthorRow = "flex items-center justify-between text-sm text-slate-500";
  const authorInfo = "font-medium text-slate-700";
  const articleContent = "mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700";
  const articleFooter = "mt-8 border-t border-slate-100 pt-4 text-xs text-slate-500";
  const articleActions = "mt-6 flex gap-3";
  const editBtn = "rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700";
  const deleteBtn = "rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700";

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const userId = user?._id || user?.userId;
  const articleAuthorId = article?.author?._id || article?.author;
  const canManageArticle =
    user?.role === "AUTHOR" &&
    Boolean(userId) &&
    Boolean(articleAuthorId) &&
    userId.toString() === articleAuthorId.toString();

  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`http://localhost:4000/common-api/articles/${id}`, { withCredentials: true });

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, article]);

  const refreshArticle = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/common-api/articles/${id}`, { withCredentials: true });
      setArticle(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true },
      );

      console.log("SUCCESS:", res.data);

      setArticle(res.data.payload);

      toast.success(res.data.message);
    } catch (err) {
      console.log("ERROR:", err.response);

      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg); // already deleted/active case
      } else {
        setError(msg || "Operation failed");
      }
    }
  };
  
  const editArticle = (articleObj) => {
    navigate(`/edit-article/${articleObj._id}`, { state: articleObj });
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setCommentLoading(true);
    try {
      await axios.put(
        "http://localhost:4000/user-api/articles",
        { articleId: id, comment: comment.trim() },
        { withCredentials: true }
      );

      toast.success("Comment added successfully");
      setComment("");
      await refreshArticle();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.Category || article.category}</span>

        <span
          className={`mt-2 w-fit rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            article.isArticleActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
        >
          {article.isArticleActive ? "Active" : "Deactive"}
        </span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {article.author?.firstName || "Author"}</div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.Content || article.content}</div>

      {/* AUTHOR actions */}
      {canManageArticle && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      {user?.role === "USER" && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-bold text-slate-900">Comments</h3>

          {Array.isArray(article.Comments) && article.Comments.length > 0 ? (
            <div className="mt-4 space-y-3">
              {article.Comments.map((item, index) => (
                <div key={item._id || index} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-sm text-slate-800">{item.comment}</p>
                  <div className="mt-1 text-xs text-slate-500">
                    <p>By {item.user?.firstName || "User"}</p>
                    <p>Email: {item.user?.email || "Not available"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No comments yet.</p>
          )}

          <form onSubmit={addComment} className="mt-4 space-y-3">
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {commentLoading ? "Posting..." : "Add Comment"}
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ArticleByID;