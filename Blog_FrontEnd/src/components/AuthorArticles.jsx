import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
} from "../styles/common";

function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      setLoading(true);

      try {
        const authorId = user?._id || user?.userId;
        const res = await axios.get(`http://localhost:4000/author-api/articles/${authorId}`, { withCredentials: true });

        setArticles(res.data.payload);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">My Articles</h2>
        <p className={emptyStateClass}>You haven't published any articles yet.</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">My Articles</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {articles.length} Total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {articles.map((article) => (
          <div key={article._id} className={`${articleCardClass} relative min-h-65 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm`}>
            {/* Status Badge */}
            <span
              className={`w-fit rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                article.isArticleActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {article.isArticleActive ? "ACTIVE" : "INACTIVE"}
            </span>

            <div className="mt-3 flex flex-col gap-2">
              <p className={articleMeta}>{article.Category || article.category}</p>

              <p className="text-xl font-bold leading-snug text-slate-900">{article.title}</p>

              <p className="text-sm leading-relaxed text-slate-600">{(article.Content || article.content || "").slice(0, 140)}...</p>
            </div>

            <button className={`${ghostBtn} mt-auto w-fit pt-4 text-base`} onClick={() => openArticle(article)}>
              Read Article 
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AuthorArticles;