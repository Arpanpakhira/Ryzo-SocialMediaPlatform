import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Image,
  Film,
  Video,
  MapPin,
  Hash,
  Sparkles,
  Upload,
  Trash2,
  User,
  Plus,
  Music,
  Type,
  Palette,
  Link as LinkIcon,
} from 'lucide-react';
import MusicPickerModal from './MusicPickerModal';
import {
  FONT_STYLES,
  DESIGN_EFFECTS,
  TEXT_PALETTE,
  POST_GRADIENTS,
  getFontFamilyStyle,
  getDesignEffectClass,
} from '../utils/typographyStyles';

const CreatePostModal = () => {
  const { setIsCreatePostOpen, addPost, currentUser, darkMode } = useApp();
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState('photo'); // 'photo' or 'video'
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');

  // Typography & Styling state
  const [fontStyle, setFontStyle] = useState('modern');
  const [textDesign, setTextDesign] = useState('plain');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgGradient, setBgGradient] = useState(null);

  // Music state
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  // Photo Tagging state
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [activeClickCoords, setActiveClickCoords] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || mediaType === 'video';
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isVideo) {
        setVideoUrl(reader.result);
      } else {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:5000/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (isVideo) {
          setVideoUrl(data.url);
        } else {
          setImageUrl(data.url);
        }
      }
    } catch (err) {
      console.log('Fallback to FileReader Data URL:', err);
    }
  };

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setActiveClickCoords({ x_percent: Math.round(x), y_percent: Math.round(y) });
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !activeClickCoords) return;
    const cleanUsername = tagInput.trim().replace('@', '');
    setTaggedUsers((prev) => [
      ...prev,
      {
        user_id: cleanUsername,
        username: cleanUsername,
        x_percent: activeClickCoords.x_percent,
        y_percent: activeClickCoords.y_percent,
      },
    ]);
    setTagInput('');
    setActiveClickCoords(null);
  };

  const handleRemoveTag = (indexToRemove) => {
    setTaggedUsers((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl.trim() && !videoUrl.trim()) return;

    let fullContent = content;
    if (hashtags.trim()) {
      const formattedTags = hashtags
        .split(' ')
        .map((t) => (t.startsWith('#') ? t : `#${t}`))
        .join(' ');
      fullContent = `${fullContent}\n\n${formattedTags}`;
    }

    const trackTitle = selectedMusic
      ? `${selectedMusic.title} • ${selectedMusic.artist}`
      : 'Original Audio';

    const hasVideo = Boolean(videoUrl.trim());
    const hasPhoto = Boolean(imageUrl.trim());

    addPost({
      content: fullContent,
      image_urls: hasPhoto ? [imageUrl.trim()] : (hasVideo ? [videoUrl.trim()] : []),
      video_url: hasVideo ? videoUrl.trim() : '',
      post_type: hasVideo ? 'video' : (hasPhoto ? 'image' : 'text'),
      is_reel: false,
      location,
      tagged_users: hasPhoto ? taggedUsers : [],
      audio_track: selectedMusic,
      audio_title: selectedMusic ? trackTitle : 'Original Audio',
      font_style: fontStyle,
      text_design: textDesign,
      text_color: textColor,
      bg_gradient: bgGradient,
    });

    setIsCreatePostOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 border ${
        darkMode
          ? 'bg-slate-900 text-slate-100 border-slate-800'
          : 'bg-[#152316] text-slate-100 border-amber-500/30'
      }`}>
        {/* Header */}
        <div className={`px-5 py-3.5 sm:px-6 sm:py-4 border-b flex items-center justify-between ${
          darkMode ? 'border-slate-800' : 'border-amber-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100">Create New Post</h3>
          </div>
          <button
            onClick={() => setIsCreatePostOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* User Profile Bar */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.profile_picture}
              alt={currentUser?.full_name}
              className="size-10 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">{currentUser?.full_name}</span>
              <span className="text-xs text-slate-400">@{currentUser?.username}</span>
            </div>
          </div>

          {/* Caption Input */}
          <textarea
            rows={3}
            placeholder="What's happening? Share your thoughts, story, or project update..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none bg-white text-black placeholder:text-slate-500 font-medium"
          />

          {/* Live Text Post Preview (if text exists or gradient chosen and no image/video) */}
          {!imageUrl && !videoUrl && (content.trim() || bgGradient) && (
            <div
              style={{
                background: bgGradient || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                minHeight: bgGradient ? '150px' : '90px',
              }}
              className="w-full p-4 rounded-2xl flex items-center justify-center text-center shadow-inner border border-white/10 transition-all"
            >
              <p
                style={{
                  fontFamily: getFontFamilyStyle(fontStyle),
                  color: textColor,
                }}
                className={`text-base font-bold leading-relaxed break-words max-w-sm ${getDesignEffectClass(textDesign)}`}
              >
                {content || 'Preview your styled quote or post...'}
              </p>
            </div>
          )}

          {/* Media Section: Photo & Video Dedicated Tabs with Live Previews */}
          <div className="flex flex-col gap-3 p-3.5 bg-slate-800/40 rounded-2xl border border-white/10">
            {/* Tab Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('photo');
                    setShowUrlInput(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    mediaType === 'photo'
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Image className="size-3.5" />
                  <span>Photo</span>
                  {imageUrl && <span className="size-1.5 rounded-full bg-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('video');
                    setShowUrlInput(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    mediaType === 'video'
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Film className="size-3.5" />
                  <span>Video</span>
                  {videoUrl && <span className="size-1.5 rounded-full bg-emerald-400" />}
                </button>
              </div>

              {((mediaType === 'photo' && imageUrl) || (mediaType === 'video' && videoUrl)) && (
                <button
                  type="button"
                  onClick={() => {
                    if (mediaType === 'photo') {
                      setImageUrl('');
                      setTaggedUsers([]);
                    } else {
                      setVideoUrl('');
                    }
                  }}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="size-3" />
                  <span>Remove {mediaType === 'photo' ? 'Photo' : 'Video'}</span>
                </button>
              )}
            </div>

            {/* Hidden Input for file picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'video' ? 'video/*' : 'image/*'}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* If Photo Tab Selected */}
            {mediaType === 'photo' && (
              <div className="flex flex-col gap-2">
                {/* Upload & URL Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Upload className="size-3.5" />
                    <span>{imageUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <LinkIcon className="size-3.5 text-slate-400" />
                    <span>{showUrlInput ? 'Hide URL' : 'Paste Photo URL'}</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="flex gap-2 animate-in fade-in duration-150">
                    <input
                      type="url"
                      placeholder="Paste image link (https://...)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-300 text-xs bg-white text-black placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (urlInput.trim()) {
                          setImageUrl(urlInput.trim());
                          setUrlInput('');
                          setShowUrlInput(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Photo Preview */}
                {imageUrl ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                        <Image className="size-3 text-amber-400" />
                        <span>Photo Preview (Click to tag people)</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-medium">
                        {taggedUsers.length} tagged
                      </span>
                    </div>

                    <div
                      onClick={handleImageClick}
                      className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 cursor-crosshair group shadow-inner flex items-center justify-center"
                    >
                      <img src={imageUrl} alt="Uploaded preview" className="size-full object-contain sm:object-cover" />

                      {/* Render placed photo tags */}
                      {taggedUsers.map((tag, idx) => (
                        <div
                          key={idx}
                          style={{ left: `${tag.x_percent}%`, top: `${tag.y_percent}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-slate-900/95 text-white text-[11px] font-bold shadow-lg border border-white/30 flex items-center gap-1 z-10"
                        >
                          <span>@{tag.username}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTag(idx);
                            }}
                            className="p-0.5 rounded-full hover:bg-rose-600"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}

                      {/* Active Click Tagging Input Popup */}
                      {activeClickCoords && (
                        <div
                          style={{ left: `${activeClickCoords.x_percent}%`, top: `${activeClickCoords.y_percent}%` }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-2 shadow-2xl border border-indigo-500 z-20 flex items-center gap-1 animate-in zoom-in-75 duration-150"
                        >
                          <User className="size-3.5 text-indigo-600 ml-1" />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Tag @username"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            className="w-28 text-xs focus:outline-none text-black font-bold bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold"
                          >
                            Tag
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveClickCoords(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 hover:border-amber-400 hover:bg-white/5 rounded-2xl cursor-pointer transition-all text-center group"
                  >
                    <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                      <Image className="size-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-200">Click to select photo</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 15MB</p>
                  </div>
                )}
              </div>
            )}

            {/* If Video Tab Selected */}
            {mediaType === 'video' && (
              <div className="flex flex-col gap-2">
                {/* Upload & URL Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Upload className="size-3.5" />
                    <span>{videoUrl ? 'Replace Video' : 'Upload Video'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <LinkIcon className="size-3.5 text-slate-400" />
                    <span>{showUrlInput ? 'Hide URL' : 'Paste Video URL'}</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="flex gap-2 animate-in fade-in duration-150">
                    <input
                      type="url"
                      placeholder="Paste video MP4 URL (https://...)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-300 text-xs bg-white text-black placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40"
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
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Video Preview */}
                {videoUrl ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                        <Video className="size-3 text-amber-400" />
                        <span>Video Preview</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Video Ready
                      </span>
                    </div>
                    <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner flex items-center justify-center">
                      <video src={videoUrl} controls playsInline className="size-full object-contain max-h-56" />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 hover:border-amber-400 hover:bg-white/5 rounded-2xl cursor-pointer transition-all text-center group"
                  >
                    <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                      <Film className="size-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-200">Click to select video</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">MP4, WEBM, MOV up to 50MB</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Typography Styles & Designs Selector */}
          <div className="flex flex-col gap-3 p-3.5 bg-slate-800/40 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Type className="size-3.5 text-amber-400" />
                <span>Font Styles & Typography</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Style your post</span>
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
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-bold scale-105'
                      : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-700 font-medium'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Design Effects Horizontal Pills */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-400" />
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
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-xs font-bold'
                        : 'bg-slate-800/90 text-slate-300 border-white/10 hover:bg-slate-700'
                    }`}
                  >
                    {effect.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color Swatches */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <span className="text-[11px] font-semibold text-slate-300">Text Color:</span>
              <div className="flex gap-2">
                {TEXT_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTextColor(c)}
                    style={{ backgroundColor: c }}
                    className={`size-5 rounded-full border-2 transition-transform ${
                      textColor === c ? 'scale-125 border-amber-400 shadow-xs' : 'border-slate-600'
                    }`}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            {/* Background Gradient Swatches (For text card posts) */}
            {!imageUrl && (
              <div className="flex flex-col gap-1.5 pt-1 border-t border-white/10">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                  <Palette className="size-3 text-amber-400" />
                  <span>Card Background Theme:</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {POST_GRADIENTS.map((grad) => (
                    <button
                      key={grad.id}
                      type="button"
                      onClick={() => setBgGradient(grad.value)}
                      style={{ background: grad.value || '#1e293b' }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold text-white shrink-0 border transition-all ${
                        bgGradient === grad.value
                          ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                          : 'border-white/20 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {grad.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Background Music / Audio Track Option */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Music className="size-4 text-indigo-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Post Music Track</span>
                <span className="text-[10px] text-slate-400">
                  {selectedMusic ? `${selectedMusic.title} • ${selectedMusic.artist}` : 'Add background music to your post'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMusicModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0"
            >
              {selectedMusic ? 'Change' : 'Add Music'}
            </button>
          </div>

          {/* Hashtags & Location Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <Hash className="size-3.5 text-indigo-600" />
                <span>Hashtags</span>
              </div>
              <input
                type="text"
                placeholder="tech design growth"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <MapPin className="size-3.5 text-indigo-600" />
                <span>Location</span>
              </div>
              <input
                type="text"
                placeholder="San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatePostOpen(false)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() && !imageUrl.trim() && !videoUrl.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 transition-all"
            >
              Publish Post
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
    </div>
  );
};

export default CreatePostModal;
