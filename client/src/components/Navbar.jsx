import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Home, Search, PlusSquare, Film, Heart, MessageCircle, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileHeader = () => {
  const {
    currentUser,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    darkMode,
    recentChats,
  } = useApp();
  const navigate = useNavigate();

  const unreadMessagesCount = (recentChats || []).filter(
    (c) => c && !c.seen && c.to_user_id?._id === currentUser?._id
  ).length;

  return (
    <header className={`md:hidden sticky top-0 z-40 backdrop-blur-xl border-b h-14 px-4 flex items-center justify-between transition-colors duration-300 ${
      darkMode
        ? 'bg-slate-900/95 border-slate-800/80 text-slate-100 shadow-lg'
        : 'bg-[#152316]/95 border-amber-500/20 text-slate-100 shadow-md'
    }`}>
      {/* Brand Logo & Name */}
      <div 
        onClick={() => {
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <img
          src={assets.logo}
          alt="Ryzo Logo"
          className="size-8 object-contain transition-transform group-hover:scale-105"
        />
        <span className="text-xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-sm font-sans uppercase">
          Ryzo
        </span>
      </div>

      {/* Right Actions: Notifications & Direct Messages */}
      <div className="flex items-center gap-3">
        {/* Heart Notifications */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-1 text-slate-200 hover:text-amber-400 active:scale-95 transition-all"
          aria-label="Notifications"
        >
          <Heart className="size-6 stroke-[2]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-0.5 right-0.5 size-2 bg-rose-500 rounded-full ring-2 ring-black animate-pulse" />
          )}
        </button>

        {/* Messages Direct Link */}
        <button
          onClick={() => navigate('/messages')}
          className="relative p-1 text-slate-200 hover:text-amber-400 active:scale-95 transition-all"
          aria-label="Direct Messages"
        >
          <MessageCircle className="size-6 stroke-[2]" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center ring-2 ring-black">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export const MobileBottomNav = () => {
  const { setIsCreatePostOpen, setIsCreateStoryOpen, currentUser, darkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <>
      {/* Mobile Create Popup Sheet */}
      {showCreateMenu && (
        <div 
          onClick={() => setShowCreateMenu(false)}
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-3 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-4 shadow-2xl flex flex-col gap-2 mb-16 animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-sm font-bold text-white">Create New</span>
              <button
                onClick={() => setShowCreateMenu(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <button
              onClick={() => {
                setShowCreateMenu(false);
                setIsCreatePostOpen(true);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 active:bg-white/15 text-left transition-colors"
            >
              <div className="size-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <PlusSquare className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Post</span>
                <span className="text-xs text-slate-400">Share photo or text post</span>
              </div>
            </button>

            <button
              onClick={() => {
                setShowCreateMenu(false);
                setIsCreateStoryOpen(true);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 active:bg-white/15 text-left transition-colors"
            >
              <div className="size-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Story</span>
                <span className="text-xs text-slate-400">Add photo, video, or text story</span>
              </div>
            </button>

            <button
              onClick={() => {
                setShowCreateMenu(false);
                navigate('/reels');
              }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 active:bg-white/15 text-left transition-colors"
            >
              <div className="size-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Film className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Reel</span>
                <span className="text-xs text-slate-400">Watch or create video reels</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t h-14 px-3 flex items-center justify-around pb-safe select-none transition-colors duration-300 ${
        darkMode
          ? 'bg-slate-900/95 border-slate-800/80 text-slate-100 shadow-2xl'
          : 'bg-[#152316]/95 border-amber-500/20 text-slate-100 shadow-2xl'
      }`}>
        {/* 1. Home / Feed */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center justify-center p-2 rounded-xl transition-all active:scale-90 ${
              isActive
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
          aria-label="Feed"
        >
          {({ isActive }) => (
            <Home className={`size-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          )}
        </NavLink>

        {/* 2. Search / Explore */}
        <NavLink
          to="/discover"
          className={({ isActive }) =>
            `flex items-center justify-center p-2 rounded-xl transition-all active:scale-90 ${
              isActive
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
          aria-label="Explore"
        >
          {({ isActive }) => (
            <Search className={`size-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          )}
        </NavLink>

        {/* 3. Create Button (Post / Story / Reel) */}
        <button
          onClick={() => setShowCreateMenu(!showCreateMenu)}
          className={`flex items-center justify-center p-1.5 rounded-xl transition-all active:scale-90 ${
            darkMode
              ? 'text-amber-400 hover:text-amber-300'
              : 'text-amber-400 hover:text-amber-300'
          }`}
          aria-label="Create Post or Story"
        >
          <div className="size-8 rounded-lg border-2 border-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20">
            <PlusSquare className="size-5 text-amber-400 stroke-[2.2]" />
          </div>
        </button>

        {/* 4. Reels */}
        <NavLink
          to="/reels"
          className={({ isActive }) =>
            `flex items-center justify-center p-2 rounded-xl transition-all active:scale-90 ${
              isActive
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
          aria-label="Reels"
        >
          {({ isActive }) => (
            <Film className={`size-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          )}
        </NavLink>

        {/* 5. Profile */}
        <NavLink
          to="/profile"
          className="flex items-center justify-center p-1.5 rounded-xl transition-all active:scale-90"
          aria-label="Profile"
        >
          <div className={`size-7 rounded-full p-[1.5px] transition-all ${
            isProfileActive
              ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-105'
              : 'opacity-85 hover:opacity-100 ring-1 ring-white/20'
          }`}>
            <img
              src={currentUser?.profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'}
              alt={currentUser?.full_name || 'Profile'}
              className="size-full rounded-full object-cover"
            />
          </div>
        </NavLink>
      </nav>
    </>
  );
};

export default MobileHeader;

