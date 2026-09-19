import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { assets } from '../assets/assets';
import {
  Home,
  Search,
  Heart,
  Plus,
  PlusSquare,
  Film,
  Menu,
  Settings,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  Bookmark,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Exact Instagram Camera Logo Glyph
const InstagramLogoGlyph = ({ className = "size-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
  </svg>
);

// Exact Instagram Reels Icon
const ReelsIcon = ({ className = "size-6", active = false }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={active ? "2.5" : "2"}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    <line x1="7" y1="3" x2="9" y2="7.5" />
    <line x1="15" y1="3" x2="17" y2="7.5" />
  </svg>
);

// Exact Instagram Messages Paper Airplane Icon
const MessagesIcon = ({ className = "size-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// Exact Instagram Dashboard Icon (Bar chart inside rounded rect)
const DashboardIcon = ({ className = "size-6", active = false }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={active ? "2.5" : "2"}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <line x1="8" y1="16" x2="8" y2="12" />
    <line x1="12" y1="16" x2="12" y2="9" />
    <line x1="16" y1="16" x2="16" y2="14" />
  </svg>
);

const Sidebar = () => {
  let user = null;
  try {
    const clerk = useUser();
    user = clerk?.user;
  } catch (e) {
    user = null;
  }

  const {
    currentUser,
    setIsCreatePostOpen,
    setIsCreateStoryOpen,
    setIsDemoAuthenticated,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    darkMode,
    setDarkMode,
    recentChats,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const isReels = location.pathname.startsWith('/reels');

  const [isHovered, setIsHovered] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const leaveTimeoutRef = useRef(null);
  const sidebarRef = useRef(null);
  const moreRef = useRef(null);
  const createRef = useRef(null);

  const unreadMessagesCount = (recentChats || []).filter(
    (c) => c && !c.seen && c.to_user_id?._id === currentUser?._id
  ).length;

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsMoreOpen(false);
      setIsCreateOpen(false);
    }, 200);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
      if (createRef.current && !createRef.current.contains(e.target)) {
        setIsCreateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // On Reels: expand on hover, collapse when cursor leaves
  // On other pages: expanded on wide desktop (xl), collapsed on medium (md) unless hovered
  const isExpanded = isReels ? isHovered : (isHovered || false);

  return (
    <aside
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen z-50 py-5 select-none transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
        isExpanded ? 'w-60 shadow-2xl' : 'w-[72px]'
      } ${
        darkMode
          ? 'bg-black border-r border-zinc-800 text-white'
          : 'bg-black border-r border-zinc-800 text-white'
      }`}
    >
      {/* Top Branding & Main Navigation Links */}
      <div className="flex flex-col gap-1 w-full px-3">
        {/* Top Ryzo Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className={`flex items-center h-12 rounded-xl cursor-pointer hover:bg-white/10 transition-colors mb-4 ${
            isExpanded ? 'px-3 gap-3.5' : 'justify-center px-0'
          }`}
          title="Ryzo"
        >
          <img
            src={assets.logo}
            alt="Ryzo"
            className="size-7 object-contain filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] shrink-0"
          />
          {isExpanded && (
            <div className="flex flex-col whitespace-nowrap animate-in fade-in duration-200">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Ryzo
              </span>
              <span className="text-[10px] text-amber-400/80 font-medium -mt-1 tracking-widest uppercase">
                Social Hub
              </span>
            </div>
          )}
        </div>

        {/* 1. Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center h-12 rounded-xl transition-colors group cursor-pointer ${
              isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
            } ${isActive ? 'font-bold text-white' : 'text-slate-200 hover:bg-white/10'}`
          }
        >
          {({ isActive }) => (
            <>
              <Home
                className={`size-6 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                  isActive ? 'stroke-[2.5] text-white' : 'stroke-[2] text-slate-200'
                }`}
              />
              {isExpanded && (
                <span className={`text-sm tracking-wide whitespace-nowrap ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  Home
                </span>
              )}
            </>
          )}
        </NavLink>

        {/* 2. Reels */}
        <NavLink
          to="/reels"
          className={({ isActive }) =>
            `flex items-center h-12 rounded-xl transition-colors group cursor-pointer ${
              isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
            } ${isActive ? 'font-bold text-white' : 'text-slate-200 hover:bg-white/10'}`
          }
        >
          {({ isActive }) => (
            <>
              <ReelsIcon
                active={isActive}
                className="size-6 shrink-0 transition-transform duration-150 group-hover:scale-105 text-white"
              />
              {isExpanded && (
                <span className={`text-sm tracking-wide whitespace-nowrap ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  Reels
                </span>
              )}
            </>
          )}
        </NavLink>

        {/* 3. Messages */}
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex items-center h-12 rounded-xl transition-colors group cursor-pointer ${
              isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
            } ${isActive ? 'font-bold text-white' : 'text-slate-200 hover:bg-white/10'}`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative shrink-0">
                <MessagesIcon
                  className={`size-6 transition-transform duration-150 group-hover:scale-105 ${
                    isActive ? 'stroke-[2.5] text-white' : 'stroke-[2] text-slate-200'
                  }`}
                />
                <span className="absolute -top-1.5 -right-2 bg-[#ff3040] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-md">
                  {unreadMessagesCount > 0 ? unreadMessagesCount : 1}
                </span>
              </div>
              {isExpanded && (
                <span className={`text-sm tracking-wide whitespace-nowrap ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  Messages
                </span>
              )}
            </>
          )}
        </NavLink>

        {/* 4. Search */}
        <NavLink
          to="/discover"
          className={({ isActive }) =>
            `flex items-center h-12 rounded-xl transition-colors group cursor-pointer ${
              isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
            } ${isActive ? 'font-bold text-white' : 'text-slate-200 hover:bg-white/10'}`
          }
        >
          {({ isActive }) => (
            <>
              <Search
                className={`size-6 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                  isActive ? 'stroke-[2.5] text-white' : 'stroke-[2] text-slate-200'
                }`}
              />
              {isExpanded && (
                <span className={`text-sm tracking-wide whitespace-nowrap ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  Search
                </span>
              )}
            </>
          )}
        </NavLink>

        {/* 5. Notifications */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className={`flex items-center h-12 rounded-xl transition-colors group cursor-pointer text-left ${
            isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
          } text-slate-200 hover:bg-white/10`}
        >
          <div className="relative shrink-0">
            <Heart className="size-6 stroke-[2] transition-transform duration-150 group-hover:scale-105 text-slate-200 group-hover:text-rose-400" />
            <span className="absolute top-0 right-0 size-2 bg-[#ff3040] rounded-full ring-2 ring-black" />
          </div>
          {isExpanded && (
            <span className="text-sm font-medium tracking-wide whitespace-nowrap">
              Notifications
            </span>
          )}
        </button>

        {/* 6. Create */}
        <div ref={createRef} className="relative w-full">
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className={`flex items-center h-12 rounded-xl transition-colors group cursor-pointer text-left ${
              isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
            } text-slate-200 hover:bg-white/10 ${isCreateOpen ? 'bg-white/15 text-white font-bold' : ''}`}
          >
            <Plus className="size-6 stroke-[2.5] shrink-0 transition-transform duration-150 group-hover:scale-110 text-slate-200" />
            {isExpanded && (
              <span className="text-sm font-medium tracking-wide whitespace-nowrap">
                Create
              </span>
            )}
          </button>

          {/* Create Menu Dropdown */}
          {isCreateOpen && (
            <div className={`absolute ${isExpanded ? 'left-full ml-2' : 'left-full ml-3'} -top-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150`}>
              <button
                onClick={() => {
                  setIsCreatePostOpen(true);
                  setIsCreateOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-colors w-full text-left"
              >
                <PlusSquare className="size-4.5 text-amber-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Post</span>
                  <span className="text-[10px] text-slate-400">Share photo or text</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsCreateStoryOpen(true);
                  setIsCreateOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-colors w-full text-left"
              >
                <Sparkles className="size-4.5 text-indigo-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Story</span>
                  <span className="text-[10px] text-slate-400">Add photo, video, or text</span>
                </div>
              </button>

              <button
                onClick={() => {
                  navigate('/reels');
                  setIsCreateOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-colors w-full text-left"
              >
                <Film className="size-4.5 text-rose-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Reel</span>
                  <span className="text-[10px] text-slate-400">Short video clip</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 7. Dashboard */}
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center h-12 rounded-xl transition-colors group cursor-pointer ${
              isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
            } ${isActive ? 'font-bold text-white' : 'text-slate-200 hover:bg-white/10'}`
          }
        >
          {({ isActive }) => (
            <>
              <DashboardIcon
                active={isActive}
                className="size-6 shrink-0 transition-transform duration-150 group-hover:scale-105 text-white"
              />
              {isExpanded && (
                <span className={`text-sm tracking-wide whitespace-nowrap ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  Dashboard
                </span>
              )}
            </>
          )}
        </NavLink>

        {/* 8. Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center h-12 rounded-xl transition-colors group cursor-pointer ${
              isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
            } ${isActive ? 'font-bold text-white' : 'text-slate-200 hover:bg-white/10'}`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={currentUser?.profile_picture || user?.imageUrl || assets.sample_profile}
                alt="Profile"
                className={`size-6 rounded-full object-cover shrink-0 transition-all duration-150 group-hover:scale-105 ${
                  isActive ? 'ring-2 ring-white' : 'ring-1 ring-white/40'
                }`}
              />
              {isExpanded && (
                <span className={`text-sm tracking-wide whitespace-nowrap ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  Profile
                </span>
              )}
            </>
          )}
        </NavLink>
      </div>

      {/* Bottom "More" Button & Popover Menu */}
      <div ref={moreRef} className="relative w-full px-3">
        {/* Instagram More Popover Menu */}
        {isMoreOpen && (
          <div className="absolute bottom-16 left-3 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl z-50 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              onClick={() => {
                navigate('/settings');
                setIsMoreOpen(false);
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-sm font-medium text-slate-200 hover:text-white transition-colors w-full text-left"
            >
              <Settings className="size-4.5 text-slate-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setIsCreateStoryOpen(true);
                setIsMoreOpen(false);
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-sm font-medium text-slate-200 hover:text-white transition-colors w-full text-left"
            >
              <Sparkles className="size-4.5 text-amber-400" />
              <span>Add to Story</span>
            </button>

            <button
              onClick={() => {
                setDarkMode(!darkMode);
              }}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-sm font-medium text-slate-200 hover:text-white transition-colors w-full text-left"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Sun className="size-4.5 text-amber-400" /> : <Moon className="size-4.5 text-indigo-400" />}
                <span>Switch appearance</span>
              </div>
            </button>

            <div className="h-px bg-zinc-800 my-1" />

            <button
              onClick={() => {
                setIsDemoAuthenticated(false);
                setIsMoreOpen(false);
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-rose-500/20 text-sm font-medium text-rose-400 transition-colors w-full text-left"
            >
              <LogOut className="size-4.5 text-rose-400" />
              <span>Log out</span>
            </button>
          </div>
        )}

        {/* More Button */}
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`flex items-center h-12 rounded-xl transition-colors group cursor-pointer text-left ${
            isExpanded ? 'px-3 gap-4 w-full' : 'justify-center px-0 w-full'
          } ${isMoreOpen ? 'bg-white/10 font-bold text-white' : 'text-slate-200 hover:bg-white/10'}`}
          title="More"
        >
          <Menu className="size-6 stroke-[2] shrink-0 transition-transform duration-150 group-hover:scale-105 text-white" />
          {isExpanded && (
            <span className="text-sm font-medium tracking-wide whitespace-nowrap">
              More
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
