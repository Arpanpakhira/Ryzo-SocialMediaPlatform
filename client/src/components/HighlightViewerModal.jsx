import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatStoryTimeAgo } from '../utils/timeAgo';

const HighlightViewerModal = () => {
  const {
    activeHighlight,
    setActiveHighlight,
    currentUser,
    deleteHighlight,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  if (!activeHighlight || !activeHighlight.stories?.length) return null;

  const currentStory = activeHighlight.stories[currentIndex] || activeHighlight.stories[0];
  const totalStories = activeHighlight.stories.length;

  // Auto-advance progress timer
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, activeHighlight]);

  const audioTrackObj = currentStory?.audio_track;
  const audioUrl = typeof audioTrackObj === 'object' ? audioTrackObj?.audio_url : (typeof audioTrackObj === 'string' ? audioTrackObj : null);
  const startTime = typeof audioTrackObj === 'object' ? (audioTrackObj?.start_time || 0) : 0;

  // Audio track playback
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentIndex, currentStory, audioUrl, startTime]);

  const handleNext = () => {
    if (currentIndex < totalStories - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setActiveHighlight(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDeleteHighlight = () => {
    deleteHighlight(activeHighlight._id);
    setActiveHighlight(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black md:bg-black/90 md:backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-200">
      
      {/* Background Close Overlay (Desktop) */}
      <div className="hidden md:block absolute inset-0" onClick={() => setActiveHighlight(null)} />

      {/* Main Highlight Card Player - Fullscreen on mobile */}
      <div className="relative w-full h-full md:max-w-sm md:h-[85vh] md:max-h-[700px] bg-black md:bg-slate-900 rounded-none md:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border-0 md:border md:border-slate-800/60 z-10 animate-in zoom-in-95 duration-200 select-none">
        
        {/* Top Progress Segment Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-safe px-3 pt-2 sm:pt-3 flex items-center gap-1.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {activeHighlight.stories.map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header info */}
        <div className="absolute top-6 sm:top-7 left-3 right-3 z-20 pt-safe flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <img
              src={activeHighlight.cover_image || currentStory.user?.profile_picture}
              alt={activeHighlight.title}
              className="size-9 rounded-full object-cover ring-2 ring-white/60"
            />
            <div className="flex flex-col">
              <span className="text-xs font-extrabold tracking-tight flex items-center gap-1">
                {activeHighlight.title}
                <Sparkles className="size-3 text-amber-400" />
              </span>
              <span className="text-[10px] text-white/80 font-medium flex items-center gap-1.5">
                <span>@{currentStory.user?.username || currentUser.username}</span>
                {currentStory.createdAt && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-white/70">{formatStoryTimeAgo(currentStory.createdAt)}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {audioUrl && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            )}

            {activeHighlight.user_id === currentUser._id && (
              <button
                onClick={handleDeleteHighlight}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                title="Delete Highlight"
              >
                <Trash2 className="size-4" />
              </button>
            )}

            <button
              onClick={() => setActiveHighlight(null)}
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Story Content Area */}
        <div className="relative size-full flex items-center justify-center bg-slate-950">
          {currentStory.media_url ? (
            <img
              src={currentStory.media_url}
              alt="Highlight Story"
              className="size-full object-cover"
            />
          ) : (
            <div
              className="size-full p-8 flex flex-col items-center justify-center text-center text-white font-extrabold text-lg leading-relaxed"
              style={{ backgroundColor: currentStory.background_color || '#4f46e5' }}
            >
              <p>{currentStory.content}</p>
            </div>
          )}

          {/* Overlay Text Caption */}
          {currentStory.media_url && currentStory.content && (
            <div className="absolute bottom-6 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md text-white text-xs text-center font-medium">
              {currentStory.content}
            </div>
          )}

          {/* Audio Track Tag Badge */}
          {currentStory.audio_title && (
            <div className="absolute top-16 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md">
              <span className="animate-spin text-purple-400">🎵</span>
              <span>{currentStory.audio_title}</span>
            </div>
          )}
        </div>

        {/* Navigation Touch Controls */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 disabled:opacity-0 transition-all z-20"
        >
          <ChevronLeft className="size-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 transition-all z-20"
        >
          <ChevronRight className="size-6" />
        </button>

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            muted={isMuted}
            loop
          />
        )}
      </div>
    </div>
  );
};

export default HighlightViewerModal;
