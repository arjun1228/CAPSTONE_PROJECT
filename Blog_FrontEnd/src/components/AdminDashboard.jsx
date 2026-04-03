import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../store/authStore'

function AdminDashboard() {
  const navigate = useNavigate()
  const currentUser = useAuth((state) => state.currentUser)
  const logout = useAuth((state) => state.logout)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState(null)
  const [actionLoadingEmail, setActionLoadingEmail] = useState(null)

  const displayName = currentUser?.firstName || 'Admin'
  const profileImage = currentUser?.profileImageURL
  const profileInitial = displayName?.charAt(0)?.toUpperCase() || 'A'

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true)
        setUsersError(null)

        const res = await axios.get('/admin-api/users')
        setUsers(res.data.payload || [])
      } catch (err) {
        setUsersError(err.response?.data?.message || err.response?.data?.error || 'Failed to load users')
      } finally {
        setUsersLoading(false)
      }
    }

    loadUsers()
  }, [])

  const refreshUsers = async () => {
    const res = await axios.get('/admin-api/users')
    setUsers(res.data.payload || [])
  }

  const updateUserStatus = async (email, action) => {
    try {
      setActionLoadingEmail(email)
      await axios.put(`/admin-api/${action}`, { email })
      toast.success(`User ${action === 'block' ? 'blocked' : 'unblocked'} successfully`)
      await refreshUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Action failed')
    } finally {
      setActionLoadingEmail(null)
    }
  }

  const onLogout = async () => {
    setLogoutLoading(true)
    await logout()
    setLogoutLoading(false)
    navigate('/login')
  }

  return (
    <section className='space-y-8'>
      <div className='flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6'>
        <div>
          <p className='text-sm font-medium uppercase tracking-wider text-cyan-700'>Admin Dashboard</p>
          <h1 className='mt-1 text-2xl font-black text-slate-900 sm:text-3xl'>Welcome back, {displayName}</h1>
          <p className='mt-1 text-sm text-slate-600'>Manage users, articles, and platform activity from here.</p>
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

      <div className='rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-6'>
        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-medium uppercase tracking-wider text-cyan-700'>Users</p>
            <h2 className='mt-1 text-2xl font-black text-slate-900'>Manage users</h2>
          </div>
          <p className='text-sm text-slate-600'>Block or unblock users from this table.</p>
        </div>

        {usersLoading ? (
          <div className='rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500'>Loading users...</div>
        ) : usersError ? (
          <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'>{usersError}</div>
        ) : users.length === 0 ? (
          <div className='rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500'>No users found.</div>
        ) : (
          <div className='overflow-hidden rounded-2xl border border-slate-200'>
            <div className='grid grid-cols-[1.4fr_1fr_0.7fr_1fr] gap-0 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500'>
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span className='text-right'>Action</span>
            </div>

            <div className='divide-y divide-slate-200 bg-white'>
              {users.map((user) => {
                const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
                const userInitial = (user.firstName || user.email || 'U').charAt(0).toUpperCase()

                return (
                  <div key={user._id} className='grid grid-cols-[1.4fr_1fr_0.7fr_1fr] items-center gap-3 px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      {user.profileImageURL ? (
                        <img
                          src={user.profileImageURL}
                          alt={userName}
                          className='h-10 w-10 rounded-full border border-slate-200 object-cover'
                        />
                      ) : (
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white'>
                          {userInitial}
                        </div>
                      )}

                      <div className='min-w-0'>
                        <p className='truncate text-sm font-semibold text-slate-900'>{userName}</p>
                        <p className='truncate text-xs text-slate-500'>{user.email}</p>
                      </div>
                    </div>

                    <span className='text-sm font-medium text-slate-700'>{user.role}</span>

                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>

                    <div className='flex justify-end gap-2'>
                      {user.isActive ? (
                        <button
                          type='button'
                          onClick={() => updateUserStatus(user.email, 'block')}
                          disabled={actionLoadingEmail === user.email}
                          className='rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                          {actionLoadingEmail === user.email ? 'Processing...' : 'Block'}
                        </button>
                      ) : (
                        <button
                          type='button'
                          onClick={() => updateUserStatus(user.email, 'unblock')}
                          disabled={actionLoadingEmail === user.email}
                          className='rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                          {actionLoadingEmail === user.email ? 'Processing...' : 'Unblock'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminDashboard