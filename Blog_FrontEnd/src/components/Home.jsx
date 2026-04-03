import React from 'react'

function Home() {
  const userTypes = [
    {
      title: 'User',
      value: 'USER',
      description: 'Reads articles and leaves comments.',
    },
    {
      title: 'Author',
      value: 'AUTHOR',
      description: 'Writes, edits, and manages their own articles.',
    },
    {
      title: 'Admin',
      value: 'ADMIN',
      description: 'Manages users and keeps the platform in order.',
    },
  ]

  return (
    <div className='mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-8 text-center'>
        <p className='mb-3 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700'>Blog App</p>
        <h1 className='text-4xl font-black tracking-tight text-slate-900 sm:text-6xl'>Home</h1>
        <p className='mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base'>
          The app supports three user types, each with different responsibilities.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {userTypes.map((userType) => (
          <div
            key={userType.value}
            className='rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
          >
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700'>{userType.value}</p>
            <h2 className='mt-2 text-2xl font-bold text-slate-900'>{userType.title}</h2>
            <p className='mt-3 text-sm leading-6 text-slate-600'>{userType.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home