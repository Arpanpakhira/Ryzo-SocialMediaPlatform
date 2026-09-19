import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Send,
  Check,
  Music,
  Eye,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  MoreVertical,
  Trash2,
  UserPlus,
  BellOff,
  Bell,
  Share2,
  AtSign,
  Sparkles,
  HelpCircle,
  Mic,
  Play,
  Pause,
  Smile,
} from 'lucide-react';
import { getFontFamilyStyle, getDesignEffectClass } from '../utils/typographyStyles';
import { formatStoryTimeAgo } from '../utils/timeAgo';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const StoryViewer = () => {
  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    sendMessage,
    currentUser,
    voteStoryPoll,
    answerStoryQA,
    deleteStory,
    tagStoryUser,
    mutedStoryUserIds,
    toggleMuteStoryUser,
    discoveredHotspots,
    recordHotspotDiscovered,
  } = useApp();
  const { emitSendMessage } = useSocket();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Per-story likes state (tracks which specific story IDs the user has liked)
  const [likedStoryIds, setLikedStoryIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_liked_story_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ryzo_liked_story_ids', JSON.stringify(likedStoryIds));
    } catch (e) {}
  }, [likedStoryIds]);

  // Options & Actions State
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagUsernameInput, setTagUsernameInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Secret Hotspots State
  const [activeHotspotReveal, setActiveHotspotReveal] = useState(null);
  const [revealingHotspotId, setRevealingHotspotId] = useState(null);
  const [voiceWhisperPlaying, setVoiceWhisperPlaying] = useState(false);

  // Reply Input & Quick Reactions State
  const [isTypingReply, setIsTypingReply] = useState(false);
  const [showEmojiReactions, setShowEmojiReactions] = useState(false);

  const STORY_REACTION_EMOJIS = ['❤️', '🔥', '😂', '😮', '😍', '👏', '🎉', '💯'];

  const isPaused = isOptionsOpen || isDeleteConfirmOpen || isTagModalOpen || Boolean(activeHotspotReveal) || isTypingReply;

  // Q&A sticker response input
  const [qaInputText, setQaInputText] = useState('');
  const [qaSubmitted, setQaSubmitted] = useState(false);

  // Quiz sticker selected option state
  const [selectedQuizIdx, setSelectedQuizIdx] = useState(null);

  const audioRef = useRef(null);

  const STORY_DURATION_MS = 30000; // 30 seconds story duration
  const INTERVAL_MS = 100;
  const INCREMENT_PER_TICK = 100 / (STORY_DURATION_MS / INTERVAL_MS);

  // 1. Filter stories created within 24 hours
  const active24hStories = stories.filter((story) => {
    if (!story.createdAt) return true;
    const createdTime = new Date(story.createdAt).getTime();
    return Date.now() - createdTime < TWENTY_FOUR_HOURS_MS;
  });

  const currentStory = active24hStories[activeStoryIndex];

  // Extract Audio details safely from object or string
  const audioTrackObj = currentStory?.audio_track;
  const audioUrl = typeof audioTrackObj === 'object' ? audioTrackObj?.audio_url : (typeof audioTrackObj === 'string' ? audioTrackObj : null);
  const startTime = typeof audioTrackObj === 'object' ? (audioTrackObj?.start_time || 0) : 0;

  // Audio track playback effect for story
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audioUrl && !isPaused && !isMuted) {
      audio.currentTime = startTime;
      audio.play().catch(() => {});
    } else if (audio) {
      audio.pause();
    }
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [activeStoryIndex, currentStory, audioUrl, startTime, isPaused, isMuted]);

  // 2. Extract unique creators who have active 24h stories
  const uniqueCreators = active24hStories.reduce((acc, story) => {
    const isAlreadyAdded = acc.some(
      (c) =>
        (c._id && story.user?._id && c._id === story.user._id) ||
        (c.username && story.user?.username && c.username === story.user.username) ||
        (c.full_name && story.user?.full_name && c.full_name === story.user.full_name)
    );
    if (!isAlreadyAdded && story.user) {
      acc.push(story.user);
    }
    return acc;
  }, []);

  const currentCreatorIndex = currentStory
    ? uniqueCreators.findIndex(
        (c) =>
          (c._id && currentStory.user?._id && c._id === currentStory.user._id) ||
          (c.username && currentStory.user?.username && c.username === currentStory.user.username) ||
          (c.full_name && currentStory.user?.full_name && c.full_name === currentStory.user.full_name)
      )
    : -1;

  // 3. Isolate stories for ONLY the current story creator
  const creatorStories = currentStory
    ? active24hStories.filter(
        (s) =>
          (s.user?._id && s.user?._id === currentStory.user?._id) ||
          (s.user?.username && s.user?.username === currentStory.user?.username) ||
          (s.user?.full_name && s.user?.full_name === currentStory.user?.full_name)
      )
    : [];

  const creatorStoryIndex = currentStory
    ? creatorStories.findIndex((s) => s._id === currentStory._id)
    : -1;

  const isOwnStory =
    currentStory &&
    ((currentStory.user?._id && currentStory.user?._id === currentUser?._id) ||
      (currentStory.user?.username && currentStory.user?.username === currentUser?.username));

  // Switch to NEXT Creator's story deck
  const handleNextCreator = () => {
    if (currentCreatorIndex < uniqueCreators.length - 1) {
      const nextCreator = uniqueCreators[currentCreatorIndex + 1];
      const nextCreatorFirstStory = active24hStories.find(
        (s) =>
          (s.user?._id && s.user?._id === nextCreator?._id) ||
          (s.user?.username && s.user?.username === nextCreator?.username) ||
          (s.user?.full_name && s.user?.full_name === nextCreator?.full_name)
      );
      if (nextCreatorFirstStory) {
        const nextGlobalIndex = active24hStories.findIndex((s) => s._id === nextCreatorFirstStory._id);
        setActiveStoryIndex(nextGlobalIndex);
      }
    } else {
      setActiveStoryIndex(null);
    }
  };

  // Switch to PREVIOUS Creator's story deck
  const handlePrevCreator = () => {
    if (currentCreatorIndex > 0) {
      const prevCreator = uniqueCreators[currentCreatorIndex - 1];
      const prevCreatorFirstStory = active24hStories.find(
        (s) =>
          (s.user?._id && s.user?._id === prevCreator?._id) ||
          (s.user?.username && s.user?.username === prevCreator?.username) ||
          (s.user?.full_name && s.user?.full_name === prevCreator?.full_name)
      );
      if (prevCreatorFirstStory) {
        const prevGlobalIndex = active24hStories.findIndex((s) => s._id === prevCreatorFirstStory._id);
        setActiveStoryIndex(prevGlobalIndex);
      }
    }
  };

  const handleNext = () => {
    if (creatorStoryIndex < creatorStories.length - 1) {
      const nextStoryInDeck = creatorStories[creatorStoryIndex + 1];
      const nextGlobalIdx = active24hStories.findIndex((s) => s._id === nextStoryInDeck._id);
      setActiveStoryIndex(nextGlobalIdx);
    } else {
      handleNextCreator();
    }
  };

  const handlePrev = () => {
    if (creatorStoryIndex > 0) {
      const prevStoryInDeck = creatorStories[creatorStoryIndex - 1];
      const prevGlobalIdx = active24hStories.findIndex((s) => s._id === prevStoryInDeck._id);
      setActiveStoryIndex(prevGlobalIdx);
    } else {
      handlePrevCreator();
    }
  };

  // Auto-progress timer
  useEffect(() => {
    if (!currentStory) return;
    if (isPaused) return; // Pause story timer when options or modal is open

    setProgress(0);
    setQaSubmitted(false);
    setSelectedQuizIdx(null);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          handleNext();
          return 100;
        }
        return prev + INCREMENT_PER_TICK;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused]);

  // Clear active hotspot modal and stop whisper audio on slide change
  useEffect(() => {
    setActiveHotspotReveal(null);
    setRevealingHotspotId(null);
    setIsTypingReply(false);
    setShowEmojiReactions(false);
    setReplyText('');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceWhisperPlaying(false);
  }, [activeStoryIndex]);

  const handleToggleVoiceWhisper = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (voiceWhisperPlaying) {
      window.speechSynthesis.cancel();
      setVoiceWhisperPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setVoiceWhisperPlaying(false);
      utterance.onerror = () => setVoiceWhisperPlaying(false);
      setVoiceWhisperPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTriggerHotspot = (hotspot) => {
    setRevealingHotspotId(hotspot.id);
    if (currentStory?._id) {
      recordHotspotDiscovered(currentStory._id, hotspot.id);
    }
    setTimeout(() => {
      setRevealingHotspotId(null);
      setActiveHotspotReveal(hotspot);
    }, 300);
  };

  const handleNavigateToProfile = (targetUser) => {
    if (!targetUser) return;
    setActiveStoryIndex(null);
    const targetId = targetUser._id || targetUser.username;
    const isSelf =
      (targetUser._id && currentUser?._id && targetUser._id === currentUser._id) ||
      (targetUser.username && currentUser?.username && targetUser.username === currentUser.username);
    navigate(isSelf ? '/profile' : `/profile/${targetId}`);
  };

  const handleSendEmojiReaction = (emoji) => {
    const recipientUser = currentStory.user || currentUser;
    const recipientId = recipientUser._id || recipientUser.username;

    const sharedStoryPayload = {
      _id: currentStory._id,
      media_url: currentStory.media_url,
      content: currentStory.content,
      media_type: currentStory.media_type,
      creator_name: recipientUser.full_name || 'User',
      reaction_emoji: emoji,
    };

    const newMsg = sendMessage(
      recipientId,
      `${emoji} Reacted to your story`,
      '',
      'story_reply',
      { shared_story: sharedStoryPayload }
    );

    if (newMsg) {
      emitSendMessage(newMsg);
    }

    const recipientName = recipientUser.full_name?.split(' ')[0] || 'creator';
    setToastMessage(`${emoji} Reaction sent to ${recipientName}!`);
    setTimeout(() => setToastMessage(''), 2500);
    setShowEmojiReactions(false);
    setIsTypingReply(false);
  };

  const handleToggleLikeStory = () => {
    if (!currentStory?._id) return;
    const storyId = currentStory._id;
    const isCurrentlyLiked = likedStoryIds.includes(storyId);

    if (isCurrentlyLiked) {
      // Unlike this specific story
      setLikedStoryIds((prev) => prev.filter((id) => id !== storyId));
      setToastMessage('Unliked story');
      setTimeout(() => setToastMessage(''), 1800);
    } else {
      // Like ONLY this specific story
      setLikedStoryIds((prev) => [...prev, storyId]);
      handleSendEmojiReaction('❤️');
    }
  };

  const handleSendStoryReply = () => {
    if (!replyText.trim()) return;

    const recipientUser = currentStory.user || currentUser;
    const recipientId = recipientUser._id || recipientUser.username;

    const sharedStoryPayload = {
      _id: currentStory._id,
      media_url: currentStory.media_url,
      content: currentStory.content,
      media_type: currentStory.media_type,
      creator_name: recipientUser.full_name || 'User',
      reply_text: replyText.trim(),
    };

    const newMsg = sendMessage(
      recipientId,
      replyText.trim(),
      '',
      'story_reply',
      { shared_story: sharedStoryPayload }
    );

    if (newMsg) {
      emitSendMessage(newMsg);
    }

    const recipientName = recipientUser.full_name?.split(' ')[0] || 'creator';
    setToastMessage(`Reply sent to ${recipientName}!`);
    setTimeout(() => setToastMessage(''), 2500);

    setReplyText('');
    setIsTypingReply(false);
    setShowEmojiReactions(false);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2000);
  };

  const handleSubmitQA = (e) => {
    e.preventDefault();
    if (!qaInputText.trim()) return;
    answerStoryQA(currentStory._id, qaInputText);
    setQaInputText('');
    setQaSubmitted(true);
    setTimeout(() => setQaSubmitted(false), 3000);
  };

  // Touch drag / swipe down to dismiss story
  const touchStartY = useRef(0);
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY.current > 100) {
      setActiveStoryIndex(null);
    }
  };

  const isCreatorMuted =
    currentStory &&
    currentStory.user &&
    ((mutedStoryUserIds || []).includes(String(currentStory.user._id)) ||
      (mutedStoryUserIds || []).includes(String(currentStory.user.username)));

  const handleConfirmDeleteStory = () => {
    if (!currentStory) return;
    const storyIdToDelete = currentStory._id;
    deleteStory(storyIdToDelete);
    setIsDeleteConfirmOpen(false);
    setIsOptionsOpen(false);
    setToastMessage('Story deleted');
    setTimeout(() => setToastMessage(''), 2500);

    if (creatorStories.length > 1) {
      if (creatorStoryIndex < creatorStories.length - 1) {
        handleNext();
      } else {
        handlePrev();
      }
    } else if (uniqueCreators.length > 1) {
      handleNextCreator();
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handleTagSubmit = (e) => {
    if (e) e.preventDefault();
    if (!tagUsernameInput.trim() || !currentStory) return;
    const cleanUsername = tagUsernameInput.trim().replace('@', '');
    tagStoryUser(currentStory._id, {
      username: cleanUsername,
      full_name: cleanUsername,
    });
    setTagUsernameInput('');
    setIsTagModalOpen(false);
    setToastMessage(`Tagged @${cleanUsername} on story`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleTagUserDirectly = (username) => {
    if (!currentStory) return;
    tagStoryUser(currentStory._id, {
      username,
      full_name: username,
    });
    setIsTagModalOpen(false);
    setToastMessage(`Tagged @${username} on story`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  if (!currentStory) return null;

  // Poll vote metrics calculation
  const sticker = currentStory.sticker;
  const pollVotes = sticker?.type === 'poll' ? sticker.votes || {} : {};
  const totalPollVotes = Object.keys(pollVotes).length;
  const userPollVote = pollVotes[currentUser._id];

  const getPollOptionStats = (optIdx) => {
    if (totalPollVotes === 0) return 0;
    const count = Object.values(pollVotes).filter((v) => v === optIdx).length;
    return Math.round((count / totalPollVotes) * 100);
  };

  // Secret Hotspots Calculations
  const storyHotspots = currentStory?.hotspots || [];
  const storyDiscoveredIds = (discoveredHotspots && currentStory?._id) ? (discoveredHotspots[currentStory._id] || []) : [];
  const foundHotspotCount = storyHotspots.filter((h) => storyDiscoveredIds.includes(h.id)).length;
  const allHotspotsFound = storyHotspots.length > 0 && foundHotspotCount >= storyHotspots.length;

  // Check if THIS specific story is liked
  const isCurrentStoryLiked = currentStory ? likedStoryIds.includes(currentStory._id) : false;

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-150"
    >
      {/* Background overlay click to close (Desktop) */}
      <div 
        onClick={() => setActiveStoryIndex(null)}
        className="hidden md:block absolute inset-0 z-0" 
      />

      {/* Top Creator Slidebar (Desktop Only) */}
      {uniqueCreators.length > 1 && (
        <div className="hidden md:flex absolute top-4 left-0 right-0 z-30 justify-center px-4 pointer-events-auto">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl p-1.5 px-3 rounded-full border border-white/15 shadow-2xl max-w-full overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 border-r border-white/10 pr-2 mr-0.5">
              <Users className="size-3.5" />
              <span className="hidden sm:inline">Creators</span>
            </div>
            {uniqueCreators.map((creator, idx) => {
              const isActive = idx === currentCreatorIndex;
              const creatorFirstStory = active24hStories.find(
                (s) =>
                  (s.user?._id && s.user?._id === creator?._id) ||
                  (s.user?.username && s.user?.username === creator?.username) ||
                  (s.user?.full_name && s.user?.full_name === creator?.full_name)
              );
              const isSelf =
                (creator?._id && creator?._id === currentUser?._id) ||
                (creator?.username && creator?.username === currentUser?.username);

              return (
                <button
                  key={creator?._id || creator?.username || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (creatorFirstStory) {
                      const targetIdx = active24hStories.findIndex((s) => s._id === creatorFirstStory._id);
                      setActiveStoryIndex(targetIdx);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md scale-105 ring-2 ring-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <img
                    src={creator?.profile_picture}
                    alt={creator?.full_name}
                    className="size-5 rounded-full object-cover ring-1 ring-white/50"
                  />
                  <span className="truncate max-w-[90px]">
                    {isSelf ? 'Your Story' : creator?.full_name?.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Wrapper with Outer Side Switch Arrows */}
      <div className="relative z-10 flex items-center justify-center w-full h-full md:h-auto md:max-w-2xl px-0">
        {/* PREVIOUS CREATOR Button */}
        {currentCreatorIndex > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevCreator();
            }}
            title="Previous Creator's Story"
            className="hidden md:flex items-center justify-center size-12 rounded-full bg-slate-900/90 hover:bg-indigo-600 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 shrink-0 mr-4 cursor-pointer"
          >
            <ChevronLeft className="size-7" />
          </button>
        ) : (
          <div className="hidden md:block w-12 mr-4 shrink-0" />
        )}

        {/* Story Player Container Card - Edge-to-edge 100% full screen on mobile just like Instagram */}
        <div className="relative z-10 w-full h-full md:max-w-sm md:h-[650px] bg-black md:bg-slate-900 rounded-none md:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border-0 md:border md:border-white/10 select-none">
          {/* Top Header & Progress Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 pt-safe px-3 py-2.5 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            {/* Progress Segment */}
            <div className="flex gap-1 mb-2.5 sm:mb-3">
              {creatorStories.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{
                      width:
                        idx < creatorStoryIndex
                          ? '100%'
                          : idx === creatorStoryIndex
                          ? `${progress}%`
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* User Info Bar */}
            <div className="flex items-center justify-between">
              <div 
                onClick={() => handleNavigateToProfile(currentStory.user)}
                className="flex items-center gap-3 cursor-pointer group/user"
              >
                <img
                  src={currentStory.user?.profile_picture}
                  alt={currentStory.user?.full_name}
                  className={`size-9 rounded-full object-cover ring-2 ${
                    currentStory.is_close_friends ? 'ring-emerald-400' : 'ring-white/50'
                  } group-hover/user:ring-indigo-400 transition-all`}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white leading-tight group-hover/user:underline">
                      {currentStory.user?.full_name || 'User'}
                    </span>
                    {currentStory.is_close_friends && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Star className="size-2.5 fill-white" />
                        <span>Close Friends</span>
                      </span>
                    )}
                  </div>

                  {/* Under username: Story Posted Time (e.g. 1hrs ago, 4hrs ago) & Audio title */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      title={currentStory.createdAt ? new Date(currentStory.createdAt).toLocaleString() : 'Just now'}
                      className="text-[11px] text-white/80 font-medium tracking-tight"
                    >
                      {formatStoryTimeAgo(currentStory.createdAt)}
                    </span>
                    {currentStory.audio_title && (
                      <>
                        <span className="text-white/40 text-[10px]">•</span>
                        <div className="flex items-center gap-1 text-[11px] text-white/90 font-medium">
                          <Music className="size-3 text-indigo-400 animate-pulse" />
                          <span className="truncate max-w-[130px]">{currentStory.audio_title}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {audioUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                    title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isMuted ? <VolumeX className="size-4 text-rose-400" /> : <Volume2 className="size-4 text-indigo-400" />}
                  </button>
                )}
                {/* Three-Dot Options Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOptionsOpen(true);
                  }}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                  title="Story Options"
                >
                  <MoreVertical className="size-4" />
                </button>
                <button
                  onClick={() => setActiveStoryIndex(null)}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Secret Hotspots Counter Pill (Ryzo Innovation) */}
            {storyHotspots.length > 0 && (
              <div className="mt-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-indigo-500/20 backdrop-blur-md border border-amber-400/40 text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-amber-400/30 flex items-center justify-center">
                    <Sparkles className="size-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-amber-200">
                    {allHotspotsFound
                      ? `🎉 All ${storyHotspots.length} Secrets Found!`
                      : `✨ ${storyHotspots.length - foundHotspotCount} hidden secret${storyHotspots.length - foundHotspotCount === 1 ? '' : 's'} on this slide`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-amber-300">
                    {foundHotspotCount}/{storyHotspots.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content Viewer Body */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Navigation Touch Zones */}
            <div 
              onClick={handlePrev}
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="p-2 rounded-full bg-black/40 text-white">
                <ChevronLeft className="size-6" />
              </div>
            </div>

            <div 
              onClick={handleNext}
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="p-2 rounded-full bg-black/40 text-white">
                <ChevronRight className="size-6" />
              </div>
            </div>

            {/* Media Rendering */}
            {currentStory.media_type === 'text' ? (
              <div
                style={{ backgroundColor: currentStory.background_color || '#4f46e5' }}
                className="size-full flex items-center justify-center p-8 text-center"
              >
                <p
                  style={{
                    fontFamily: getFontFamilyStyle(currentStory.font_style),
                    color: currentStory.text_color || '#ffffff',
                    textAlign: currentStory.text_align || 'center',
                  }}
                  className={`text-xl md:text-2xl font-bold leading-relaxed break-words max-w-sm ${getDesignEffectClass(currentStory.text_design)}`}
                >
                  {currentStory.content}
                </p>
              </div>
            ) : currentStory.media_type === 'video' ? (
              <video
                src={currentStory.media_url}
                autoPlay
                muted
                playsInline
                className="size-full object-cover"
              />
            ) : (
              <img
                src={currentStory.media_url}
                alt="Story content"
                className="size-full object-cover"
              />
            )}

            {/* SECRET HOTSPOTS CANVAS (Interactive Easter Eggs) */}
            {storyHotspots.map((hotspot) => {
              const isFound = storyDiscoveredIds.includes(hotspot.id);
              const isShimmer = hotspot.visibility === 'shimmer';
              const isRevealing = revealingHotspotId === hotspot.id;

              return (
                <div
                  key={hotspot.id}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto select-none"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerHotspot(hotspot);
                    }}
                    title={
                      isFound
                        ? `Discovered: "${hotspot.title}" - Tap to view`
                        : hotspot.hint
                        ? `Hint: ${hotspot.hint}`
                        : 'Secret Hotspot (Tap to reveal!)'
                    }
                    className={`group relative flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      isFound
                        ? 'size-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 shadow-[0_0_18px_rgba(245,158,11,0.9)] ring-2 ring-white scale-100 hover:scale-115'
                        : isShimmer
                        ? 'size-8 rounded-full bg-white/30 backdrop-blur-sm text-white border border-white/60 shadow-lg hover:scale-125 animate-pulse'
                        : 'size-10 rounded-full bg-transparent hover:bg-white/20 text-transparent hover:text-white transition-colors duration-200'
                    }`}
                  >
                    {/* Trigger micro-burst sparkle ping animation */}
                    {isRevealing && (
                      <div className="absolute -inset-4 pointer-events-none flex items-center justify-center animate-ping">
                        <Sparkles className="size-10 text-amber-300" />
                      </div>
                    )}

                    {/* Icon or Hint */}
                    {isFound ? (
                      <Sparkles className="size-4 text-slate-900 fill-slate-900 animate-bounce" />
                    ) : isShimmer ? (
                      <Sparkles className="size-3.5 text-amber-200" />
                    ) : (
                      <span className="opacity-0 group-hover:opacity-100 text-xs transition-opacity">✨</span>
                    )}

                    {/* Subtle radar ripple glow ring */}
                    {(isShimmer || isFound) && (
                      <span
                        className="absolute -inset-1 rounded-full border border-amber-300/40 animate-ping pointer-events-none"
                        style={{ animationDuration: '3s' }}
                      />
                    )}
                  </button>
                </div>
              );
            })}

            {/* Floating Tagged Users Badges */}
            {currentStory.tagged_users && currentStory.tagged_users.length > 0 && (
              <div className="absolute top-20 left-4 z-20 flex flex-wrap gap-1.5 pointer-events-auto">
                {currentStory.tagged_users.map((u, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToProfile(u);
                    }}
                    className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 border border-white/20 hover:bg-black/85 hover:scale-105 transition-all shadow-md cursor-pointer"
                  >
                    <AtSign className="size-3 text-amber-400" />
                    <span>{u.username || u.full_name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Caption Overlay */}
            {currentStory.media_type !== 'text' && currentStory.content && (
              <div className="absolute top-24 left-4 right-4 flex justify-center z-15 pointer-events-none">
                <div
                  style={{
                    fontFamily: getFontFamilyStyle(currentStory.font_style),
                    color: currentStory.text_color || '#ffffff',
                    textAlign: currentStory.text_align || 'center',
                  }}
                  className={`bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl text-xs md:text-sm text-center max-w-[85%] break-words shadow-lg ${getDesignEffectClass(currentStory.text_design)}`}
                >
                  {currentStory.content}
                </div>
              </div>
            )}

            {/* INTERACTIVE STICKER OVERLAY */}
            {sticker?.type === 'poll' && (
              <div className="absolute bottom-20 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-slate-900 shadow-2xl border border-white/60 animate-in zoom-in-95">
                <p className="text-xs font-extrabold text-center mb-3 text-slate-900 leading-tight">
                  {sticker.question || 'Poll Question'}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {sticker.options?.map((option, idx) => {
                    const isSelected = userPollVote === idx;
                    const pct = getPollOptionStats(idx);
                    const showStats = userPollVote !== undefined || isOwnStory;

                    return (
                      <button
                        key={idx}
                        onClick={() => voteStoryPoll(currentStory._id, idx)}
                        className={`relative py-3 px-3 rounded-xl text-xs font-bold transition-all overflow-hidden border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                            : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {/* Vote percentage background bar */}
                        {showStats && (
                          <div
                            style={{ width: `${pct}%` }}
                            className={`absolute inset-y-0 left-0 transition-all duration-500 opacity-25 ${
                              isSelected ? 'bg-white' : 'bg-indigo-600'
                            }`}
                          />
                        )}
                        <div className="relative z-10 flex items-center justify-between gap-1">
                          <span className="truncate">{option}</span>
                          {showStats && <span className="font-mono text-[11px] opacity-90">{pct}%</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                  {totalPollVotes} {totalPollVotes === 1 ? 'vote' : 'votes'} total
                </p>
              </div>
            )}

            {sticker?.type === 'qa' && (
              <div className="absolute bottom-20 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-slate-900 shadow-2xl border border-white/60 animate-in zoom-in-95">
                <div className="text-center mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                    Q&A Prompt
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{sticker.question}</h4>
                </div>

                {qaSubmitted ? (
                  <div className="py-2 text-center text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="size-4" />
                    <span>Response sent to creator!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitQA} className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      placeholder="Type a response..."
                      value={qaInputText}
                      onChange={(e) => setQaInputText(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!qaInputText.trim()}
                      className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                )}
              </div>
            )}

            {sticker?.type === 'quiz' && (
              <div className="absolute bottom-20 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-slate-900 shadow-2xl border border-white/60 animate-in zoom-in-95">
                <p className="text-xs font-extrabold text-center mb-3 text-slate-900">
                  {sticker.question}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {sticker.options?.map((option, idx) => {
                    const isSelected = selectedQuizIdx === idx;
                    const isCorrect = sticker.correct_option_index === idx;
                    const hasAnswered = selectedQuizIdx !== null;

                    let btnClass = 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200';
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-600 text-white border-rose-600 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedQuizIdx(idx)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border ${btnClass}`}
                      >
                        <span className="truncate">{option}</span>
                        {hasAnswered && (
                          isCorrect ? (
                            <CheckCircle2 className="size-3.5 text-white shrink-0 ml-1" />
                          ) : isSelected ? (
                            <XCircle className="size-3.5 text-white shrink-0 ml-1" />
                          ) : null
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sent Toast Notification */}
            {sentSuccess && (
              <div className="absolute top-20 bg-emerald-500 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in duration-200 z-30">
                <Check className="size-4" />
                <span>Reply sent to Direct Message!</span>
              </div>
            )}
          </div>

          {/* Bottom Reaction & Reply Bar (Instagram-style) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="p-3 pb-safe bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-2 relative z-30 pointer-events-auto select-auto"
          >
            {/* Quick Emoji Reactions Tray (Instagram Popover) */}
            {showEmojiReactions && (
              <div className="flex items-center justify-between py-2 px-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/20 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
                {STORY_REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendEmojiReaction(emoji);
                    }}
                    className="text-2xl hover:scale-135 active:scale-95 transition-transform p-1 cursor-pointer"
                    title={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Input & Action Buttons Row */}
            <div className="flex items-center gap-2">
              {/* Optional Your Story Indicator */}
              {isOwnStory && (
                <div 
                  title="Your Story (Active for 24h)"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold shrink-0"
                >
                  <Eye className="size-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Your Story</span>
                </div>
              )}

              {/* Story Reply Input */}
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isOwnStory
                      ? "Reply to your story..."
                      : `Reply to ${currentStory.user?.full_name?.split(' ')[0] || 'story'}...`
                  }
                  value={replyText}
                  onFocus={() => {
                    setIsTypingReply(true);
                    setShowEmojiReactions(true);
                  }}
                  onBlur={() => {
                    // Delay so clicking emoji buttons still registers
                    setTimeout(() => {
                      if (!replyText.trim()) {
                        setIsTypingReply(false);
                      }
                    }, 250);
                  }}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendStoryReply();
                    } else if (e.key === 'Escape') {
                      setIsTypingReply(false);
                      setShowEmojiReactions(false);
                    }
                  }}
                  className="w-full bg-white/15 hover:bg-white/20 focus:bg-slate-900/90 border border-white/25 focus:border-indigo-400 rounded-full pl-4 pr-10 py-2.5 text-xs text-white placeholder-white/60 focus:outline-none transition-all shadow-inner"
                />

                {/* Emoji toggle icon button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiReactions((prev) => !prev);
                    setIsTypingReply(true);
                  }}
                  className="absolute right-2.5 p-1 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Emoji Reactions"
                >
                  <Smile className="size-4" />
                </button>
              </div>

              {/* Heart Like Reaction Button (Scoped strictly to this story) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleLikeStory();
                }}
                className={`p-2.5 rounded-full border transition-transform active:scale-90 cursor-pointer shrink-0 ${
                  isCurrentStoryLiked
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/15 border-white/20 text-white hover:bg-white/25'
                }`}
                title={isCurrentStoryLiked ? "Unlike story" : "Like story"}
              >
                <Heart className={`size-4 ${isCurrentStoryLiked ? 'fill-white' : ''}`} />
              </button>

              {/* Send Button */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendStoryReply();
                }}
                disabled={!replyText.trim()}
                className="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                title="Send Reply"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>

          {/* Story Background Audio Track Element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              muted={isMuted}
              autoPlay
              loop
            />
          )}
        </div>

        {/* NEXT CREATOR Button */}
        {currentCreatorIndex < uniqueCreators.length - 1 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextCreator();
            }}
            title="Next Creator's Story"
            className="hidden md:flex items-center justify-center size-12 rounded-full bg-slate-900/90 hover:bg-indigo-600 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 shrink-0 ml-4 cursor-pointer"
          >
            <ChevronRight className="size-7" />
          </button>
        ) : (
          <div className="hidden md:block w-12 mr-4 shrink-0" />
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-80 px-4 py-2 rounded-full bg-slate-900/95 text-white text-xs font-bold border border-white/20 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <Check className="size-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Three-Dot Options Modal / Bottom Sheet */}
      {isOptionsOpen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsOptionsOpen(false);
          }}
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-white/15 text-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MoreVertical className="size-4 text-amber-400" />
                <h4 className="text-sm font-bold">Story Options</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsOptionsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-3 flex flex-col gap-1.5">
              {/* Tag Someone Option */}
              <button
                type="button"
                onClick={() => {
                  setIsOptionsOpen(false);
                  setIsTagModalOpen(true);
                }}
                className="w-full px-4 py-3 rounded-2xl hover:bg-white/10 text-left text-sm font-semibold flex items-center gap-3 transition-colors text-slate-200 hover:text-white"
              >
                <div className="size-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <UserPlus className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span>Tag Someone</span>
                  <span className="text-[11px] text-slate-400 font-normal">Mention friends or collaborators on this story</span>
                </div>
              </button>

              {/* Mute Someone Option (For other creators) */}
              {!isOwnStory && (
                <button
                  type="button"
                  onClick={() => {
                    const creatorId = currentStory.user?._id || currentStory.user?.username;
                    toggleMuteStoryUser(creatorId);
                    const nowMuted = !isCreatorMuted;
                    setToastMessage(nowMuted ? `Muted stories from @${currentStory.user?.username || 'user'}` : `Unmuted stories from @${currentStory.user?.username || 'user'}`);
                    setTimeout(() => setToastMessage(''), 2500);
                    setIsOptionsOpen(false);
                    if (nowMuted) {
                      handleNextCreator();
                    }
                  }}
                  className="w-full px-4 py-3 rounded-2xl hover:bg-white/10 text-left text-sm font-semibold flex items-center gap-3 transition-colors text-slate-200 hover:text-white"
                >
                  <div className="size-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    {isCreatorMuted ? <Bell className="size-4" /> : <BellOff className="size-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span>{isCreatorMuted ? 'Unmute Stories' : `Mute @${currentStory.user?.username || 'User'}`}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {isCreatorMuted ? 'Receive and view stories normally' : "Don't automatically play stories from this user"}
                    </span>
                  </div>
                </button>
              )}

              {/* Copy Story Link */}
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    setToastMessage('Story link copied to clipboard!');
                    setTimeout(() => setToastMessage(''), 2500);
                  }
                  setIsOptionsOpen(false);
                }}
                className="w-full px-4 py-3 rounded-2xl hover:bg-white/10 text-left text-sm font-semibold flex items-center gap-3 transition-colors text-slate-200 hover:text-white"
              >
                <div className="size-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Share2 className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span>Copy Link</span>
                  <span className="text-[11px] text-slate-400 font-normal">Share this story with friends</span>
                </div>
              </button>

              {/* Delete Story Option (For user's own story) */}
              {isOwnStory && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsOpen(false);
                    setIsDeleteConfirmOpen(true);
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-left text-sm font-semibold flex items-center gap-3 transition-colors text-rose-400 border border-rose-500/20 mt-1"
                >
                  <div className="size-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Trash2 className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">Delete Story</span>
                    <span className="text-[11px] text-rose-300/80 font-normal">Permanently remove this story</span>
                  </div>
                </button>
              )}
            </div>

            <div className="p-3 bg-white/5 border-t border-white/10 flex justify-center">
              <button
                type="button"
                onClick={() => setIsOptionsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Story Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div
          onClick={() => setIsDeleteConfirmOpen(false)}
          className="fixed inset-0 z-70 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-rose-500/30 text-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150 text-center"
          >
            <div className="size-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-white">Delete Story?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This story will be permanently removed and disappear from your profile and active stories ring.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStory}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-900/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Someone Modal */}
      {isTagModalOpen && (
        <div
          onClick={() => setIsTagModalOpen(false)}
          className="fixed inset-0 z-70 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-white/20 text-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="size-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Tag Someone on Story</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTagModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleTagSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <AtSign className="size-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter username (e.g. alex_m)"
                  value={tagUsernameInput}
                  onChange={(e) => setTagUsernameInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white text-black placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quick suggestions from community */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-slate-400 font-semibold">Quick Tag:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['alex_m', 'sarah_c', 'elena_r', 'marcus_k', 'david_p'].map((uname) => (
                    <button
                      key={uname}
                      type="button"
                      onClick={() => handleTagUserDirectly(uname)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-indigo-600 hover:text-white text-[11px] text-slate-300 font-medium transition-all"
                    >
                      @{uname}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTagModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!tagUsernameInput.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all"
                >
                  Add Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Secret Easter Egg Reveal Popover Modal */}
      {activeHotspotReveal && (
        <div
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            setVoiceWhisperPlaying(false);
            setActiveHotspotReveal(null);
          }}
          className="fixed inset-0 z-70 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-amber-400/40 text-white rounded-3xl p-5 shadow-2xl shadow-amber-500/10 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  <Sparkles className="size-4.5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                      Easter Egg Discovered!
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[9px] text-slate-300">
                      {activeHotspotReveal.type === 'whisper'
                        ? '🎙️ Voice Whisper'
                        : activeHotspotReveal.type === 'media'
                        ? '🖼️ Secret Photo'
                        : '📝 Secret Note'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight mt-0.5">
                    {activeHotspotReveal.title || 'Hidden Secret'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setVoiceWhisperPlaying(false);
                  setActiveHotspotReveal(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Secret Content Body */}
            <div className="flex flex-col gap-3">
              {/* Type: Note */}
              {(!activeHotspotReveal.type || activeHotspotReveal.type === 'note') && (
                <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/20 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-2 -right-2 opacity-10 pointer-events-none">
                    <Sparkles className="size-20 text-amber-300" />
                  </div>
                  <p className="text-xs md:text-sm text-amber-100 font-medium leading-relaxed italic relative z-10">
                    "{activeHotspotReveal.content || 'You unlocked a secret note on this story!'}"
                  </p>
                </div>
              )}

              {/* Type: Media / Meme */}
              {activeHotspotReveal.type === 'media' && (
                <div className="flex flex-col gap-2">
                  <div className="w-full h-56 rounded-2xl overflow-hidden border border-white/15 bg-black flex items-center justify-center shadow-lg relative">
                    <img
                      src={activeHotspotReveal.media_url || activeHotspotReveal.content}
                      alt={activeHotspotReveal.title || 'Secret Media'}
                      className="size-full object-cover"
                    />
                  </div>
                  {activeHotspotReveal.content && activeHotspotReveal.content !== activeHotspotReveal.media_url && (
                    <p className="text-xs text-slate-300 text-center italic">
                      "{activeHotspotReveal.content}"
                    </p>
                  )}
                </div>
              )}

              {/* Type: Voice Whisper */}
              {activeHotspotReveal.type === 'whisper' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-400/30 flex flex-col items-center gap-3 text-center">
                  <div className="size-14 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                    <Mic className="size-7 animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-white">Behind-the-Scenes Voice Whisper</span>
                    <p className="text-xs text-indigo-200/90 italic">
                      "{activeHotspotReveal.whisper_text || activeHotspotReveal.content || 'Listen to this creator whisper...'}"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleVoiceWhisper(
                        activeHotspotReveal.whisper_text ||
                          activeHotspotReveal.content ||
                          'Hey, you found my secret easter egg!'
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                      voiceWhisperPlaying
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {voiceWhisperPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                    <span>{voiceWhisperPlaying ? 'Stop Whisper' : 'Play Whisper'}</span>
                  </button>
                </div>
              )}

              {/* Creator Attribution */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <img
                    src={currentStory.user?.profile_picture}
                    alt={currentStory.user?.full_name}
                    className="size-4.5 rounded-full object-cover"
                  />
                  <span>
                    Hidden by <strong className="text-white">@{currentStory.user?.username || 'creator'}</strong>
                  </span>
                </div>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="size-3" /> Found
                </span>
              </div>
            </div>

            {/* Resume Story Button */}
            <button
              type="button"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setVoiceWhisperPlaying(false);
                setActiveHotspotReveal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              ✨ Resume Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
