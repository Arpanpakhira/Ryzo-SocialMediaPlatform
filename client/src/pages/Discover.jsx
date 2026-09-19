import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, Sparkles, Flame, Film, Hash, CheckCircle2, User, Play } from 'lucide-react';
import PostCard from '../components/PostCard';

const HASHTAG_PILLS = ['#all', '#reels', '#nature', '#tech', '#code', '#vibes', '#travel', '#photography'];

const calculateEngagementScore = (post) => {
  const likes = post.likes_count?.length || 0;
  const comments = post.comments?.length || 0;
  const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
  const hoursOld = Math.max(0.1, (new Date() - createdAt) / (1000 * 60 * 60));
  
  // Formula: Score = (Likes + 2 * Comments) / (HoursOld + 1)^1.5
  return (likes + 2 * comments) / Math.pow(hoursOld + 1, 1.5);
};

const Discover = () => {
  const { posts, connections, toggleFollowUser, following } = useApp();
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState('#all');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [exploreList, setExploreList] = useState([]);

  // Compute recommendation scores and rank posts
  useEffect(() => {
    fetch('http://localhost:5000/api/posts/explore')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) {
          setExploreList(data);
        } else {
          const ranked = [...posts].sort(
            (a, b) => calculateEngagementScore(b) - calculateEngagementScore(a)
          );
          setExploreList(ranked);
        }
      })
      .catch(() => {
        const ranked = [...posts].sort(
          (a, b) => calculateEngagementScore(b) - calculateEngagementScore(a)
        );
        setExploreList(ranked);
      });
  }, [posts]);

  // Filter posts based on active search filter & hashtag pill
  const filteredPosts = exploreList.filter((post) => {
    const text = (post.content || '').toLowerCase();
    const username = (post.user?.username || '').toLowerCase();
    const name = (post.user?.full_name || '').toLowerCase();
    const query = searchFilter.trim().toLowerCase();

    // Hashtag pill filter
    if (activeTag !== '#all') {
      const tag = activeTag.replace('#', '').toLowerCase();
      const hasHashtag =
        post.hashtags?.includes(tag) || text.includes(`#${tag}`);
      if (!hasHashtag) return false;
    }

    if (!query) return true;

    if (query.startsWith('#')) {
      const tag = query.replace('#', '');
      return post.hashtags?.includes(tag) || text.includes(`#${tag}`);
    }

    if (query.startsWith('@')) {
      const userTerm = query.replace('@', '');
      return post.mentions?.includes(userTerm) || username.includes(userTerm);
    }

    return text.includes(query) || username.includes(query) || name.includes(query);
  });

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-8 pb-16 md:pb-8">
      {/* Top Search Header */}
      <div className="mb-3 sm:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="hidden sm:block">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Explore & Discover</span>
            <Sparkles className="size-6 text-amber-400" />
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Discover trending creators, viral reels, and popular topics.
          </p>
        </div>

        {/* Search Input Bar (Sticky on Mobile) */}
        <div className="relative w-full md:w-80">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search #hashtags, @mentions, or posts..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl sm:rounded-2xl pl-10 pr-4 py-2 sm:py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-md transition-all"
          />
        </div>
      </div>

      {/* Hashtag Quick Filter Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 mb-3 sm:mb-6">
        {HASHTAG_PILLS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeTag === tag
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            {tag.startsWith('#') && <Hash className="size-3 text-current" />}
            <span>{tag}</span>
          </button>
        ))}
      </div>

      {/* Trending Creators Bar (Compact Carousel on Mobile) */}
      <div className="bg-slate-900/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-800/80 shadow-md mb-3 sm:mb-8">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Flame className="size-4 sm:size-5 text-amber-500" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-100">Trending Creators</h2>
          </div>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar pb-1">
          {connections.map((user) => {
            const isFollowing = following.some((u) => u._id === user._id);
            return (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50 shrink-0 w-60 sm:w-auto hover:shadow-xs transition-all"
              >
                <div 
                  onClick={() => navigate(`/profile/${user._id || user.username}`)}
                  className="flex items-center gap-2.5 cursor-pointer group/user"
                >
                  <div className="relative">
                    <img
                      src={user.profile_picture}
                      alt={user.full_name}
                      className="size-8 sm:size-10 rounded-full object-cover ring-2 ring-amber-500/20 group-hover/user:ring-amber-500 transition-all"
                    />
                    {user.is_verified && (
                      <CheckCircle2 className="size-3 text-amber-400 fill-slate-950 absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-100 group-hover/user:text-amber-300 transition-colors truncate max-w-[90px] sm:max-w-[110px]">
                        {user.full_name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">@{user.username}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(user._id)}
                  className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95 ${
                    isFollowing
                      ? 'bg-slate-700/60 text-slate-300'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instagram 3-Column Explore Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
          No explore posts match "{searchFilter || activeTag}". Try another search term.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-2 md:gap-4 grid-flow-dense">
          {filteredPosts.map((post, idx) => {
            const imgUrl =
              post.image_urls?.[0] ||
              (post.is_reel
                ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400'
                : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400');

            const isReel = post.is_reel || post.post_type === 'reel' || Boolean(post.video_url);
            const isTallCard = (idx % 7 === 0 && idx !== 0) || isReel;

            return (
              <div
                key={post._id + idx}
                onClick={() => setSelectedPost(post)}
                className={`relative rounded-none sm:rounded-2xl overflow-hidden cursor-pointer group bg-slate-900 shadow-sm border border-slate-800/80 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                  isTallCard ? 'row-span-2 aspect-[9/16]' : 'aspect-square'
                }`}
              >
                {isReel ? (
                  <div className="relative size-full">
                    <video
                      src={post.video_url}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                      muted
                      playsInline
                      onMouseEnter={(e) => e.target.play().catch(() => {})}
                      onMouseLeave={(e) => e.target.pause()}
                    />
                    <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white backdrop-blur-md z-10 shadow-lg">
                      <Film className="size-4" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={imgUrl}
                    alt={post.content || 'Explore item'}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Tagged users indicator icon badge on card */}
                {post.tagged_users && post.tagged_users.length > 0 && (
                  <div className="absolute top-3 left-3 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md z-10 border border-white/20 shadow-md">
                    <User className="size-3.5 text-indigo-400" />
                  </div>
                )}

                {/* Hover Overlay with Creator & Engagement Stats */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 text-white">
                  <div className="flex items-center gap-2">
                    {post.user?.profile_picture && (
                      <img
                        src={post.user.profile_picture}
                        alt={post.user.full_name}
                        className="size-7 rounded-full object-cover border border-white/60 shadow-md"
                      />
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate max-w-[120px]">
                        {post.user?.full_name || 'Creator'}
                      </span>
                      {post.user?.is_verified && <CheckCircle2 className="size-3 text-indigo-400 fill-white" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 font-bold text-sm">
                    <div className="flex items-center gap-1.5">
                      <Heart className="size-5 fill-rose-500 text-rose-500" />
                      <span>{post.likes_count?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="size-5 fill-indigo-400 text-indigo-400" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div onClick={() => setSelectedPost(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-lg"
            >
              ✕
            </button>
            <PostCard post={selectedPost} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
