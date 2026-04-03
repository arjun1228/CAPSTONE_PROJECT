import React from 'react'
import { NavLink } from 'react-router'

function Header() {
  const navClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors sm:text-base ${isActive ? 'bg-cyan-600 text-white' : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'}`

  return (
    <header className='sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-10'>
      <nav className='mx-auto flex w-full max-w-7xl items-center justify-between'>
        <p className='text-xl font-black tracking-wide text-cyan-700 sm:text-2xl'>BLOGAPP</p>
        <ul className='flex items-center gap-2 sm:gap-3'>
          <li>
            <NavLink to="" className={navClass}>Home</NavLink>
          </li>
          <li>
            <NavLink to="register" className={navClass}>Register</NavLink>
          </li>
          <li>
            <NavLink to="login" className={navClass}>Login</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header