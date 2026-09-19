import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Plus,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  Flame,
  X,
  MoreHorizontal,
  ChevronsDown,
  Check,
  BookmarkCheck,
} from 'lucide-react';
import CommentModal from '../components/CommentModal';
import SharePostModal from '../components/SharePostModal';
import CreateReelModal from '../components/CreateReelModal';
import AudioPageModal from '../components/AudioPageModal';

const sampleReelsData = [
  {
    _id: 'reel_1',
    user: {
      _id: 'user_2',
      full_name: 'Aakash Sharma',
      username: 'aakash_s',
      profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      is_verified: true,
    },
    content: 'Unbelievable sunset view from the peak! 🌅✨ #nature #reels #vibes',
    video_url: 'https://videos.pexels.com/video-files/14447442/14447442-hd_1080_1920_30fps.mp4',
    likes_count: ['user_2'],
    comments: [{ _id: 'c1', text: 'Stunning video!' }],
    audio_title: 'As It Was • Harry Styles',
    audio_track: {
      id: 'track_1',
      title: 'As It Was',
      artist: 'Harry Styles',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/07/41/6a/07416a78-38b9-2d47-7ce8-8a52a44c510f/196874010112.jpg/100x100bb.jpg',
      audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/35/b6/a0/35b6a026-26bc-cfb1-30d3-9c3c1820c63f/mzaf_8281785747956416426.plus.aac.p.m4a',
      duration: 30,
      start_time: 0,
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'reel_2',
    user: {
      _id: 'user_3',
      full_name: 'Rahul Verma',
      username: 'rahul_v',
      profile_picture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200',
      is_verified: true,
    },
    content: 'Building new features for Ryzo with @arpan! 🚀💻 Stay tuned for modern updates. #tech #code',
    video_url: 'https://videos.pexels.com/video-files/4114797/4114797-sd_540_960_25fps.mp4',
    likes_count: [],
    comments: [],
    audio_title: 'Sunflower • Post Malone & Swae Lee',
    audio_track: {
      id: 'track_2',
      title: 'Sunflower (Spider-Man)',
      artist: 'Post Malone & Swae Lee',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/100x100bb.jpg',
      audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/f0/d6/98f0d67e-f8bf-762d-cac7-1c6b3b6b35dd/mzaf_4543283896248560946.plus.aac.p.m4a',
      duration: 30,
      start_time: 0,
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'reel_3',
    user: {
      _id: 'user_2zdFoZib5lNr614LgkONdD8WG32',
      full_name: 'Arpan Pakhira',
      username: 'arpan',
      profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      is_verified: true,
    },
    content: 'Life in motion 🏎️. Cruising into the weekend with @aakash_s!',
    video_url: 'https://videos.pexels.com/video-files/856973/856973-hd_1080_1920_30fps.mp4',
    likes_count: ['user_3'],
    comments: [],
    audio_title: 'Blinding Lights • The Weeknd',
    audio_track: {
      id: 'track_3',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/bf/1a/05/bf1a052e-ec0b-689a-0e6e-bcbfd534575c/20UMGIM02796.rgb.jpg/100x100bb.jpg',
      audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/9f/c7/919fc77c-3f26-0e36-e82b-5e4c0d4a2a22/mzaf_10526019561005234509.plus.aac.p.m4a',
      duration: 30,
      start_time: 0,
    },
    createdAt: new Date().toISOString(),
  },
];

const ReelItem = ({
  reel,
  reelIndex,
  isActive,
  isMuted,
  onToggleMute,
  isAutoScroll,
  onToggleAutoScroll,
  onOpenComments,
  onOpenShare,
  onOpenAudioPage,
  onSwipeNext,
}) => {
  const { currentUser, toggleLike, savedPostIds, toggleSavePost, toggleSaveAudio, isAudioSaved } = useApp();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasAutoScrolledRef = useRef(false);

  // Swipe / Drag Gesture States
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isDismissed, setIsDismissed] = useState(null); // 'right' | 'left' | null

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);

  const likes = reel.likes_count || [];
  const hasLiked = likes.includes(currentUser._id);
  const isSaved = savedPostIds.includes(reel._id);
  const commentsCount = reel.comments?.length || 0;

  const audioTrack = reel.audio_track;
  const audioUrl = audioTrack?.audio_url || reel.audio_url;
  const audioTitle = audioTrack?.title
    ? `${audioTrack.title} • ${audioTrack.artist}`
    : (reel.audio_title || 'Original Audio');
  const vinylArtwork = audioTrack?.artwork || reel.user?.profile_picture;

  const audioObj = {
    id: audioTrack?.id || reel.audio_title || reel._id,
    title: audioTrack?.title || reel.audio_title || 'Original Audio',
    artist: audioTrack?.artist || reel.user?.full_name || 'Original Audio',
    artwork: vinylArtwork,
    audio_url: audioUrl || '',
    is_trending: true,
  };

  const isSavedAudio = isAudioSaved(audioObj);

  const startTime = audioTrack?.start_time || 0;
  const duration = audioTrack?.duration || 30;

  // Strict playback synchronization: only the single active reel plays!
  useEffect(() => {
    if (!isActive) {
      // INACTIVE REEL: Ensure full silence and pause
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.muted = true;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = startTime;
      }
      setIsPlaying(false);
      setIsMenuOpen(false);
      hasAutoScrolledRef.current = false;
      return;
    }

    // ACTIVE REEL: Play active video and audio
    hasAutoScrolledRef.current = false;
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.muted = audioUrl ? true : isMuted;
      videoRef.current.play().catch(() => {});
    }

    if (audioRef.current && audioUrl) {
      if (!isMuted) {
        if (audioRef.current.currentTime < startTime || audioRef.current.currentTime >= startTime + duration) {
          audioRef.current.currentTime = startTime;
        }
        audioRef.current.volume = 1.0;
        audioRef.current.play().catch((err) => {
          console.log('Audio autoplay blocked by browser policy:', err.message);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isActive, isMuted, audioUrl, startTime, duration]);

  // Clean unmount to prevent lingering audio when navigating away from /reels
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  const handleAudioTimeUpdate = () => {
    if (audioRef.current && audioUrl && isActive) {
      if (audioRef.current.currentTime >= startTime + duration) {
        if (isAutoScroll && onSwipeNext) {
          if (!hasAutoScrolledRef.current) {
            hasAutoScrolledRef.current = true;
            onSwipeNext(reel._id);
          }
        } else {
          audioRef.current.currentTime = startTime;
          if (!isMuted) {
            audioRef.current.play().catch(() => {});
          }
        }
      }
    }
  };

  const handleVideoEnded = () => {
    if (isAutoScroll && isActive && onSwipeNext) {
      if (!hasAutoScrolledRef.current) {
        hasAutoScrolledRef.current = true;
        onSwipeNext(reel._id);
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (isAutoScroll && isActive && videoRef.current && onSwipeNext) {
      const { currentTime, duration } = videoRef.current;
      if (duration > 0 && currentTime >= duration - 0.25) {
        if (!hasAutoScrolledRef.current) {
          hasAutoScrolledRef.current = true;
          onSwipeNext(reel._id);
        }
      }
    }
  };

  const togglePlayPause = () => {
    if (Math.abs(dragOffsetX) > 10) return; // Ignore click if user was dragging/swiping
    if (isMuted) {
      // Tap on reel video instantly unmutes the sound!
      onToggleMute();
      return;
    }

    if (!isActive) return;

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        if (audioRef.current && audioUrl && !isMuted) {
          audioRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleTap = () => {
    if (!hasLiked) {
      toggleLike(reel._id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  const handleNavigateToProfile = () => {
    if (!reel.user) return;
    const targetId = reel.user._id || reel.user.username;
    const isSelf = reel.user._id === currentUser._id || reel.user.username === currentUser.username;
    navigate(isSelf ? '/profile' : `/profile/${targetId}`);
  };

  // Touch & Mouse Drag Handlers for Tinder Swipe
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setDragOffsetX(currentX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    evaluateSwipeAction();
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setDragOffsetX(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    evaluateSwipeAction();
  };

  const evaluateSwipeAction = () => {
    const SWIPE_THRESHOLD = 110;
    if (dragOffsetX > SWIPE_THRESHOLD) {
      // SWIPE RIGHT -> LIKE & ADVANCE NEXT
      if (!hasLiked) {
        toggleLike(reel._id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
      setIsDismissed('right');
      setTimeout(() => {
        setIsDismissed(null);
        setDragOffsetX(0);
        if (onSwipeNext) onSwipeNext(reel._id);
      }, 280);
    } else if (dragOffsetX < -SWIPE_THRESHOLD) {
      // SWIPE LEFT -> SKIP & ADVANCE NEXT
      setIsDismissed('left');
      setTimeout(() => {
        setIsDismissed(null);
        setDragOffsetX(0);
        if (onSwipeNext) onSwipeNext(reel._id);
      }, 280);
    } else {
      // Reset card position smoothly
      setDragOffsetX(0);
    }
  };

  // Dynamic CSS Transforms & Stamp Opacity
  let transformStyle = '';
  if (isDismissed === 'right') {
    transformStyle = 'translateX(650px) rotate(28deg)';
  } else if (isDismissed === 'left') {
    transformStyle = 'translateX(-650px) rotate(-28deg)';
  } else {
    transformStyle = `translateX(${dragOffsetX}px) rotate(${dragOffsetX * 0.04}deg)`;
  }

  const likeStampOpacity = Math.min(1, Math.max(0, dragOffsetX / 70));
  const skipStampOpacity = Math.min(1, Math.max(0, -dragOffsetX / 70));

  return (
    <div
      ref={containerRef}
      data-reel-index={reelIndex}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: transformStyle,
        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      }}
      className="relative w-full max-w-none md:max-w-sm h-[calc(100dvh-112px)] md:h-[650px] mx-auto bg-black rounded-none md:rounded-3xl overflow-hidden snap-start shrink-0 flex items-center justify-center shadow-2xl border-0 md:border border-slate-800 touch-pan-y select-none"
    >
      {/* Swipe Right "LIKE" Stamp Overlay */}
      {dragOffsetX > 15 && (
        <div
          style={{ opacity: likeStampOpacity }}
          className="absolute top-12 left-6 z-40 border-4 border-emerald-400 text-emerald-400 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-2xl rotate-[-15deg] shadow-2xl tracking-wider font-extrabold text-xl uppercase flex items-center gap-2 pointer-events-none animate-in zoom-in-75 duration-100"
        >
          <Heart className="size-6 fill-emerald-400 text-emerald-400" />
          <span>LIKE</span>
        </div>
      )}

      {/* Swipe Left "SKIP" Stamp Overlay */}
      {dragOffsetX < -15 && (
        <div
          style={{ opacity: skipStampOpacity }}
          className="absolute top-12 right-6 z-40 border-4 border-rose-500 text-rose-500 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-2xl rotate-[15deg] shadow-2xl tracking-wider font-extrabold text-xl uppercase flex items-center gap-2 pointer-events-none animate-in zoom-in-75 duration-100"
        >
          <X className="size-6 stroke-[3]" />
          <span>SKIP</span>
        </div>
      )}

      {/* 9:16 Video Player */}
      <video
        ref={videoRef}
        src={reel.video_url}
        loop={!isAutoScroll}
        muted={audioUrl ? true : isMuted}
        playsInline
        onClick={togglePlayPause}
        onDoubleClick={handleDoubleTap}
        onEnded={handleVideoEnded}
        onTimeUpdate={handleVideoTimeUpdate}
        className="size-full object-cover cursor-pointer select-none"
      />

      {/* External Audio Track Element if provided */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          onTimeUpdate={handleAudioTimeUpdate}
          loop
        />
      )}

      {/* Tap to Unmute Overlay Prompt when sound is muted */}
      {isMuted && isPlaying && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-4 py-2.5 rounded-full bg-black/75 border border-white/30 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all animate-in fade-in zoom-in-95 duration-200"
        >
          <VolumeX className="size-4.5 text-rose-400" />
          <span>Tap to Unmute Sound 🔊</span>
        </div>
      )}

      {/* Play/Pause Overlay Indicator */}
      {!isPlaying && (
        <div
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
        >
          <div className="p-4 rounded-full bg-black/60 text-white backdrop-blur-md">
            <Play className="size-8 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Double Tap Animated Heart */}
      {showHeartAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Heart className="size-28 text-rose-500 fill-rose-500 drop-shadow-2xl animate-bounce" />
        </div>
      )}

      {/* Top Controls: Mute Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-all active:scale-90 shadow-lg border border-white/20 flex items-center gap-1.5"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <>
              <VolumeX className="size-4.5 text-rose-400" />
              <span className="text-[10px] font-bold text-rose-300 pr-0.5">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="size-4.5 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-300 pr-0.5">Sound ON</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Left: User Profile & Caption Details */}
      <div className="absolute bottom-4 left-4 right-16 z-20 flex flex-col gap-2.5 text-white bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 rounded-2xl">
        <div 
          onClick={handleNavigateToProfile}
          className="flex items-center gap-2.5 cursor-pointer group/user"
        >
          <img
            src={reel.user?.profile_picture}
            alt={reel.user?.full_name}
            className="size-9 rounded-full object-cover ring-2 ring-white/60 group-hover/user:ring-indigo-400 transition-all"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold group-hover/user:underline">{reel.user?.full_name}</span>
            {reel.user?.is_verified && <CheckCircle2 className="size-3.5 text-indigo-400 fill-white" />}
          </div>
        </div>

        {reel.content && (
          <p className="text-xs leading-relaxed text-white/90 line-clamp-3 font-normal">
            {reel.content}
          </p>
        )}

        {/* Clickable Audio Track Ticker (Opens Audio Page Modal) */}
        <div
          onClick={() => onOpenAudioPage(audioObj)}
          className="inline-flex items-center gap-2 text-[11px] text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full cursor-pointer hover:bg-black/60 transition-colors w-fit group/audio"
        >
          <Music className="size-3.5 text-indigo-400 group-hover/audio:scale-110 transition-transform animate-spin [animation-duration:4s]" />
          <span className="truncate max-w-[180px] font-medium group-hover/audio:underline">{audioTitle}</span>
          <Flame className="size-3 text-amber-400 fill-amber-400 shrink-0 ml-0.5" />
        </div>
      </div>

      {/* Right Side Action Bar */}
      <div className="absolute bottom-6 right-3 z-20 flex flex-col items-center gap-4 text-white">
        {/* Like */}
        <button
          onClick={() => toggleLike(reel._id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-transform active:scale-125">
            <Heart
              className={`size-6 ${
                hasLiked ? 'text-rose-500 fill-rose-500' : 'text-white group-hover:text-rose-400'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold">{likes.length}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => onOpenComments(reel)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-transform active:scale-110">
            <MessageCircle className="size-6 text-white group-hover:text-indigo-400" />
          </div>
          <span className="text-[11px] font-bold">{commentsCount}</span>
        </button>

        {/* Share */}
        <button
          onClick={() => onOpenShare(reel)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-transform active:scale-110">
            <Share2 className="size-6 text-white group-hover:text-indigo-400" />
          </div>
          <span className="text-[11px] font-bold">Share</span>
        </button>

        {/* Three Dots More Options Button & Dropdown (Save Reel & Auto Scroll) */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="flex flex-col items-center gap-1 group"
            title="More Options"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md transition-all active:scale-110 ${
                isMenuOpen
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                  : 'bg-black/40 hover:bg-black/60 text-white hover:text-indigo-400'
              }`}
            >
              <MoreHorizontal className="size-6" />
            </div>
            <span className="text-[11px] font-bold">More</span>
          </button>

          {/* Floating Dropdown Modal */}
          {isMenuOpen && (
            <>
              {/* Invisible Backdrop to close on outside click */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
                className="fixed inset-0 z-40"
              />

              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-3 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-1 text-white animate-in zoom-in-95 fade-in duration-150"
              >
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Reel Options</span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* 1. Save / Bookmark Reel */}
                <button
                  onClick={() => {
                    toggleSavePost(reel._id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all ${
                    isSaved
                      ? 'bg-indigo-600/25 text-indigo-300 hover:bg-indigo-600/35 border border-indigo-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isSaved ? (
                      <BookmarkCheck className="size-4.5 text-indigo-400" />
                    ) : (
                      <Bookmark className="size-4.5 text-slate-300" />
                    )}
                    <span className="text-xs font-semibold">
                      {isSaved ? 'Saved in Collections' : 'Save Reel'}
                    </span>
                  </div>
                  {isSaved && <Check className="size-3.5 text-indigo-400 stroke-[3]" />}
                </button>

                {/* 2. Auto Scroll Option with Toggle Switch */}
                <button
                  onClick={() => {
                    onToggleAutoScroll();
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all ${
                    isAutoScroll
                      ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ChevronsDown
                      className={`size-4.5 ${
                        isAutoScroll ? 'text-emerald-400 animate-bounce' : 'text-slate-300'
                      }`}
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold">Auto Scroll</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Advance when reel ends
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                      isAutoScroll ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="size-4 rounded-full bg-white shadow-md" />
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Clickable Spinning Vinyl Record Disc (Opens Audio Page) */}
        <div
          onClick={() => onOpenAudioPage(audioObj)}
          className="size-10 rounded-full bg-slate-900 border-2 border-white/60 p-0.5 flex items-center justify-center animate-spin [animation-duration:3.5s] mt-1 shadow-lg overflow-hidden cursor-pointer hover:border-indigo-400 hover:scale-110 transition-all"
        >
          <img
            src={vinylArtwork}
            alt="Record"
            className="size-full rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const Reels = () => {
  const { posts } = useApp();
  const [activeReelIndex, setActiveReelIndex] = useState(0); // Single authoritative active reel
  const [isMuted, setIsMuted] = useState(false); // Global unmuted sound across reels
  const [isAutoScroll, setIsAutoScroll] = useState(() => {
    try {
      return localStorage.getItem('ryzo_reels_auto_scroll') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);
  const [initialMusicForReel, setInitialMusicForReel] = useState(null);
  const [selectedCommentReel, setSelectedCommentReel] = useState(null);
  const [selectedShareReel, setSelectedShareReel] = useState(null);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(null);

  const toggleAutoScroll = () => {
    setIsAutoScroll((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ryzo_reels_auto_scroll', String(next));
      } catch (e) {}
      return next;
    });
  };

  const streamContainerRef = useRef(null);

  // Clean up all audio across page when unmounting Reels
  useEffect(() => {
    return () => {
      const audios = document.querySelectorAll('audio');
      audios.forEach((a) => {
        a.pause();
        a.removeAttribute('src');
      });
    };
  }, []);

  // Combine user reel posts with sample reels (ensuring strict deduplication by ID)
  const reelPosts = posts.filter(
    (p) => p && (p.is_reel || p.post_type === 'reel' || (p.video_url && p.video_url.trim().length > 0))
  );

  const allReels = React.useMemo(() => {
    const map = new Map();
    // Prioritize user uploaded & persisted reels at the top
    reelPosts.forEach((r) => {
      if (r && r._id) map.set(r._id, r);
    });
    // Append default sample reels
    sampleReelsData.forEach((s) => {
      if (!map.has(s._id)) {
        map.set(s._id, s);
      }
    });
    return Array.from(map.values());
  }, [reelPosts]);

  // Monitor container scroll to update the single active reel
  const handleContainerScroll = () => {
    if (!streamContainerRef.current) return;
    const container = streamContainerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight || 650;
    const newIndex = Math.round(scrollTop / itemHeight);
    if (newIndex >= 0 && newIndex < allReels.length && newIndex !== activeReelIndex) {
      setActiveReelIndex(newIndex);
    }
  };

  // Precise IntersectionObserver watching container children
  useEffect(() => {
    const container = streamContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-reel-index'));
            if (!isNaN(idx) && idx >= 0) {
              setActiveReelIndex(idx);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    const children = Array.from(container.children);
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [allReels.length]);

  const handleUseAudioFromModal = (audioTrack) => {
    setInitialMusicForReel(audioTrack);
    setIsCreateReelOpen(true);
  };

  // Advance to next reel when swiped left or right
  const handleSwipeNext = (currentReelId) => {
    if (streamContainerRef.current) {
      const children = Array.from(streamContainerRef.current.children);
      const currentIndex = allReels.findIndex((r) => r._id === currentReelId);
      if (currentIndex !== -1 && currentIndex < children.length - 1) {
        const nextIndex = currentIndex + 1;
        setActiveReelIndex(nextIndex);
        const nextChild = children[nextIndex];
        nextChild.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-112px)] md:h-screen flex flex-col items-center relative overflow-hidden bg-slate-950">
      {/* Top Floating Bar & Swipe Instructions Pill */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-30 flex items-center justify-between max-w-sm mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white tracking-wide shadow-text">Reels</h1>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold flex items-center gap-1 border border-white/20 backdrop-blur-md transition-all shadow-md"
            title="Global Sound Toggle"
          >
            {isMuted ? (
              <>
                <VolumeX className="size-3.5 text-rose-400" />
                <span className="text-rose-300">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="size-3.5 text-emerald-400 animate-pulse" />
                <span className="text-emerald-300">Sound ON</span>
              </>
            )}
          </button>

          {/* Auto Scroll Active Badge */}
          {isAutoScroll && (
            <button
              onClick={() => toggleAutoScroll()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/40 backdrop-blur-md animate-pulse shadow-md"
              title="Click to toggle Auto Scroll"
            >
              <ChevronsDown className="size-3 text-emerald-400 animate-bounce" />
              <span>Auto Scroll ON</span>
            </button>
          )}
        </div>
        <button
          onClick={() => {
            setInitialMusicForReel(null);
            setIsCreateReelOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg hover:shadow-indigo-500/40 transition-all"
        >
          <Plus className="size-4" />
          <span>Create Reel</span>
        </button>
      </div>

      {/* Snap-Scrolling Vertical Video Stream */}
      <div
        ref={streamContainerRef}
        onScroll={handleContainerScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory flex flex-col items-center gap-0 py-0 md:py-2"
      >
        {allReels.map((reel, index) => (
          <ReelItem
            key={reel._id}
            reel={reel}
            reelIndex={index}
            isActive={index === activeReelIndex}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
            isAutoScroll={isAutoScroll}
            onToggleAutoScroll={toggleAutoScroll}
            onOpenComments={(r) => setSelectedCommentReel(r)}
            onOpenShare={(r) => setSelectedShareReel(r)}
            onOpenAudioPage={(track) => setSelectedAudioTrack(track)}
            onSwipeNext={handleSwipeNext}
          />
        ))}
      </div>

      {/* Audio Details Page Modal */}
      {selectedAudioTrack && (
        <AudioPageModal
          audioTrack={selectedAudioTrack}
          reels={allReels}
          onClose={() => setSelectedAudioTrack(null)}
          onUseAudio={handleUseAudioFromModal}
        />
      )}

      {/* Create Reel Modal */}
      {isCreateReelOpen && (
        <CreateReelModal
          initialMusic={initialMusicForReel}
          onClose={() => {
            setIsCreateReelOpen(false);
            setInitialMusicForReel(null);
          }}
        />
      )}

      {/* Comment Drawer Modal */}
      {selectedCommentReel && (
        <CommentModal
          post={selectedCommentReel}
          onClose={() => setSelectedCommentReel(null)}
        />
      )}

      {/* Share Post Direct Message Modal */}
      {selectedShareReel && (
        <SharePostModal
          post={selectedShareReel}
          onClose={() => setSelectedShareReel(null)}
        />
      )}
    </div>
  );
};

export default Reels;
