import React, { useState } from 'react'

function AddArticle() {
  const [articleData, setArticleData] = useState({
    author: "",
    title: "",
    Category: "",
    Content: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setArticleData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!articleData.author.trim()) {
      nextErrors.author = "Author ID is required";
    } else if (!/^[a-fA-F0-9]{24}$/.test(articleData.author.trim())) {
      nextErrors.author = "Author ID must be a valid ObjectId";
    }
    if (!articleData.title.trim()) {
      nextErrors.title = "Title is required";
    }
    if (!articleData.Category.trim()) {
      nextErrors.Category = "Category is required";
    }
    if (!articleData.Content.trim()) {
      nextErrors.Content = "Content is required";
    }

    setErrors(nextErrors);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h3 className='mb-2 text-center text-2xl font-bold text-slate-800 sm:text-3xl'>Create Article</h3>
        <p className="mb-8 text-center text-sm text-slate-500">Publish your story with a clear title and category</p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              name="author"
              value={articleData.author}
              onChange={handleChange}
              placeholder="Author ID"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            />
            {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
          </div>

          <div>
            <input
              type="text"
              name="title"
              value={articleData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <select
              name="Category"
              value={articleData.Category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500"
            >
              <option value="">Category</option>
            </select>
            {errors.Category && <p className="mt-1 text-sm text-red-600">{errors.Category}</p>}
          </div>

          <div>
            <textarea
              name="Content"
              value={articleData.Content}
              onChange={handleChange}
              rows={8}
              placeholder="Content"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            ></textarea>
            {errors.Content && <p className="mt-1 text-sm text-red-600">{errors.Content}</p>}
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-[#7CC8F1] px-8 py-3 text-lg font-semibold text-slate-900 shadow-md transition-colors hover:bg-[#6bb5db] sm:w-auto sm:self-center"
          >
            Publish Article
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddArticle