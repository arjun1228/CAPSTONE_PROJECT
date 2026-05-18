import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import { useAuth } from '../store/authStore'
import { useEffect } from 'react'
import { useRef } from 'react'

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth)
  const loading = useAuth((state) => state.loading)
  const isAuthChecked = useAuth((state) => state.isAuthChecked)
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const currentUser = useAuth((state) => state.currentUser)
  const didCheckAuth = useRef(false)

  useEffect(() => {
    if (!isAuthenticated && !currentUser) {
      useAuth.setState({ isAuthChecked: true, loading: false })
      return
    }

    if (didCheckAuth.current) return
    didCheckAuth.current = true
    checkAuth()
  }, [checkAuth, currentUser, isAuthenticated])
  if (!isAuthChecked || loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50'>
        <p className='rounded-md bg-slate-800 px-6 py-3 text-sm font-medium text-white shadow-lg'>Checking access...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-linear-to-br  text-slate-900'>
      <Header />
      <main className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout