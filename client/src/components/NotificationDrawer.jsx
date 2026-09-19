import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Flame,
  X,
  CheckCheck,
  Bell,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NotificationDrawer = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    following,
    toggleFollowUser,
    posts,
    stories,
    setActiveStoryIndex,
    setActiveCommentPost,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  if (!isNotificationsOpen) return null;

  // Filter notifications by category tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'likes') return item.type === 'like';
    if (activeTab === 'comments') return item.type === 'comment' || item.type === 'mention';
    if (activeTab === 'follows') return item.type === 'follow';
    if (activeTab === 'reactions') return item.type === 'story_reaction';
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="size-3.5 fill-rose-500 text-rose-500" />;
      case 'comment':
      case 'mention':
        return <MessageCircle className="size-3.5 fill-indigo-500 text-indigo-500" />;
      case 'follow':
        return <UserPlus className="size-3.5 text-purple-600" />;
      case 'story_reaction':
        return <Flame className="size-3.5 fill-amber-500 text-amber-500" />;
      default:
        return <Bell className="size-3.5 text-slate-500" />;
    }
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleNotificationClick = (item) => {
    markNotificationAsRead(item._id);
    setIsNotificationsOpen(false);

    // 1. Story Reaction: Open StoryViewer for story content
    if (item.type === 'story_reaction' || item.story_id || item.story_preview) {
      const storyIdx = stories.findIndex(
        (s) => s._id === item.story_id || s.user?._id === item.sender?._id
      );
      setActiveStoryIndex(storyIdx > -1 ? storyIdx : 0);
      return;
    }

    // 2. Likes, Comments & Mentions: Redirect to Feed & scroll/open target post
    if (
      item.type === 'like' ||
      item.type === 'comment' ||
      item.type === 'mention' ||
      item.post_id ||
      item.post_preview
    ) {
      const targetPost = posts.find((p) => p._id === item.post_id) || {
        _id: item.post_id || 'post_' + Date.now(),
        user: item.sender || currentUser,
        content: item.text || 'Post content',
        image_urls: item.post_preview ? [item.post_preview] : [],
        post_type: item.post_preview ? 'image' : 'text',
        likes_count: [item.sender?._id || 'user_2'],
        comments: [
          {
            _id: 'c_' + Date.now(),
            user: item.sender,
            text: item.text || 'Liked/Commented on your post!',
            createdAt: item.createdAt,
          },
        ],
        createdAt: item.createdAt,
      };

      // Navigate to main feed first
      navigate('/');

      // Open comment modal & smooth scroll to the target post on feed
      setTimeout(() => {
        setActiveCommentPost(targetPost);
        const postElement = document.getElementById(`post-${targetPost._id}`);
        if (postElement) {
          postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }


    // 3. Follow Notifications: Navigate to user profile
    if (item.sender?._id) {
      navigate(`/profile/${item.sender._id}`);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop overlay listener to close */}
      <div className="absolute inset-0" onClick={() => setIsNotificationsOpen(false)} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-100 z-10 animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 text-white shadow-md shadow-rose-200">
              <Heart className="size-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Notifications & Activity
                {unreadNotificationsCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                    {unreadNotificationsCount} new
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Stay updated with likes, mentions & followers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Mark all as read"
              >
                <CheckCheck className="size-4 text-indigo-600" />
                <span className="hidden sm:inline">Read all</span>
              </button>
            )}

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Categorized Activity Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-white overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', icon: Sparkles },
            { id: 'likes', label: 'Likes ❤️', icon: Heart },
            { id: 'comments', label: 'Comments 💬', icon: MessageCircle },
            { id: 'follows', label: 'Follows 👤', icon: UserPlus },
            { id: 'reactions', label: 'Reactions 🔥', icon: Flame },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 scale-105'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Notifications Activity List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <div className="p-4 rounded-full bg-indigo-50 text-indigo-500 mb-3">
                <Bell className="size-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Notifications Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                When people like your posts, leave comments, or follow you, you'll see activity here!
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isFollowingUser = following.some((u) => u._id === item.sender?._id);

              return (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                    !item.read
                      ? 'bg-gradient-to-r from-indigo-50/60 to-purple-50/40 hover:from-indigo-100/60 hover:to-purple-100/40'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Unread blue dot indicator */}
                  {!item.read && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 size-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                  )}

                  {/* Sender Avatar & Action Badge Overlay */}
                  <div className="relative shrink-0">
                    <img
                      src={item.sender?.profile_picture}
                      alt={item.sender?.full_name}
                      className="size-11 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-md border border-slate-100">
                      {getNotificationIcon(item.type)}
                    </div>
                  </div>

                  {/* Notification Content Body */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-800 leading-snug">
                      <span className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors mr-1">
                        @{item.sender?.username || 'user'}
                      </span>
                      <span>{item.text}</span>
                    </p>

                    <span className="text-[10px] text-slate-400 font-semibold mt-1 inline-block">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  {/* Action / Preview Side Slot */}
                  <div className="shrink-0 flex items-center">
                    {item.type === 'follow' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.sender?._id) {
                            toggleFollowUser(item.sender._id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                          isFollowingUser
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                        }`}
                      >
                        {isFollowingUser ? (
                          <>
                            <UserCheck className="size-3.5" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="size-3.5" />
                            <span>Follow Back</span>
                          </>
                        )}
                      </button>
                    ) : item.post_preview ? (
                      <img
                        src={item.post_preview}
                        alt="Post preview"
                        className="size-10 rounded-lg object-cover ring-1 ring-slate-200/60 shadow-xs"
                      />
                    ) : item.story_preview ? (
                      <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 text-[10px] font-bold text-purple-700 border border-purple-200/60 max-w-[70px] truncate">
                        {item.story_preview}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
