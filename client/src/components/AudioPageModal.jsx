import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Music,
  Play,
  Pause,
  Bookmark,
  Plus,
  Flame,
  TrendingUp,
  Film,
  Heart,
  MessageCircle,
  Share2,
  Volume2,
} from 'lucide-react';

const AudioPageModal = ({ audioTrack, reels = [], onClose, onSelectReel, onUseAudio }) => {
  const { toggleSaveAudio, isAudioSaved } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const title = audioTrack?.title || audioTrack?.audio_title || 'Original Audio';
  const artist = audioTrack?.artist || audioTrack?.user?.full_name || 'Original Audio';
  const artwork =
    audioTrack?.artwork ||
    audioTrack?.user?.profile_picture ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200';
  const audioUrl = audioTrack?.audio_url || '';
  const isTrending = audioTrack?.is_trending ?? true;
  const reelsCount = reels.length > 0 ? reels.length * 480 + 120 : (audioTrack?.reels_count || 1420);

  const saved = isAudioSaved(audioTrack);

  const togglePlayAudio = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      {/* Background overlay click to close */}
      <div onClick={onClose} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Music className="size-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-wide">Audio Page</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Audio Hero Header Banner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 rounded-3xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 size-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Vinyl / Cover Art with Play overlay */}
            <div className="relative group shrink-0">
              <div className="size-28 sm:size-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-slate-950 flex items-center justify-center">
                <img
                  src={artwork}
                  alt={title}
                  className={`size-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                  }`}
                />
              </div>

              {audioUrl && (
                <button
                  onClick={togglePlayAudio}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors rounded-2xl group"
                >
                  <div className="p-3.5 rounded-full bg-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="size-6 fill-white" /> : <Play className="size-6 fill-white ml-0.5" />}
                  </div>
                </button>
              )}

              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                />
              )}
            </div>

            {/* Track Info & Actions */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-2.5">
              {isTrending && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                  <Flame className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>Trending Audio Track</span>
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {artist}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Film className="size-3.5 text-indigo-400" />
                  <strong className="text-white font-bold">{reelsCount.toLocaleString()}</strong> reels
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Volume2 className="size-3.5 text-emerald-400" /> High Quality
                </span>
              </div>

              {/* Action Buttons: Use Audio & Save Sound */}
              <div className="flex items-center gap-3 mt-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (onUseAudio) {
                      onUseAudio({
                        title,
                        artist,
                        artwork,
                        audio_url: audioUrl,
                      });
                    }
                    onClose();
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Plus className="size-4" />
                  <span>Use Audio</span>
                </button>

                <button
                  onClick={() => toggleSaveAudio({ id: title, title, artist, artwork, audio_url: audioUrl, reels_count: reelsCount, is_trending: isTrending })}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    saved
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Bookmark className={`size-4 ${saved ? 'fill-indigo-400 text-indigo-400' : ''}`} />
                  <span>{saved ? 'Saved' : 'Save Audio'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid Section Title */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white tracking-wide">Top Reels with this Audio</h4>
            </div>
            <span className="text-xs text-slate-400">Public Feed</span>
          </div>

          {/* Reels Grid (3 Columns) */}
          {reels.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {reels.map((reel) => {
                const likesCount = reel.likes_count?.length || 0;
                const commentsCount = reel.comments?.length || 0;
                return (
                  <div
                    key={reel._id}
                    onClick={() => {
                      if (onSelectReel) onSelectReel(reel);
                      onClose();
                    }}
                    className="relative aspect-[9/16] bg-slate-950 rounded-2xl overflow-hidden cursor-pointer group border border-slate-800 hover:border-indigo-500/50 transition-all shadow-md"
                  >
                    <video
                      src={reel.video_url}
                      muted
                      playsInline
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Likes & Comments Overlay on Hover */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] font-semibold">
                      <span className="flex items-center gap-1">
                        <Heart className="size-3 text-rose-400 fill-rose-400" />
                        {likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="size-3 text-indigo-300" />
                        {commentsCount}
                      </span>
                    </div>

                    {/* Creator avatar badge */}
                    {reel.user?.profile_picture && (
                      <img
                        src={reel.user.profile_picture}
                        alt={reel.user?.full_name}
                        className="absolute top-2 left-2 size-6 rounded-full object-cover border border-white/60 shadow-md"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 gap-3 bg-slate-950/40 rounded-2xl border border-slate-800">
              <Film className="size-10 text-slate-600" />
              <p className="text-sm font-medium">Be the first to create a Reel with this audio!</p>
              <button
                onClick={() => {
                  if (onUseAudio) {
                    onUseAudio({ title, artist, artwork, audio_url: audioUrl });
                  }
                  onClose();
                }}
                className="mt-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                Create Reel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPageModal;
