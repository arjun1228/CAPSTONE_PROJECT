import { NavLink, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../store/authStore";
import { pageWrapper, navLinksClass, navLinkClass, navLinkActiveClass, divider } from "../styles/common";

function AuthorProfile() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const displayName = user?.firstName || 'Author'
  const profileImage = user?.profileImageURL
  const profileInitial = displayName?.charAt(0)?.toUpperCase() || 'A'

  const onLogout = async () => {
    setLogoutLoading(true)
    await logout()
    setLogoutLoading(false)
    navigate('/login')
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      {/* Welcome Greeting Section */}
      <div className='flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6'>
        <div>
          <p className='text-sm font-medium uppercase tracking-wider text-cyan-700'>Dashboard</p>
          <h1 className='mt-1 text-2xl font-black text-slate-900 sm:text-3xl'>Welcome back, {displayName}</h1>
          <p className='mt-1 text-sm text-slate-600'>Start writing and share your stories with the world.</p>
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

      {/* Author Navigation */}
      <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-4">
        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive
              ? "rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
              : "rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive
              ? "rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
              : "rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          }
        >
          Write Article
        </NavLink>
      </div>

      {/* Nested route content */}
      <Outlet />
    </div>
  );
}

export default AuthorProfile;