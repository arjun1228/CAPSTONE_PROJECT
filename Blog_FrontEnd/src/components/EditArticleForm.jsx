import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../store/authStore";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
} from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const authorId = useMemo(() => currentUser?._id || currentUser?.userId, [currentUser]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // prefill form
  useEffect(() => {
    if (!article) return;

    setValue("title", article.title || "");
    setValue("Category", article.Category || article.category || "");
    setValue("Content", article.Content || article.content || "");
  }, [article, setValue]);

  useEffect(() => {
    if (article || !id || !authorId) return;

    const fetchArticleById = async () => {
      setLoading(true);
      setPageError("");

      try {
        const res = await axios.get(`http://localhost:4000/author-api/articles/${authorId}`, {
          withCredentials: true,
        });

        const targetArticle = (res.data.payload || []).find((item) => item._id === id);
        if (!targetArticle) {
          setPageError("Article not found or you do not have access.");
          return;
        }

        setArticle(targetArticle);
      } catch (err) {
        setPageError(err.response?.data?.message || err.message || "Failed to load article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleById();
  }, [article, id, authorId]);

  const updateArticle = async (data) => {
    if (!article || !authorId) {
      toast.error("Unable to update article. Please try again.");
      return;
    }

    try {
      const payload = {
        articleId: article._id,
        author: authorId,
        title: data.title,
        Category: data.Category,
        Content: data.Content,
      };

      const res = await axios.put("http://localhost:4000/author-api/articles", payload, {
        withCredentials: true,
      });

      toast.success("Article updated successfully");
      navigate("/authordashboard", { replace: true, state: { updatedArticle: res.data.payload } });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update article");
    }
  };

  if (loading) {
    return <p className={errorClass}>Loading article...</p>;
  }

  if (pageError) {
    return <p className={errorClass}>{pageError}</p>;
  }

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input className={inputClass} {...register("title", { required: "Title required" })} />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select className={inputClass} {...register("Category", { required: "Category required" })}>
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>

          {errors.Category && <p className={errorClass}>{errors.Category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea rows="14" className={inputClass} {...register("Content", { required: "Content required" })} />

          {errors.Content && <p className={errorClass}>{errors.Content.message}</p>}
        </div>

        <button className={submitBtn}>Update Article</button>
      </form>
    </div>
  );
}

export default EditArticle;