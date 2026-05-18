import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { errorClass, loadingClass } from '../styles/common'

function UserDashboard() {
  const navigate = useNavigate()
  const currentUser = useAuth(state => state.currentUser)
  const logout = useAuth(state => state.logout)

  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [error, setError] = useState(null)
  const [articles, setArticles] = useState([])

  const displayName = currentUser?.firstName || 'User'
  const profileImage = currentUser?.profileImageURL
  const profileInitial = displayName?.charAt(0)?.toUpperCase() || 'U'

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get('http://localhost:4000/user-api/articles')
        setArticles(res.data.payload || [])
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const onLogout = async () => {
    setLogoutLoading(true)
    await logout()
    setLogoutLoading(false)
    navigate('/login')
  }

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, { state: article })
  }

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>
  }

  if (error) {
    return <p className={errorClass}>{error}</p>
  }

  return (
    <section className='space-y-8'>
      <div className='flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6'>
        <div>
          <p className='text-sm font-medium uppercase tracking-wider text-cyan-700'>Dashboard</p>
          <h1 className='mt-1 text-2xl font-black text-slate-900 sm:text-3xl'>Welcome back, {displayName}</h1>
          <p className='mt-1 text-sm text-slate-600'>Discover the latest stories from all authors.</p>
        </div>

        <div className='flex items-center gap-3'>
          {profileImage ? (
            <img
              src={profileImage}
              alt={displayName}
              className='h-11 w-11 rounded-full border border-slate-300 object-cover'
            />
          ) : (
            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white'>
              {profileInitial}
            </div>
          )}

          <button
            type='button'
            className='rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60'
            onClick={onLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-bold tracking-tight text-slate-900'>Articles </h2>
        <p className='text-sm text-slate-600 sm:text-base'>A responsive collection of every published article.</p>
      </div>

      {articles.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center text-slate-500'>
          No articles found.
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {articles.map(article => {
            const category = article?.Category || 'General'
            const content = article?.Content || article?.content || ''
            const snippet = content ? `${content.slice(0, 120)}${content.length > 120 ? '...' : ''}` : 'Open this article to read more.'

            return (
              <article key={article._id} className='group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md'>
                <div className='mb-3 flex items-center justify-between gap-3'>
                  <span className='rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700'>
                    {category}
                  </span>
                 
                </div>

                <h3 className='line-clamp-2 text-lg font-bold leading-snug text-slate-900'>{article?.title || 'Untitled article'}</h3>
                <p className='mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600'>{snippet}</p>

                <div className='mt-5 flex items-center justify-between border-t border-slate-100 pt-4'>
                  <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600'>
                      {(article.author?.firstName?.charAt(0) || 'A').toUpperCase()}
                    </div>
                    <span>{article.author?.firstName || 'Unknown Author'} {article.author?.lastName || ''}</span>
                  </div>
                  <button
                    type='button'
                    onClick={() => openArticle(article)}
                    className='rounded-md bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-200 group-hover:text-cyan-800 text-center'
                  >
                    Read
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default UserDashboard