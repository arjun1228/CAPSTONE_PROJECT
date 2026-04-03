import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../store/authStore'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)

  const {register,handleSubmit,formState: { errors }} = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Zustand store
  const login = useAuth(state => state.login)
  const error = useAuth(state => state.error)

  const onLogin = async (userLoginObj) => {
    await login(userLoginObj)

    const { isAuthenticated: authed, currentUser: loggedInUser } = useAuth.getState()
    if (!authed) return

    const fromPath = location.state?.from?.pathname
    if (fromPath && fromPath !== '/login') {
      navigate(fromPath, { replace: true })
      return
    }

    if (loggedInUser?.role === 'AUTHOR') {
      navigate('/authordashboard')
      return
    }

    if (loggedInUser?.role === 'ADMIN') {
      navigate('/admindashboard')
      return
    }

    navigate('/userdashboard')
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <p className='mb-2 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700'>Welcome Back</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900 sm:text-4xl'>Sign In</h1>
          <p className='mt-2 text-sm text-slate-600 sm:text-base'>Access your blog dashboard and continue reading.</p>
        </div>

        {/* Form Card */}
        <form className='rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8' onSubmit={handleSubmit(onLogin)}>
          {/* Error Message */}
          {error && (
            <div className='mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'>
              <p className='font-semibold'>Login Error</p>
              <p className='mt-1'>{error}</p>
            </div>
          )}

          {/* Email */}
          <div className='mb-6'>
            <label className='block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5'>Email Address</label>
            <input
              className='w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition'
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email required',
                pattern: {
                  value: emailRegex,
                  message: 'Invalid email format'
                }
              })}
            />
            {errors.email?.message && (
              <p className='mt-1 text-xs font-medium text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='mb-6'>
            <label className='block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5'>Password</label>
            <div className='relative'>
              <input
                className='w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition'
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register('password', { required: 'Password required' })}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition'
              >
                {showPassword ? (
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                ) : (
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                )}
              </button>
            </div>
            {errors.password?.message && (
              <p className='mt-1 text-xs font-medium text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className='w-full rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 mt-8'
          >
            Sign In
          </button>

          {/* Register Link */}
          <p className='mt-6 text-center text-sm text-slate-600'>
            Don't have an account?{' '}
            <Link to='/register' className='font-semibold text-cyan-600 transition hover:text-cyan-700'>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login