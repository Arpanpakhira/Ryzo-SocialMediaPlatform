import React from 'react';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RightSidebar from '../components/RightSidebar';
import { useApp } from '../context/AppContext';
import { Image, Video, Sparkles } from 'lucide-react';

const Feed = () => {
  const { posts, currentUser, setIsCreatePostOpen, searchQuery, darkMode } = useApp();

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.content?.toLowerCase().includes(query) ||
      post.user?.full_name?.toLowerCase().includes(query) ||
      post.user?.username?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex justify-center gap-8 max-w-7xl mx-auto p-0 md:p-6">
      {/* Main Feed Column */}
      <div className="flex-1 max-w-2xl min-w-0">
        {/* Stories Horizontal Tray */}
        <StoriesBar />

        {/* Quick Post Creator Trigger Card (Desktop Only - Mobile uses Bottom Nav '+') */}
        <div className={`hidden md:block rounded-3xl p-4 border shadow-xl mb-6 transition-colors duration-300 ${
          darkMode ? 'ryzo-glass-panel border-amber-500/20' : 'ryzo-glass-olive-card border-amber-500/20'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.profile_picture}
              alt={currentUser?.full_name}
              className="size-11 rounded-full object-cover ring-2 ring-amber-500/30"
            />
            <div
              onClick={() => setIsCreatePostOpen(true)}
              className="flex-1 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/20 rounded-full px-5 py-3 text-xs text-slate-300 cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>What's on your mind, {currentUser?.full_name?.split(' ')[0]}?</span>
              <Sparkles className="size-4 text-amber-400" />
            </div>
          </div>

          <div className="flex items-center justify-around pt-3 mt-3 border-t border-amber-500/20 text-xs font-semibold text-slate-200">
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-amber-950/40 text-slate-200 transition-colors"
            >
              <Image className="size-4 text-emerald-400" />
              <span>Photo</span>
            </button>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-amber-950/40 text-slate-200 transition-colors"
            >
              <Video className="size-4 text-amber-400" />
              <span>Video</span>
            </button>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-amber-950/40 text-slate-200 transition-colors"
            >
              <Sparkles className="size-4 text-amber-400" />
              <span>Feeling/Activity</span>
            </button>
          </div>
        </div>

        {/* Posts Stream */}
        <div className="flex flex-col gap-2">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xs text-center text-slate-400">
              <p className="text-sm font-semibold">No posts found.</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for something else or create your first post!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      </div>

      {/* Right Sidebar for Desktop */}
      <RightSidebar />
    </div>
  );
};

export default Feed;
