import React from 'react'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      role: 'USER',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profileImageURL: '',
    },
  })

  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview,setPreview] = useState()
  const [showPassword, setShowPassword] = useState(false)

  const onRegister = async (newUser) => {
    console.log('register user:', newUser)
    //create FormData object
        const formData = new FormData();
        //get user object
        let { role, profileImageURL, ...userObj } = newUser;
        console.log("role",role)
        console.log("profileImageURL",profileImageURL)
        //add all fields except profileImageURL to FormData object
        Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
        });
        // add profileImageURL to Formdata object when a file is present
        if (profileImageURL?.[0]) {
          formData.append("profileImageURL", profileImageURL[0]);
        }
    try{
      setLoading(true)

      const endpoint = role === "AUTHOR"
        ? "http://localhost:4000/author-api/users"
        : "http://localhost:4000/user-api/users"

      const res = await axios.post(endpoint, formData)
      console.log("res obj is ", res)

      if (res.status === 200 || res.status === 201) {
        navigate('/login', { replace: true })
      }
    }catch(err){
      console.log("err is ", err.message)
      setError(err.response?.data?.error || "Registration failed")
    }
    finally{
      setLoading(false)
    }
  }
  //cleanup (remove preview image form browser memory)
  useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
        }, [preview]);
        
  //if loading
  if(loading){
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-cyan-600 mx-auto'></div>
          <p className='text-sm font-medium text-slate-600'>Creating your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
      <div className='w-full max-w-2xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <p className='mb-2 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700'>Join Our Community</p>
          <h1 className='text-3xl font-black tracking-tight text-slate-900 sm:text-4xl'>Create Your Account</h1>
          <p className='mt-2 text-sm text-slate-600 sm:text-base'>Start sharing your stories with the world.</p>
        </div>

        {/* Form Card */}
        <form className='rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8' onSubmit={handleSubmit(onRegister)}>
          {/* Error Message */}
          {error && (
            <div className='mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'>
              <p className='font-semibold'>Registration Error</p>
              <p className='mt-1'>{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className='mb-7'>
            <label className='block text-sm font-semibold text-slate-900 mb-3'>Select Your Role</label>
            <div className='flex gap-4'>
              <label className='relative flex cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-200 px-4 py-3 transition hover:border-cyan-400 has-checked:border-cyan-600 has-checked:bg-cyan-50'>
                <input
                  type='radio'
                  value='USER'
                  className='h-4 w-4 cursor-pointer accent-cyan-600'
                  {...register('role', { required: '{Value} is an Invalid role', validate: v => ['USER', 'AUTHOR'].includes(v) || '{Value} is an Invalid role' })}
                />
                <p className='text-sm font-medium text-slate-900'>User</p>
              </label>

              <label className='relative flex cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-200 px-4 py-3 transition hover:border-cyan-400 has-checked:border-cyan-600 has-checked:bg-cyan-50'>
                <input
                  type='radio'
                  value='AUTHOR'
                  className='h-4 w-4 cursor-pointer accent-cyan-600'
                  {...register('role', { required: '{Value} is an Invalid role', validate: v => ['USER', 'AUTHOR'].includes(v) || '{Value} is an Invalid role' })}
                />
                <p className='text-sm font-medium text-slate-900'>Author</p>
              </label>
            </div>
            {errors.role?.message && (
              <p className='mt-2 text-xs font-medium text-red-600'>{errors.role.message}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label className='block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5'>First Name</label>
              <input
                className='w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition'
                type='text'
                placeholder='John'
                {...register('firstName', { required: 'First Name is required' })}
              />
              {errors.firstName?.message && (
                <p className='mt-1 text-xs font-medium text-red-600'>{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className='block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5'>Last Name</label>
              <input
                className='w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition'
                type='text'
                placeholder='Doe'
                {...register('lastName')}
              />
            </div>
          </div>

          {/* Email */}
          <div className='mb-6'>
            <label className='block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5'>Email Address</label>
            <input
              className='w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition'
              type='email'
              placeholder='you@example.com'
              {...register('email', {
                required: 'Email is required',
                pattern: { value: emailRegex, message: 'Enter a valid email address' },
              })}
            />
            {errors.email?.message && (
              <p className='mt-1 text-xs font-medium text-red-600'>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className='mb-6'>
            <label className='block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5'>Password</label>
            <div className='relative'>
              <input
                className='w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-12 text-sm placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <button
                type='button'
                onClick={() => setShowPassword((visible) => !visible)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                ) : (
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3.98 8.223A10.477 10.477 0 002.25 12c1.274 4.057 5.064 7 9.75 7 1.657 0 3.225-.377 4.634-1.049M6.607 6.607A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.46 10.46 0 01-4.507 5.592M9.879 9.879a3 3 0 104.242 4.242' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M1 1l22 22' />
                  </svg>
                )}
              </button>
            </div>
            {errors.password?.message && (
              <p className='mt-1 text-xs font-medium text-red-600'>{errors.password.message}</p>
            )}
          </div>

          {/* Profile Image */}
          <div className='mb-6'>
            <label className='block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-1.5'>Profile Picture</label>
            <div className='relative'>
              <input
                type='file'
                accept='image/png, image/jpeg'
                className='block w-full cursor-pointer rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-slate-400 transition'
                {...register('profileImageURL')}
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    if (!['image/jpeg', 'image/png'].includes(file.type)) {
                      setError('Only JPG or PNG allowed')
                      return
                    }
                    if (file.size > 2 * 1024 * 1024) {
                      setError('File size must be less than 2MB')
                      return
                    }
                    const previewUrl = URL.createObjectURL(file)
                    setPreview(previewUrl)
                    setError(null)
                  }
                }}
              />
              <p className='mt-2 text-xs text-slate-500'>PNG or JPG, max 2MB</p>
            </div>

            {preview && (
              <div className='mt-4 flex justify-center'>
                <div className='relative'>
                  <img
                    src={preview}
                    alt='Profile preview'
                    className='h-20 w-20 rounded-full border-2 border-cyan-200 object-cover'
                  />
                  <div className='absolute -bottom-1 -right-1 rounded-full bg-cyan-600 p-1'>
                    <svg className='h-3 w-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className='mt-8 flex gap-3'>
            <button
              type='submit'
              className='flex-1 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600/50'
            >
              Create Account
            </button>
          </div>

          {/* Login Link */}
          <p className='mt-6 text-center text-sm text-slate-600'>
            Already have an account?{' '}
            <Link to='/login' className='font-semibold text-cyan-600 transition hover:text-cyan-700'>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
export default Register