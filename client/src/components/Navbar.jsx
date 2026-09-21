import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'
import { assets } from '../assets/assets'
import {
  Home,
  Search,
  PlusSquare,
  Film,
  Heart,
  MessageCircle,
  Sparkles,
  X,
  LogOut
} from 'lucide-react'
import { useApp } from '../context/AppContext'


/* =========================================================
   MOBILE HEADER
========================================================= */

export const MobileHeader = () => {
  const {
    currentUser,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    darkMode,
    recentChats
  } = useApp()

  const navigate = useNavigate()
  const { signOut } = useClerk()

  /* =========================
     LOGOUT
  ========================= */

{/* Logout */}
<button
  type="button"
  onClick={handleLogout}
  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
    darkMode
      ? 'text-slate-300 hover:bg-red-500/10 hover:text-red-400'
      : 'text-slate-600 hover:bg-red-50 hover:text-red-500'
  }`}
  title="Logout"
>
  <LogOut className="h-5 w-5" />
</button>

  const handleLogout = async () => {
  try {
    console.log('Logout clicked')

    localStorage.removeItem('ryzo_demo_auth')
    localStorage.removeItem('ryzo_user_profile')

    await signOut({
      redirectUrl: '/login',
    })
  } catch (error) {
    console.error('Logout error:', error)
    navigate('/login', { replace: true })
  }
}

  /* =========================
     OPEN NOTIFICATIONS
  ========================= */

  const handleNotifications = () => {
    setIsNotificationsOpen(true)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${
        darkMode
          ? 'bg-slate-950/90 border-slate-800'
          : 'bg-white/90 border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src={assets.logo}
            alt="Ryzo"
            className="h-8 w-auto object-contain"
          />
        </NavLink>


        {/* Right Side */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <button
            type="button"
            onClick={handleNotifications}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
              darkMode
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className="h-5 w-5" />

            {unreadNotificationsCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadNotificationsCount > 99
                  ? '99+'
                  : unreadNotificationsCount}
              </span>
            )}
          </button>


          {/* Messages */}
          <button
            type="button"
            onClick={() => navigate('/messages')}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
              darkMode
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageCircle className="h-5 w-5" />

            {recentChats?.length > 0 && (
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
            )}
          </button>


          {/* Logout */}
          const handleMobileLogout = async () => {
  try {
    console.log('Mobile logout clicked')

    localStorage.removeItem('ryzo_demo_auth')
    localStorage.removeItem('ryzo_user_profile')

    await signOut({
      redirectUrl: '/login',
    })
  } catch (error) {
    console.error('Mobile logout error:', error)

    navigate('/login', { replace: true })
  }
}

        </div>
      </div>
    </header>
  )
}


/* =========================================================
   MOBILE BOTTOM NAVIGATION
========================================================= */

export const MobileBottomNav = () => {
  const {
    darkMode,
    currentUser,
    setIsNotificationsOpen,
    unreadNotificationsCount
  } = useApp()

  const navigate = useNavigate()

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      end: true
    },
    {
      path: '/discover',
      label: 'Discover',
      icon: Search
    },
    {
      path: '/create-post',
      label: 'Create',
      icon: PlusSquare
    },
    {
      path: '/reels',
      label: 'Reels',
      icon: Film
    },
    {
      path: '/messages',
      label: 'Messages',
      icon: MessageCircle
    }
  ]

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl md:hidden ${
        darkMode
          ? 'bg-slate-950/95 border-slate-800'
          : 'bg-white/95 border-slate-200'
      }`}
    >
      <div className="flex items-center justify-around px-2 py-2">

        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition ${
                  isActive
                    ? darkMode
                      ? 'text-white'
                      : 'text-slate-900'
                    : darkMode
                      ? 'text-slate-500'
                      : 'text-slate-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? 'stroke-[2.5]' : 'stroke-2'
                    }`}
                  />

                  <span className="text-[10px] font-medium">
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className={`absolute -bottom-1 h-1 w-1 rounded-full ${
                        darkMode ? 'bg-white' : 'bg-slate-900'
                      }`}
                    />
                  )}
                </>
              )}
            </NavLink>
          )
        })}

      </div>
    </nav>
  )
}


/* =========================================================
   DESKTOP NAVBAR
========================================================= */

const Navbar = () => {
  const {
    currentUser,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    darkMode
  } = useApp()

  const navigate = useNavigate()
  const { signOut } = useClerk()

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    try {
      localStorage.removeItem('ryzo_demo_auth')
      localStorage.removeItem('ryzo_user_profile')

      await signOut()

      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      end: true
    },
    {
      path: '/discover',
      label: 'Discover',
      icon: Search
    },
    {
      path: '/reels',
      label: 'Reels',
      icon: Film
    },
    {
      path: '/messages',
      label: 'Messages',
      icon: MessageCircle
    },
    {
      path: '/connections',
      label: 'Connections',
      icon: Sparkles
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: Search
    }
  ]

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-64 flex-col border-r ${
        darkMode
          ? 'bg-slate-950 border-slate-800'
          : 'bg-white border-slate-200'
      }`}
    >

      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <NavLink to="/">
          <img
            src={assets.logo}
            alt="Ryzo"
            className="h-9 w-auto object-contain"
          />
        </NavLink>
      </div>


      {/* Navigation */}
      <div className="flex-1 px-4 py-4">

        <div className="space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? darkMode
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-900'
                      : darkMode
                        ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}


          {/* Create Post */}
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? darkMode
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-900'
                  : darkMode
                    ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <PlusSquare className="h-5 w-5" />
            <span>Create Post</span>
          </NavLink>


          {/* Notifications */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className={`relative flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
              darkMode
                ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Heart className="h-5 w-5" />
            <span>Notifications</span>

            {unreadNotificationsCount > 0 && (
              <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {unreadNotificationsCount > 99
                  ? '99+'
                  : unreadNotificationsCount}
              </span>
            )}
          </button>

        </div>

      </div>


      {/* Bottom section */}
      <div className="border-t p-4">

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className={`mb-3 flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
            darkMode
              ? 'hover:bg-slate-900'
              : 'hover:bg-slate-50'
          }`}
        >

          <img
            src={
              currentUser?.profile_picture ||
              assets.default_avatar
            }
            alt={currentUser?.full_name || 'Profile'}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="min-w-0 flex-1">

            <p
              className={`truncate text-sm font-semibold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {currentUser?.full_name || 'User'}
            </p>

            <p
              className={`truncate text-xs ${
                darkMode ? 'text-slate-500' : 'text-slate-500'
              }`}
            >
              @{currentUser?.username || 'user'}
            </p>

          </div>

        </button>


        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            darkMode
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-red-500 hover:bg-red-50'
          }`}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  )
}

export default Navbar
