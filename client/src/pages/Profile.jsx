import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import {
  Grid,
  List,
  Bookmark,
  CheckCircle2,
  MapPin,
  Calendar,
  Edit3,
  Users,
  Heart,
  MessageCircle,
  FolderPlus,
  Plus,
  Sparkles,
  Star,
  BarChart3,
  Sun,
  Moon,
} from 'lucide-react';
import { dummyConnectionsData } from '../assets/assets';

const Profile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    posts = [],
    stories = [],
    followers = [],
    following = [],
    connections = [],
    savedPostIds = [],
    collections = [],
    setIsEditProfileOpen,
    highlights = [],
    setActiveHighlight,
    setIsCreateHighlightOpen,
    closeFriendsList = [],
    toggleCloseFriend,
    accountType,
    darkMode,
    toggleDarkMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState('grid'); // 'grid', 'feed', 'saved'

  // Resolve user to display (searches across connections, followers, following, posts, stories)
  const allKnownUsers = [
    currentUser,
    ...dummyConnectionsData,
    ...(connections || []),
    ...(followers || []),
    ...(following || []),
    ...(posts || []).map((p) => p.user).filter(Boolean),
    ...(stories || []).map((s) => s.user).filter(Boolean),
  ];

  const targetUser = profileId
    ? allKnownUsers.find(
        (u) =>
          u._id === profileId ||
          u.username === profileId ||
          (u.username && u.username.toLowerCase() === profileId.toLowerCase())
      )
    : currentUser;

  const user = targetUser || currentUser;
  const isOwnProfile =
    !profileId ||
    (user._id && currentUser._id && user._id === currentUser._id) ||
    (user.username && currentUser.username && user.username === currentUser.username);

  const userPosts = posts.filter(
    (p) =>
      (p.user?._id && p.user?._id === user._id) ||
      (p.user?.username && p.user?.username === user.username)
  );
  const savedPosts = posts.filter((p) => savedPostIds.includes(p._id));

  // User story highlights
  const userHighlights = highlights.filter(
    (h) => h.user_id === user._id || h.user_id === user.username
  );

  return (
    <div className={`flex-1 min-h-screen pb-16 md:pb-12 transition-colors duration-300 ${
      darkMode ? 'ryzo-bg-dark text-slate-100' : 'ryzo-bg-olive text-slate-100'
    }`}>
      {/* ---------------- MOBILE INSTAGRAM PROFILE HEADER (< md) ---------------- */}
      <div className="md:hidden px-4 pt-3 pb-2 flex flex-col gap-3">
        {/* Mobile Username & Header Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-slate-100">
              {user.username}
            </span>
            {user.is_verified && (
              <CheckCircle2 className="size-4 text-amber-400 fill-slate-950" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full text-amber-400 bg-amber-950/40 border border-amber-500/30 active:scale-95"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/settings')}
                className="p-1.5 rounded-full text-slate-300 hover:text-white"
                title="Settings"
              >
                <Edit3 className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Row 1: Circular Avatar + 3-Column Stats */}
        <div className="flex items-center justify-between gap-4 pt-1">
          {/* Avatar with Story / Active Ring */}
          <div className="relative shrink-0">
            <div className="size-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-200 via-amber-400 to-amber-600 shadow-md shadow-amber-500/20">
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className="size-full rounded-full object-cover bg-slate-900"
              />
            </div>
          </div>

          {/* 3 Stats Columns (Posts, Followers, Following) */}
          <div className="flex-1 flex items-center justify-around text-center">
            <div className="flex flex-col">
              <span className="text-base font-black text-slate-50">{userPosts.length}</span>
              <span className="text-[11px] text-slate-300 font-medium">posts</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-slate-50">{followers.length}</span>
              <span className="text-[11px] text-slate-300 font-medium">followers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-slate-50">{following.length}</span>
              <span className="text-[11px] text-slate-300 font-medium">following</span>
            </div>
          </div>
        </div>

        {/* Row 2: Bio & Meta info */}
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-bold text-slate-50">{user.full_name}</span>
          {user.bio && (
            <p className="text-slate-200 leading-relaxed whitespace-pre-line">
              {user.bio}
            </p>
          )}
          {user.location && (
            <div className="flex items-center gap-1 text-slate-400 pt-0.5">
              <MapPin className="size-3 text-amber-400" />
              <span>{user.location}</span>
            </div>
          )}
        </div>

        {/* Row 3: Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {isOwnProfile ? (
            <>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold text-xs border border-slate-700/60 transition-all active:scale-95 text-center"
              >
                Edit profile
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold text-xs border border-slate-700/60 transition-all active:scale-95 text-center"
              >
                View archive
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 py-1.5 px-3 rounded-xl ryzo-btn-gold font-bold text-xs transition-all active:scale-95 text-center">
                Follow
              </button>
              <button
                onClick={() => navigate(`/messages/${user._id || user.username}`)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold text-xs border border-slate-700/60 transition-all active:scale-95 text-center"
              >
                Message
              </button>
            </>
          )}
        </div>

        {/* Row 4: Highlights Bar (Mobile) */}
        <div className="pt-2 overflow-x-auto no-scrollbar flex items-center gap-3">
          {isOwnProfile && (
            <div
              onClick={() => setIsCreateHighlightOpen(true)}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
            >
              <div className="size-14 rounded-full border border-slate-700/80 bg-slate-800/60 flex items-center justify-center">
                <Plus className="size-5 text-slate-300" />
              </div>
              <span className="text-[10px] font-medium text-slate-300">New</span>
            </div>
          )}
          {userHighlights.map((highlight) => (
            <div
              key={highlight._id}
              onClick={() => setActiveHighlight(highlight)}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
            >
              <div className="size-14 rounded-full p-[2px] bg-slate-700/80">
                <img
                  src={highlight.cover_image}
                  alt={highlight.title}
                  className="size-full rounded-full object-cover"
                />
              </div>
              <span className="text-[10px] font-medium text-slate-300 max-w-[56px] truncate text-center">
                {highlight.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- DESKTOP PROFILE HEADER (>= md) ---------------- */}
      <div className="hidden md:block">
        {/* Cover Photo */}
        <div className="h-48 sm:h-64 lg:h-72 w-full relative bg-gradient-to-r from-amber-900 via-amber-600 to-yellow-600 overflow-hidden">
          {user.cover_photo && (
            <img
              src={user.cover_photo}
              alt="Cover"
              className="size-full object-cover opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Profile Header Card */}
          <div className={`relative -mt-16 sm:-mt-20 mb-6 rounded-3xl p-6 shadow-2xl border transition-colors duration-300 ${
            darkMode ? 'ryzo-glass-panel border-amber-500/20' : 'ryzo-glass-olive-card border-amber-500/25'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              
              {/* Avatar & Verification Badge */}
              <div className="relative shrink-0">
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="size-28 sm:size-36 rounded-3xl object-cover ring-4 ring-amber-500/30 shadow-lg bg-slate-900"
                />
                {user.is_verified && (
                  <CheckCircle2 className="size-6 text-amber-500 fill-slate-950 absolute bottom-1 right-1 drop-shadow-md" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setIsEditProfileOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl ryzo-btn-gold font-bold text-xs shadow-md shadow-amber-500/30 hover:scale-[1.03] transition-all"
                    >
                      <Edit3 className="size-4" />
                      <span>Edit Profile</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/analytics')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs border transition-all ${
                        accountType === 'professional'
                          ? darkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-amber-950/50 text-amber-300 border-amber-500/30 hover:bg-amber-900/50'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      }`}
                    >
                      <BarChart3 className="size-4 text-amber-400" />
                      <span>{accountType === 'professional' ? 'Insights' : 'Insights 🔒'}</span>
                    </button>

                    {/* Dark & Olive Theme Switcher Control */}
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition-all bg-amber-950/60 text-amber-300 border-amber-500/40 hover:bg-amber-900/60 shadow-md shadow-amber-950/50"
                      title={darkMode ? 'Switch to Dark Olive Mode' : 'Switch to Midnight Mode'}
                    >
                      {darkMode ? (
                        <>
                          <Sun className="size-4 text-amber-400" />
                          <span>Olive Theme</span>
                        </>
                      ) : (
                        <>
                          <Moon className="size-4 text-amber-400" />
                          <span>Midnight Theme</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl ryzo-btn-gold font-bold text-xs shadow-md shadow-amber-500/30 hover:scale-[1.03] transition-all">
                      <Users className="size-4" />
                      <span>Connect</span>
                    </button>
                    <button
                      onClick={() => toggleCloseFriend(user._id || user.username)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all border ${
                        closeFriendsList.includes(user._id || user.username)
                          ? 'ryzo-btn-gold shadow-md shadow-amber-500/30'
                          : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/50'
                      }`}
                    >
                      <Star className={`size-4 ${closeFriendsList.includes(user._id || user.username) ? 'fill-slate-950' : 'text-amber-400'}`} />
                      <span>
                        {closeFriendsList.includes(user._id || user.username) ? 'Close Friend' : 'Add Close Friend'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Bio & Meta info */}
            <div className="flex flex-col gap-3">
              <div>
                <h1 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${
                  darkMode ? 'text-slate-50 drop-shadow-sm' : 'text-slate-100 drop-shadow-sm'
                }`}>
                  <span>{user.full_name}</span>
                </h1>
                <p className={`text-xs sm:text-sm font-medium ${
                  darkMode ? 'text-amber-300/90' : 'text-amber-300/80'
                }`}>@{user.username}</p>
              </div>

              {user.bio && (
                <p className="text-xs sm:text-sm leading-relaxed max-w-2xl whitespace-pre-line font-medium text-slate-200">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-1 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-amber-400" />
                  <span>{user.location || 'New York, NY'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4 text-amber-400" />
                  <span>Joined July 2025</span>
                </div>
              </div>

              {/* Statistics Bar */}
              <div className={`flex items-center gap-6 pt-4 border-t mt-2 ${
                darkMode ? 'border-amber-500/20' : 'border-amber-500/20'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base font-extrabold ${darkMode ? 'text-amber-300' : 'text-amber-400'}`}>
                    {userPosts.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">Posts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base font-extrabold ${darkMode ? 'text-amber-300' : 'text-amber-400'}`}>
                    {followers.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">Followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base font-extrabold ${darkMode ? 'text-amber-300' : 'text-amber-400'}`}>
                    {following.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">Following</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base font-extrabold ${darkMode ? 'text-amber-300' : 'text-amber-400'}`}>
                    {connections.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">Connections</span>
                </div>
              </div>

              {/* Story Highlights Bar (Desktop) */}
              <div className={`pt-5 border-t mt-3 ${darkMode ? 'border-amber-500/20' : 'border-amber-500/20'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                    <Sparkles className="size-3.5 text-amber-400" />
                    <span>Story Highlights</span>
                  </h3>
                </div>

                <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {/* Add New Highlight Button (For Own Profile) */}
                  {isOwnProfile && (
                    <div
                      onClick={() => setIsCreateHighlightOpen(true)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
                    >
                      <div className={`size-16 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                        darkMode
                          ? 'border-amber-500/40 bg-slate-900 group-hover:border-amber-400 group-hover:bg-amber-950/40'
                          : 'border-amber-500/40 bg-amber-950/30 group-hover:border-amber-400 group-hover:bg-amber-900/40'
                      }`}>
                        <Plus className="size-6 text-amber-400 transition-colors" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 group-hover:text-amber-300 transition-colors">
                        New
                      </span>
                    </div>
                  )}

                  {/* Highlight Covers List */}
                  {userHighlights.map((highlight) => (
                    <div
                      key={highlight._id}
                      onClick={() => setActiveHighlight(highlight)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
                    >
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600 shadow-xs group-hover:scale-105 transition-transform">
                        <div className="p-0.5 rounded-full bg-slate-900">
                          <img
                            src={highlight.cover_image}
                            alt={highlight.title}
                            className="size-15 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold transition-colors max-w-[72px] truncate text-center text-slate-100 group-hover:text-amber-300">
                        {highlight.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Instagram Mobile Style) */}
      <div className={`flex items-center justify-around mb-1 md:mb-6 border-b ${
        darkMode ? 'border-slate-800/80' : 'border-amber-500/20'
      }`}>
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all border-b-2 -mb-0.5 ${
            activeTab === 'grid'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Grid View"
        >
          <Grid className="size-5" />
          <span className="hidden sm:inline">POSTS</span>
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all border-b-2 -mb-0.5 ${
            activeTab === 'feed'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Feed View"
        >
          <List className="size-5" />
          <span className="hidden sm:inline">FEED</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all border-b-2 -mb-0.5 ${
              activeTab === 'saved'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            aria-label="Saved Posts"
          >
            <Bookmark className="size-5" />
            <span className="hidden sm:inline">SAVED</span>
          </button>
        )}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-2 md:gap-4 max-w-5xl mx-auto px-0 md:px-6">
          {userPosts.length === 0 ? (
            <div className={`col-span-full rounded-none md:rounded-3xl p-12 text-center text-slate-300 border-y md:border ${
              darkMode ? 'ryzo-glass-panel border-amber-500/20' : 'ryzo-glass-olive-card border-amber-500/20'
            }`}>
              <Grid className="size-10 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-semibold">No posts uploaded yet.</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <div
                key={post._id}
                onClick={() => setActiveTab('feed')}
                className="relative aspect-square rounded-none md:rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xs border-0 md:border md:border-amber-500/20"
              >
                {post.image_urls?.[0] ? (
                  <img
                    src={post.image_urls[0]}
                    alt="Post"
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="size-full p-2 sm:p-4 bg-amber-950/60 flex items-center justify-center text-amber-200 text-[10px] sm:text-xs font-bold text-center">
                    <span className="line-clamp-4">{post.content}</span>
                  </div>
                )}
                {/* Hover / Tap Overlay */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 sm:gap-4 text-white">
                  <div className="flex items-center gap-1 font-bold text-xs">
                    <Heart className="size-3.5 sm:size-4 fill-amber-400 text-amber-400" />
                    <span>{post.likes_count?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-xs">
                    <MessageCircle className="size-3.5 sm:size-4 fill-amber-400 text-amber-400" />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          {userPosts.length === 0 ? (
            <div className={`rounded-3xl p-12 text-center text-slate-300 border ${
              darkMode ? 'ryzo-glass-panel border-amber-500/20' : 'ryzo-glass-olive-card border-amber-500/20'
            }`}>
              <p className="text-sm font-semibold">No posts uploaded yet.</p>
            </div>
          ) : (
            userPosts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="flex flex-col gap-8">
          {/* Saved Collections Folder Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <FolderPlus className="size-4 text-amber-400" />
              <span>Saved Collections</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {collections.map((col) => (
                <div
                  key={col._id}
                  className={`rounded-3xl border p-4 shadow-xl transition-all flex flex-col gap-3 group cursor-pointer ${
                    darkMode ? 'ryzo-glass-panel border-amber-500/20' : 'ryzo-glass-olive-card border-amber-500/20'
                  }`}
                >
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/20">
                    <img
                      src={col.cover_image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200'}
                      alt={col.name}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {col.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      {col.posts?.length || 0} items
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Saved Posts */}
          <div className="max-w-xl mx-auto w-full flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Bookmark className="size-4 text-amber-400" />
              <span>All Saved Posts</span>
            </h3>
            {savedPosts.length === 0 ? (
              <div className={`rounded-3xl p-12 text-center text-slate-300 border ${
                darkMode ? 'ryzo-glass-panel border-amber-500/20' : 'ryzo-glass-olive-card border-amber-500/20'
              }`}>
                <Bookmark className="size-10 text-amber-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">No saved posts yet.</p>
                <p className="text-xs text-slate-300 mt-1">
                  Click the bookmark icon on posts to save them for later!
                </p>
              </div>
            ) : (
              savedPosts.map((post) => <PostCard key={post._id} post={post} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
