import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Image,
  Video,
  Type,
  Palette,
  Sparkles,
  Upload,
  Music,
  BarChart2,
  MessageSquare,
  HelpCircle,
  Star,
  Globe,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Trash2,
  Film,
  Camera,
  Target,
  Gift,
  Eye,
  EyeOff,
} from 'lucide-react';
import MusicPickerModal from './MusicPickerModal';
import {
  FONT_STYLES,
  DESIGN_EFFECTS,
  TEXT_PALETTE,
  getFontFamilyStyle,
  getDesignEffectClass,
} from '../utils/typographyStyles';

const BACKGROUND_GRADIENTS = [
  '#4f46e5', // Indigo
  '#7c3aed', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#059669', // Emerald
  '#0284c7', // Sky
  '#1e293b', // Slate Dark
];

const compressImageForStory = (file, maxWidth = 1440, maxHeight = 1920, quality = 0.85) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

const StoryCreatorModal = () => {
  const { setIsCreateStoryOpen, addStory } = useApp();
  const [mediaType, setMediaType] = useState('text'); // 'text', 'image', 'video'
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [bgColor, setBgColor] = useState('#4f46e5');
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  // Typography & Design Style states
  const [fontStyle, setFontStyle] = useState('modern');
  const [textDesign, setTextDesign] = useState('plain');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState('center');

  // Close Friends & Sticker states
  const [isCloseFriends, setIsCloseFriends] = useState(false);
  const [stickerType, setStickerType] = useState(null); // null, 'poll', 'qa', 'quiz'

  // Sticker data inputs
  const [pollQuestion, setPollQuestion] = useState('Would you try this?');
  const [pollOptions, setPollOptions] = useState(['Yes 😍', 'No 😅']);

  const [qaPrompt, setQaPrompt] = useState('Ask me a question!');

  const [quizQuestion, setQuizQuestion] = useState('Guess the right answer!');
  const [quizOptions, setQuizOptions] = useState(['Option A', 'Option B', 'Option C', 'Option D']);
  const [quizCorrectIdx, setQuizCorrectIdx] = useState(0);

  // Secret Hotspots (Easter Eggs) States
  const [hotspots, setHotspots] = useState([]);
  const [isPlacingHotspot, setIsPlacingHotspot] = useState(false);
  const [activeHotspotModal, setActiveHotspotModal] = useState(null);

  const activeMediaUrl = mediaType === 'image' ? photoUrl : (mediaType === 'video' ? videoUrl : '');

  const handlePreviewCanvasClick = (e) => {
    if (!isPlacingHotspot) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const xPct = Math.max(8, Math.min(92, Math.round((clickX / rect.width) * 100)));
    const yPct = Math.max(8, Math.min(92, Math.round((clickY / rect.height) * 100)));

    setActiveHotspotModal({
      id: 'hotspot_' + Date.now(),
      x: xPct,
      y: yPct,
      type: 'note',
      title: 'Secret Easter Egg 🤫',
      content: '',
      hint: '',
      visibility: 'shimmer',
    });
    setIsPlacingHotspot(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (mediaType === 'video' || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoUrl(reader.result);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        const compressed = await compressImageForStory(file);
        if (compressed) {
          setPhotoUrl(compressed);
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhotoUrl(reader.result);
          };
          reader.readAsDataURL(file);
        }
        setIsUploading(false);
      }

      // Backend media upload fallback
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:5000/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (mediaType === 'video') {
          setVideoUrl(data.url);
        } else {
          setPhotoUrl(data.url);
        }
      }
    } catch (err) {
      console.log('Processed local story media:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!content.trim() && !activeMediaUrl.trim() && !stickerType) return;

    const trackTitle = selectedMusic
      ? `${selectedMusic.title} • ${selectedMusic.artist}`
      : null;

    let stickerPayload = null;
    if (stickerType === 'poll') {
      stickerPayload = {
        type: 'poll',
        question: pollQuestion.trim() || 'Poll Question',
        options: pollOptions.map((opt, i) => opt.trim() || `Option ${i + 1}`),
        votes: {},
      };
    } else if (stickerType === 'qa') {
      stickerPayload = {
        type: 'qa',
        question: qaPrompt.trim() || 'Ask me a question!',
        responses: [],
      };
    } else if (stickerType === 'quiz') {
      stickerPayload = {
        type: 'quiz',
        question: quizQuestion.trim() || 'Quiz Question',
        options: quizOptions.map((opt, i) => opt.trim() || `Option ${i + 1}`),
        correct_option_index: quizCorrectIdx,
        votes: {},
      };
    }

    addStory({
      content,
      media_url: activeMediaUrl,
      media_type: mediaType,
      background_color: bgColor,
      font_style: fontStyle,
      text_design: textDesign,
      text_color: textColor,
      text_align: textAlign,
      audio_track: selectedMusic,
      audio_title: trackTitle,
      is_close_friends: isCloseFriends,
      sticker: stickerPayload,
      hotspots: hotspots,
    });

    setIsCreateStoryOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">Create New Story</h3>
          </div>
          <button
            onClick={() => setIsCreateStoryOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Story Type Selector Tabs */}
        <div className="p-3 bg-slate-50 flex gap-2 border-b border-slate-100">
          <button
            type="button"
            onClick={() => {
              setMediaType('text');
              setShowUrlInput(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mediaType === 'text'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Type className="size-4" />
            <span>Text</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaType('image');
              setShowUrlInput(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mediaType === 'image'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Image className="size-4" />
            <span>Photo</span>
            {photoUrl && <span className="size-2 rounded-full bg-emerald-400 shrink-0" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaType('video');
              setShowUrlInput(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mediaType === 'video'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Video className="size-4" />
            <span>Video</span>
            {videoUrl && <span className="size-2 rounded-full bg-emerald-400 shrink-0" />}
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          {/* Hidden File Input (Reusable for Photo and Video) */}
          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === 'video' ? 'video/*' : 'image/*'}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Live Preview Box */}
          <div className="w-full h-60 rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center border border-slate-200 bg-slate-900">
            {/* Song Badge Overlay on Preview */}
            {selectedMusic && (
              <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/20 shadow-md">
                <Music className="size-3 text-indigo-400 animate-pulse" />
                <span className="truncate max-w-[160px]">
                  {selectedMusic.title} • {selectedMusic.artist}
                </span>
              </div>
            )}

            {/* Close Friends Badge Indicator on Preview */}
            {isCloseFriends && (
              <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                <Star className="size-3 fill-white" />
                <span>Close Friends</span>
              </div>
            )}

            {/* Media Content */}
            {mediaType === 'text' ? (
              <div
                onClick={handlePreviewCanvasClick}
                style={{ backgroundColor: bgColor }}
                className={`size-full p-6 flex flex-col items-center justify-center text-center transition-colors duration-300 relative ${
                  isPlacingHotspot ? 'cursor-crosshair' : ''
                }`}
              >
                <p
                  style={{
                    fontFamily: getFontFamilyStyle(fontStyle),
                    color: textColor,
                    textAlign: textAlign,
                  }}
                  className={`text-base sm:text-lg font-bold leading-relaxed break-words max-w-xs transition-all ${getDesignEffectClass(textDesign)}`}
                >
                  {content || 'Type your story message here...'}
                </p>

                {/* Placed Hotspot Pins on Text Canvas */}
                {hotspots.map((h, i) => (
                  <div
                    key={h.id || i}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHotspots((prev) => prev.filter((item) => item.id !== h.id));
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer pointer-events-auto group/pin"
                    title="Click to remove Easter Egg"
                  >
                    <div className="size-6 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] flex items-center justify-center border-2 border-white shadow-xl animate-bounce">
                      ✨
                    </div>
                  </div>
                ))}
              </div>
            ) : activeMediaUrl ? (
              <div
                onClick={handlePreviewCanvasClick}
                className={`relative size-full group ${isPlacingHotspot ? 'cursor-crosshair' : ''}`}
              >
                {mediaType === 'video' ? (
                  <video src={activeMediaUrl} controls className="size-full object-cover" />
                ) : (
                  <img src={activeMediaUrl} alt="Preview" className="size-full object-cover" />
                )}
                {content && (
                  <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none z-10">
                    <div
                      style={{
                        fontFamily: getFontFamilyStyle(fontStyle),
                        color: textColor,
                        textAlign: textAlign,
                      }}
                      className={`bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs max-w-[85%] break-words ${getDesignEffectClass(textDesign)}`}
                    >
                      {content}
                    </div>
                  </div>
                )}

                {/* Placed Hotspot Pins on Image Canvas */}
                {hotspots.map((h, i) => (
                  <div
                    key={h.id || i}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHotspots((prev) => prev.filter((item) => item.id !== h.id));
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer pointer-events-auto group/pin"
                    title="Click to remove Easter Egg"
                  >
                    <div className="size-6 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] flex items-center justify-center border-2 border-white shadow-xl animate-bounce group-hover/pin:scale-125 transition-transform">
                      ✨
                    </div>
                    <div className="hidden group-hover/pin:flex absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md border border-white/20 items-center gap-1">
                      <span>{h.title || 'Easter Egg'}</span>
                      <span className="text-rose-400">×</span>
                    </div>
                  </div>
                ))}

                {/* Placement Mode Active Banner */}
                {isPlacingHotspot && (
                  <div className="absolute inset-x-3 top-3 z-30 py-1.5 px-3 rounded-xl bg-amber-500 text-slate-950 text-[11px] font-extrabold flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-top duration-150">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5 animate-spin" />
                      <span>Tap anywhere on the image to place your secret!</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlacingHotspot(false);
                      }}
                      className="px-1.5 py-0.5 rounded bg-black/20 text-slate-950 hover:bg-black/40 text-[10px] font-bold ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Overlay replace button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity shadow-lg z-20 backdrop-blur-sm"
                >
                  <Upload className="size-3" />
                  <span>Change {mediaType === 'video' ? 'Video' : 'Photo'}</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 text-center text-slate-400 cursor-pointer hover:text-indigo-400 transition-colors size-full group"
              >
                <div className="size-14 rounded-2xl bg-slate-800/80 group-hover:bg-slate-800 flex items-center justify-center text-indigo-400 mb-2 border border-slate-700/80 group-hover:scale-105 transition-all shadow-inner">
                  {mediaType === 'video' ? <Video className="size-7" /> : <Image className="size-7" />}
                </div>
                <p className="text-xs font-bold text-white mb-0.5">
                  Click to select {mediaType === 'video' ? 'video' : 'photo'} file
                </p>
                <p className="text-[11px] text-slate-400">
                  {mediaType === 'video' ? 'MP4, WEBM, MOV up to 50MB' : 'JPG, PNG, WEBP, GIF up to 20MB'}
                </p>
              </div>
            )}

            {/* Live Interactive Sticker Preview Overlay */}
            {stickerType === 'poll' && (
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 text-slate-900 shadow-xl border border-white/60 pointer-events-none animate-in zoom-in-95">
                <p className="text-xs font-bold text-center mb-2 text-indigo-950">{pollQuestion || 'Poll Question'}</p>
                <div className="grid grid-cols-2 gap-2">
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="py-2 px-3 bg-slate-100 rounded-xl text-center text-xs font-bold text-slate-800">
                      {opt || `Option ${i + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stickerType === 'qa' && (
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 text-center text-slate-900 shadow-xl border border-white/60 pointer-events-none animate-in zoom-in-95">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold mb-1">
                  Q&A Prompt
                </div>
                <p className="text-xs font-bold text-slate-900">{qaPrompt || 'Ask me a question!'}</p>
                <div className="mt-2 py-1.5 px-3 bg-slate-100 rounded-xl text-slate-400 text-[11px] font-medium">
                  Type a response...
                </div>
              </div>
            )}

            {stickerType === 'quiz' && (
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 text-slate-900 shadow-xl border border-white/60 pointer-events-none animate-in zoom-in-95">
                <p className="text-xs font-bold text-center mb-2 text-indigo-950">{quizQuestion || 'Quiz Question'}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {quizOptions.map((opt, i) => (
                    <div
                      key={i}
                      className={`py-1.5 px-2 rounded-xl text-center text-[11px] font-bold flex items-center justify-between ${
                        quizCorrectIdx === i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{opt || `Option ${i + 1}`}</span>
                      {quizCorrectIdx === i && <Check className="size-3 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DEDICATED TAB CONTROLS */}
          {mediaType === 'text' ? (
            /* Dedicated Text Tab Controls */
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">Story Text</label>
              <textarea
                rows={2}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
              />

              <div className="flex items-center gap-2 mt-1">
                <Palette className="size-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Background:</span>
                <div className="flex gap-2">
                  {BACKGROUND_GRADIENTS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBgColor(color)}
                      style={{ backgroundColor: color }}
                      className={`size-6 rounded-full border-2 transition-transform ${
                        bgColor === color ? 'scale-125 border-slate-800' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : mediaType === 'image' ? (
            /* Dedicated Photo Tab Controls */
            <div className="flex flex-col gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Image className="size-4 text-indigo-600" />
                  <span>Choose Story Photo</span>
                </span>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="text-[11px] text-rose-500 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="size-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              {/* Upload Photo Button & URL Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="size-4" />
                  <span>{photoUrl ? 'Replace Photo' : 'Upload from Device'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <LinkIcon className="size-3.5 text-slate-500" />
                  <span>{showUrlInput ? 'Hide URL' : 'Paste Image URL'}</span>
                </button>
              </div>

              {/* Image URL Input Form */}
              {showUrlInput && (
                <div className="flex gap-2 animate-in fade-in duration-150">
                  <input
                    type="url"
                    placeholder="Paste image link (https://...)"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (urlInput.trim()) {
                        setPhotoUrl(urlInput.trim());
                        setUrlInput('');
                        setShowUrlInput(false);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Photo Preview Container */}
              {photoUrl ? (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <Image className="size-3.5 text-indigo-600" />
                      <span>Photo Preview</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Photo Attached
                    </span>
                  </div>
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner group flex items-center justify-center">
                    <img src={photoUrl} alt="Photo preview" className="size-full object-contain sm:object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 flex items-center justify-between">
                      <span className="text-white text-xs font-semibold drop-shadow truncate">Attached Photo</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-[11px] font-bold shadow transition-all flex items-center gap-1"
                        >
                          <Upload className="size-3" />
                          <span>Change</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="p-1 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white transition-colors"
                          title="Remove Photo"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-2xl cursor-pointer transition-all text-center group"
                >
                  <div className="size-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 transition-transform group-hover:scale-110">
                    <Image className="size-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Select or drop a photo</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, WEBP, GIF up to 20MB</p>
                </div>
              )}

              {/* Photo Caption */}
              <div className="pt-1">
                <label className="text-xs font-semibold text-slate-700">Photo Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="Add a caption to your photo story..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>
          ) : (
            /* Dedicated Video Tab Controls */
            <div className="flex flex-col gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Video className="size-4 text-indigo-600" />
                  <span>Choose Story Video</span>
                </span>
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="text-[11px] text-rose-500 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="size-3" />
                    <span>Remove Video</span>
                  </button>
                )}
              </div>

              {/* Upload Video Button & URL Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="size-4" />
                  <span>{videoUrl ? 'Replace Video' : 'Upload Video File'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <LinkIcon className="size-3.5 text-slate-500" />
                  <span>{showUrlInput ? 'Hide URL' : 'Paste Video URL'}</span>
                </button>
              </div>

              {/* Video URL Input Form */}
              {showUrlInput && (
                <div className="flex gap-2 animate-in fade-in duration-150">
                  <input
                    type="url"
                    placeholder="Paste video MP4 URL (https://...)"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (urlInput.trim()) {
                        setVideoUrl(urlInput.trim());
                        setUrlInput('');
                        setShowUrlInput(false);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Video Preview Container */}
              {videoUrl ? (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <Video className="size-3.5 text-indigo-600" />
                      <span>Video Preview</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Video Attached
                    </span>
                  </div>
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-inner group flex items-center justify-center">
                    <video src={videoUrl} controls playsInline className="size-full object-contain max-h-48" />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-2xl cursor-pointer transition-all text-center group"
                >
                  <div className="size-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 transition-transform group-hover:scale-110">
                    <Video className="size-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Select or drop a video</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">MP4, WEBM, MOV up to 50MB</p>
                </div>
              )}

              {/* Video Caption */}
              <div className="pt-1">
                <label className="text-xs font-semibold text-slate-700">Video Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="Add a caption to your video story..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Typography Styles & Designs Selector */}
          <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Type className="size-3.5 text-indigo-600" />
                <span>Font Styles & Typography</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Instant preview</span>
            </div>

            {/* Font Style Horizontal Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {FONT_STYLES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontStyle(f.id)}
                  style={{ fontFamily: f.fontFamily }}
                  className={`px-3 py-1.5 rounded-xl text-xs shrink-0 transition-all border ${
                    fontStyle === f.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Design Effects Horizontal Pills */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" />
                <span>Design Effect</span>
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {DESIGN_EFFECTS.map((effect) => (
                  <button
                    key={effect.id}
                    type="button"
                    onClick={() => setTextDesign(effect.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium shrink-0 transition-all border ${
                      textDesign === effect.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {effect.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color & Alignment Row */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-600">Color:</span>
                <div className="flex gap-1.5">
                  {TEXT_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTextColor(c)}
                      style={{ backgroundColor: c }}
                      className={`size-5 rounded-full border-2 transition-transform ${
                        textColor === c ? 'scale-125 border-indigo-600 shadow-xs' : 'border-slate-300'
                      }`}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>

              {/* Text Align buttons */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setTextAlign('left')}
                  className={`p-1 rounded ${textAlign === 'left' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  aria-label="Align Left"
                >
                  <AlignLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('center')}
                  className={`p-1 rounded ${textAlign === 'center' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  aria-label="Align Center"
                >
                  <AlignCenter className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('right')}
                  className={`p-1 rounded ${textAlign === 'right' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  aria-label="Align Right"
                >
                  <AlignRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Story Stickers Bar */}
          <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Interactive Story Stickers</span>
              {stickerType && (
                <button
                  type="button"
                  onClick={() => setStickerType(null)}
                  className="text-[11px] text-rose-500 font-semibold hover:underline"
                >
                  Remove Sticker
                </button>
              )}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStickerType(stickerType === 'poll' ? null : 'poll')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  stickerType === 'poll'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <BarChart2 className="size-3.5" />
                <span>Poll</span>
              </button>

              <button
                type="button"
                onClick={() => setStickerType(stickerType === 'qa' ? null : 'qa')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  stickerType === 'qa'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="size-3.5" />
                <span>Q&A</span>
              </button>

              <button
                type="button"
                onClick={() => setStickerType(stickerType === 'quiz' ? null : 'quiz')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  stickerType === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="size-3.5" />
                <span>Quiz</span>
              </button>
            </div>

            {/* Sticker Customizer Forms */}
            {stickerType === 'poll' && (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Poll Question"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="p-2 rounded-lg border border-slate-300 text-xs font-bold bg-white text-black placeholder:text-slate-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Option 1"
                    value={pollOptions[0]}
                    onChange={(e) => setPollOptions([e.target.value, pollOptions[1]])}
                    className="p-2 rounded-lg border border-slate-300 text-xs bg-white text-black placeholder:text-slate-500 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    value={pollOptions[1]}
                    onChange={(e) => setPollOptions([pollOptions[0], e.target.value])}
                    className="p-2 rounded-lg border border-slate-300 text-xs bg-white text-black placeholder:text-slate-500 font-medium"
                  />
                </div>
              </div>
            )}

            {stickerType === 'qa' && (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Ask me a question!"
                  value={qaPrompt}
                  onChange={(e) => setQaPrompt(e.target.value)}
                  className="p-2 rounded-lg border border-slate-300 text-xs font-bold bg-white text-black placeholder:text-slate-500"
                />
              </div>
            )}

            {stickerType === 'quiz' && (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Quiz Question"
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  className="p-2 rounded-lg border border-slate-300 text-xs font-bold bg-white text-black placeholder:text-slate-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  {quizOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="quizCorrect"
                        checked={quizCorrectIdx === i}
                        onChange={() => setQuizCorrectIdx(i)}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...quizOptions];
                          updated[i] = e.target.value;
                          setQuizOptions(updated);
                        }}
                        className="p-1.5 rounded-lg border border-slate-300 text-xs w-full bg-white text-black placeholder:text-slate-500 font-medium"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Select radio button to mark the correct answer.</span>
              </div>
            )}
          </div>

          {/* Secret Hotspots (Easter Eggs) Panel */}
          <div className="flex flex-col gap-2 p-3 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-slate-50 rounded-2xl border border-amber-500/30 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Secret Hotspots (Easter Eggs)</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold uppercase tracking-wide">
                      Interactive
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Hide secret surprises on your image for viewers to tap & reveal
                  </span>
                </div>
              </div>
              {hotspots.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {hotspots.length} placed
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (!activeMediaUrl && mediaType !== 'text') {
                    fileInputRef.current?.click();
                    return;
                  }
                  setIsPlacingHotspot(!isPlacingHotspot);
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                  isPlacingHotspot
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Target className="size-3.5" />
                <span>
                  {isPlacingHotspot
                    ? '👉 Tap anywhere on the preview photo above!'
                    : hotspots.length > 0
                    ? '+ Place Another Easter Egg'
                    : 'Place Easter Egg on Canvas'}
                </span>
              </button>

              {/* Placed Hotspots List */}
              {hotspots.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {hotspots.map((h, idx) => (
                    <div
                      key={h.id || idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-[11px] truncate max-w-[190px]">
                            {h.title || 'Easter Egg'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {h.type.toUpperCase()} • {h.hint ? `Clue: "${h.hint}"` : 'No hint (Surprise)'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHotspots((prev) => prev.filter((item) => item.id !== h.id))}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Remove Easter Egg"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Story Music Track */}
          <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Music className="size-4 text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold">Background Music</span>
                <span className="text-[10px] text-slate-400">
                  {selectedMusic ? `${selectedMusic.title} • ${selectedMusic.artist}` : 'None selected'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMusicModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              {selectedMusic ? 'Change' : 'Choose Song'}
            </button>
          </div>

          {/* Close Friends Audience Selector */}
          <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-800">Story Audience</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCloseFriends(false)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  !isCloseFriends
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Globe className="size-3.5" />
                <span>Everyone</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCloseFriends(true)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  isCloseFriends
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Star className="size-3.5 fill-current text-amber-300" />
                <span>Close Friends</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsCreateStoryOpen(false)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${
                isCloseFriends
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-300'
              }`}
            >
              {isCloseFriends ? 'Share (Close Friends)' : 'Share Story'}
            </button>
          </div>
        </form>
      </div>

      {/* Music Picker Modal */}
      {isMusicModalOpen && (
        <MusicPickerModal
          onSelectTrack={(track) => setSelectedMusic(track)}
          onClose={() => setIsMusicModalOpen(false)}
        />
      )}

      {/* Configure Secret Easter Egg Modal */}
      {activeHotspotModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-slate-900">Configure Secret Easter Egg</h4>
                  <span className="text-[10px] text-slate-500">
                    Position: X: {activeHotspotModal.x}% • Y: {activeHotspotModal.y}%
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveHotspotModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Secret Type Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveHotspotModal((prev) => ({ ...prev, type: 'note', title: 'Secret Note 📝' }))}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  activeHotspotModal.type === 'note' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <span>📝 Note</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveHotspotModal((prev) => ({ ...prev, type: 'photo', title: 'Secret Photo / Meme 🖼️' }))}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  activeHotspotModal.type === 'photo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <span>🖼️ Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveHotspotModal((prev) => ({ ...prev, type: 'voice', title: 'Voice Whisper 🎙️' }))}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  activeHotspotModal.type === 'voice' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <span>🎙️ Whisper</span>
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700">Easter Egg Title</label>
                <input
                  type="text"
                  value={activeHotspotModal.title}
                  onChange={(e) => setActiveHotspotModal((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Secret Coffee Note ☕"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-black font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {activeHotspotModal.type === 'note' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700">Secret Message</label>
                  <textarea
                    rows={3}
                    value={activeHotspotModal.content}
                    onChange={(e) => setActiveHotspotModal((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Type the secret message or confession viewers unlock..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-black font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {activeHotspotModal.type === 'photo' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Secret Image / Meme URL</label>
                  <input
                    type="url"
                    value={activeHotspotModal.content}
                    onChange={(e) => setActiveHotspotModal((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Paste image URL (https://...)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-black font-medium"
                  />
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
                    {[
                      { name: '🎉 Kitten Meme', url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg' },
                      { name: '📸 Behind Scenes', url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg' },
                      { name: '🏎️ Fast Car', url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setActiveHotspotModal((prev) => ({ ...prev, content: preset.url }))}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-[10px] text-slate-700 font-medium"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeHotspotModal.type === 'voice' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700">Whisper Transcript / Audio Text</label>
                  <textarea
                    rows={2}
                    value={activeHotspotModal.content}
                    onChange={(e) => setActiveHotspotModal((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Type the secret voice whisper or thought..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-black font-medium"
                  />
                </div>
              )}

              {/* Clue Hint */}
              <div>
                <label className="text-[11px] font-bold text-slate-700">Clue / Hint for Viewers (Optional)</label>
                <input
                  type="text"
                  value={activeHotspotModal.hint}
                  onChange={(e) => setActiveHotspotModal((prev) => ({ ...prev, hint: e.target.value }))}
                  placeholder="e.g. Tap on the mug ☕"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-black font-medium"
                />
              </div>

              {/* Shimmer Checkbox */}
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Subtle Shimmer Hint</span>
                    <span className="text-[10px] text-slate-500">Soft pulse gives observant viewers a clue</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={activeHotspotModal.visibility === 'shimmer'}
                  onChange={(e) =>
                    setActiveHotspotModal((prev) => ({
                      ...prev,
                      visibility: e.target.checked ? 'shimmer' : 'invisible',
                    }))
                  }
                  className="size-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveHotspotModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalHotspot = {
                    ...activeHotspotModal,
                    content:
                      activeHotspotModal.content.trim() ||
                      (activeHotspotModal.type === 'note'
                        ? '🎉 You discovered my secret thought!'
                        : activeHotspotModal.content),
                  };
                  setHotspots((prev) => [...prev, finalHotspot]);
                  setActiveHotspotModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
              >
                <Sparkles className="size-3.5" />
                <span>Save Easter Egg</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCreatorModal;
