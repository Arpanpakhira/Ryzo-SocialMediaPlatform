import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, CheckCircle2, Send, FolderPlus, Plus, Check, X, User, Music } from 'lucide-react';
import CommentModal from './CommentModal';
import SharePostModal from './SharePostModal';
import AudioPageModal from './AudioPageModal';
import { getFontFamilyStyle, getDesignEffectClass } from '../utils/typographyStyles';

const PostCard = ({ post }) => {
  const { currentUser, toggleLike, addComment, savedPostIds, toggleSavePost, collections, createCollection, addPostToCollection, posts, darkMode } = useApp();
  const navigate = useNavigate();
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);

  const likes = post.likes_count || [];
  const hasLiked = likes.includes(currentUser._id);
  const isSaved = savedPostIds.includes(post._id);
  const comments = post.comments || [];

  const handleDoubleTap = () => {
    if (!hasLiked) {
      toggleLike(post._id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  const handleAddQuickComment = (e) => {
    e.preventDefault();
    if (commentInput.trim()) {
      addComment(post._id, commentInput);
      setCommentInput('');
    }
  };

  const handleCreateNewCollection = (e) => {
    e.preventDefault();
    if (newColName.trim()) {
      createCollection(newColName.trim(), post._id);
      setNewColName('');
      setIsCollectionModalOpen(false);
    }
  };

  const handleNavigateToProfile = (targetUser) => {
    if (!targetUser) return;
    const targetId = targetUser._id || targetUser.username;
    if (!targetId) return;
    const path =
      targetUser._id === currentUser._id || targetUser.username === currentUser.username
        ? '/profile'
        : `/profile/${targetId}`;
    navigate(path);
  };

  // Format Hashtags (#tag) and Mentions (@user) into styled clickable elements
  const renderFormattedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span
            key={index}
            className="text-amber-500 font-bold cursor-pointer hover:underline"
          >
            {part}
          </span>
        );
      }
      if (part.startsWith('@')) {
        const username = part.slice(1);
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${username}`);
            }}
            className="text-amber-400 font-bold cursor-pointer hover:underline"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const [showFullCaption, setShowFullCaption] = useState(false);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = Date.now();
    const past = new Date(dateStr).getTime();
    const diffSec = Math.max(1, Math.floor((now - past) / 1000));
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const hasMedia = (post.image_urls && post.image_urls.length > 0) || Boolean(post.video_url);
  const mediaItem = post.video_url || post.image_urls?.[currentMediaIdx];
  const isVideoMedia = Boolean(post.video_url) || (mediaItem && (mediaItem.startsWith('data:video') || /\.(mp4|webm|mov|ogg)($|\?)/i.test(mediaItem)));

  return (
    <article id={`post-${post._id}`} className={`w-full rounded-none border-x-0 border-t-0 border-b md:rounded-3xl md:border mb-1 md:mb-6 overflow-hidden transition-all duration-300 ${
      darkMode
        ? 'bg-slate-900/90 md:ryzo-glass-panel border-slate-800/80 shadow-md md:shadow-2xl'
        : 'bg-[#152316]/95 md:ryzo-glass-olive-card border-amber-500/20 shadow-md md:shadow-xl'
    }`}>

      {/* Post Header */}
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between">
        <div
          onClick={() => handleNavigateToProfile(post.user)}
          className="flex items-center gap-2.5 cursor-pointer group/user"
        >
          <div className="relative">
            <img
              src={post.user?.profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'}
              alt={post.user?.full_name}
              className="size-9 sm:size-10 rounded-full object-cover ring-2 ring-amber-500/30 group-hover/user:ring-amber-400 transition-all"
            />
            {post.user?.is_verified && (
              <CheckCircle2 className="size-3.5 sm:size-4 text-amber-500 fill-slate-950 absolute -bottom-0.5 -right-0.5" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${
                darkMode ? 'text-slate-50 group-hover/user:text-amber-300' : 'text-slate-100 group-hover/user:text-amber-300'
              }`}>
                {post.user?.username || 'user'}
              </span>
              {post.location && (
                <span className="text-[10px] sm:text-xs text-slate-400">
                  • {post.location}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {post.user?.full_name || 'Creator'}
            </span>
          </div>
        </div>

        <button className={`p-1.5 rounded-full text-slate-400 transition-colors ${
          darkMode ? 'hover:text-white hover:bg-slate-800' : 'hover:text-amber-300 hover:bg-amber-950/40'
        }`}>
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      {/* Text-only Post Body (If no images) */}
      {!hasMedia && post.content && (
        <div
          style={{
            background: post.bg_gradient || undefined,
            minHeight: post.bg_gradient ? '180px' : undefined,
          }}
          className={`transition-all ${
            post.bg_gradient
              ? 'p-6 sm:p-8 flex items-center justify-center text-center rounded-2xl mx-3 my-2 shadow-inner border border-white/10'
              : 'px-4 py-3 text-sm leading-relaxed text-slate-200'
          }`}
        >
          <div
            style={{
              fontFamily: getFontFamilyStyle(post.font_style),
              color: post.text_color || (post.bg_gradient ? '#ffffff' : undefined),
            }}
            className={`${
              post.bg_gradient
                ? 'text-base sm:text-lg font-bold leading-relaxed break-words max-w-md mx-auto'
                : 'text-sm leading-relaxed'
            } ${getDesignEffectClass(post.text_design)}`}
          >
            {renderFormattedText(post.content)}
          </div>
        </div>
      )}

      {/* Post Media Container (Double Tap supported, Edge-to-Edge) */}
      {hasMedia && (
        <div 
          onDoubleClick={handleDoubleTap}
          className="relative w-full aspect-square md:aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer select-none"
        >
          {isVideoMedia ? (
            <video
              src={mediaItem}
              controls
              playsInline
              className="size-full object-cover"
            />
          ) : (
            <img
              src={mediaItem}
              alt="Post media"
              className="size-full object-cover transition-transform duration-300"
            />
          )}

          {/* Double Tap Animated Heart */}
          {showHeartAnim && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none animate-in zoom-in-50 duration-200">
              <Heart className="size-24 sm:size-28 text-rose-500 fill-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.8)] animate-bounce" />
            </div>
          )}

          {/* Tagged People Indicator Badge & Floating Tag Pills */}
          {post.tagged_users && post.tagged_users.length > 0 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTags(!showTags);
                }}
                className="absolute bottom-3 left-3 z-10 px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1.5 border border-amber-500/30 shadow-md hover:bg-slate-900 transition-colors"
              >
                <User className="size-3 text-amber-400" />
                <span>{post.tagged_users.length} {post.tagged_users.length === 1 ? 'person' : 'people'}</span>
              </button>

              {showTags && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {post.tagged_users.map((tag, idx) => (
                    <div
                      key={idx}
                      style={{
                        left: `${tag.x_percent || 50}%`,
                        top: `${tag.y_percent || 50}%`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${tag.username || tag.user_id}`);
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold shadow-2xl border border-amber-500/40 flex items-center gap-1 cursor-pointer hover:scale-110 hover:border-amber-400 transition-all animate-in zoom-in-75 duration-150"
                    >
                      <User className="size-3 text-amber-400" />
                      <span>@{tag.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Carousel dots if multiple images */}
          {post.image_urls.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {post.image_urls.map((_, idx) => (
                <div
                  key={idx}
                  className={`size-1.5 rounded-full transition-all ${
                    idx === currentMediaIdx ? 'w-4 bg-amber-400' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Action Buttons Bar (Instagram Anatomy) */}
      <div className="px-3 pt-3 pb-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={() => toggleLike(post._id)}
            className="transition-transform active:scale-125"
            aria-label="Like Post"
          >
            <Heart
              className={`size-6 transition-colors ${
                hasLiked
                  ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                  : 'text-slate-300 hover:text-rose-400'
              }`}
            />
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setIsCommentModalOpen(true)}
            className="text-slate-300 hover:text-amber-400 transition-transform active:scale-110"
            aria-label="Comment"
          >
            <MessageCircle className="size-6" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="text-slate-300 hover:text-amber-400 transition-transform active:scale-110"
            aria-label="Share"
          >
            <Share2 className="size-6" />
          </button>
        </div>

        {/* Bookmark / Save Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollectionModalOpen(true)}
            title="Save to Collection"
            className="text-slate-400 hover:text-amber-400 p-1"
          >
            <FolderPlus className="size-5" />
          </button>
          <button
            onClick={() => toggleSavePost(post._id)}
            className="transition-transform active:scale-125"
            aria-label="Save Post"
          >
            <Bookmark
              className={`size-6 transition-colors ${
                isSaved
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'text-slate-300 hover:text-slate-100'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Likes Count */}
      <div className="px-3 sm:px-4 text-xs font-bold text-slate-100">
        {likes.length === 1 ? '1 like' : `${likes.length} likes`}
      </div>

      {/* Caption with Username (Instagram Style) */}
      {hasMedia && post.content && (
        <div className="px-3 sm:px-4 pt-1 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <span 
            onClick={() => handleNavigateToProfile(post.user)}
            className="font-bold text-slate-50 mr-1.5 cursor-pointer hover:underline"
          >
            {post.user?.username || 'user'}
          </span>
          <span
            style={{
              fontFamily: getFontFamilyStyle(post.font_style),
              color: post.text_color || undefined,
            }}
            className={getDesignEffectClass(post.text_design)}
          >
            {!showFullCaption && post.content.length > 120 ? (
              <>
                {renderFormattedText(post.content.slice(0, 120))}
                <button
                  onClick={() => setShowFullCaption(true)}
                  className="text-slate-400 hover:text-amber-300 ml-1 text-xs font-semibold"
                >
                  ...more
                </button>
              </>
            ) : (
              renderFormattedText(post.content)
            )}
          </span>
        </div>
      )}

      {/* Audio Track Ticker (if present) */}
      {(post.audio_track || (post.audio_title && post.audio_title !== 'Original Audio')) && (
        <div className="px-3 sm:px-4 pt-1.5">
          <div
            onClick={() =>
              setSelectedAudioTrack(
                post.audio_track || {
                  title: post.audio_title,
                  artist: post.user?.full_name || 'Original Audio',
                  artwork: post.user?.profile_picture,
                }
              )
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-colors border group/audio ${
              darkMode ? 'bg-amber-950/40 text-amber-300 border-amber-500/30' : 'bg-amber-950/30 text-amber-300 border-amber-500/30'
            }`}
          >
            <Music className="size-3 text-amber-400 group-hover/audio:scale-110 transition-transform animate-spin [animation-duration:5s]" />
            <span className="truncate max-w-[220px]">
              {post.audio_track ? `${post.audio_track.title} • ${post.audio_track.artist}` : post.audio_title}
            </span>
          </div>
        </div>
      )}

      {/* View All Comments Link */}
      {comments.length > 0 && (
        <div className="px-3 sm:px-4 pt-1">
          <button
            onClick={() => setIsCommentModalOpen(true)}
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            View all {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </button>
        </div>
      )}

      {/* Timestamp */}
      <div className="px-3 sm:px-4 pt-1 pb-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
        {formatTimeAgo(post.createdAt)}
      </div>

      {/* Quick Add Comment Input */}
      <form onSubmit={handleAddQuickComment} className="px-3 pb-3 sm:px-4 sm:pb-3.5 pt-0.5 flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className={`flex-1 rounded-full px-3.5 py-1.5 text-xs transition-all ${
            darkMode
              ? 'bg-slate-800/80 border border-slate-700/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500'
              : 'bg-amber-950/30 border border-amber-500/20 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500'
          }`}
        />
        {commentInput.trim() && (
          <button
            type="submit"
            className="text-amber-400 font-bold text-xs hover:text-amber-300 active:scale-95 px-2 py-1 transition-transform"
          >
            Post
          </button>
        )}
      </form>

      {/* Save to Collection Modal */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FolderPlus className="size-4 text-indigo-600" />
                <span>Save to Collection</span>
              </h4>
              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="py-3 flex flex-col gap-2 max-h-48 overflow-y-auto">
              {collections.map((col) => {
                const inCol = col.posts.includes(post._id);
                return (
                  <button
                    key={col._id}
                    onClick={() => {
                      addPostToCollection(col._id, post._id);
                      setIsCollectionModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 text-left transition-all group"
                  >
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
                      {col.name}
                    </span>
                    {inCol ? (
                      <Check className="size-4 text-indigo-600" />
                    ) : (
                      <Plus className="size-4 text-slate-400 group-hover:text-indigo-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleCreateNewCollection} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="New collection name..."
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="submit"
                disabled={!newColName.trim()}
                className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs disabled:opacity-50 hover:bg-indigo-700"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Comment Drawer Modal */}
      {isCommentModalOpen && (
        <CommentModal post={post} onClose={() => setIsCommentModalOpen(false)} />
      )}

      {/* Share Post Direct Message Modal */}
      {isShareModalOpen && (
        <SharePostModal post={post} onClose={() => setIsShareModalOpen(false)} />
      )}

      {/* Audio Page Detail Modal */}
      {selectedAudioTrack && (
        <AudioPageModal
          audioTrack={selectedAudioTrack}
          reels={posts || []}
          onClose={() => setSelectedAudioTrack(null)}
          onUseAudio={() => {
            setSelectedAudioTrack(null);
            navigate('/reels');
          }}
        />
      )}
    </article>
  );
};

export default PostCard;

