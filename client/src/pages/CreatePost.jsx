import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Image, Film, Video, MapPin, Hash, Sparkles, ArrowLeft, Upload, Trash2, Music, Link as LinkIcon } from 'lucide-react';
import MusicPickerModal from '../components/MusicPickerModal';

const CreatePost = () => {
  const { addPost, currentUser } = useApp();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState('photo'); // 'photo' or 'video'
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');

  // Music State
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

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
      audio_track: selectedMusic,
      audio_title: selectedMusic ? trackTitle : 'Original Audio',
    });

    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="size-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Create New Post</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* User Profile Bar */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.profile_picture}
              alt={currentUser?.full_name}
              className="size-12 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-800">{currentUser?.full_name}</span>
              <span className="text-xs text-slate-400">@{currentUser?.username}</span>
            </div>
          </div>

          {/* Caption Input */}
          <textarea
            rows={5}
            placeholder="What's happening? Share your thoughts, story, or project update..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none bg-white text-black placeholder:text-slate-500 font-medium"
          />

          {/* Media Section: Photo & Video Dedicated Tabs with Live Previews */}
          <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {/* Tab Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('photo');
                    setShowUrlInput(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    mediaType === 'photo'
                      ? 'bg-indigo-600 text-white shadow-sm scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Image className="size-4" />
                  <span>Photo</span>
                  {imageUrl && <span className="size-2 rounded-full bg-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('video');
                    setShowUrlInput(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    mediaType === 'video'
                      ? 'bg-indigo-600 text-white shadow-sm scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Film className="size-4" />
                  <span>Video</span>
                  {videoUrl && <span className="size-2 rounded-full bg-emerald-400" />}
                </button>
              </div>

              {((mediaType === 'photo' && imageUrl) || (mediaType === 'video' && videoUrl)) && (
                <button
                  type="button"
                  onClick={() => {
                    if (mediaType === 'photo') {
                      setImageUrl('');
                    } else {
                      setVideoUrl('');
                    }
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="size-3.5" />
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
              <div className="flex flex-col gap-2.5">
                {/* Upload & URL Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Upload className="size-4" />
                    <span>{imageUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <LinkIcon className="size-3.5 text-slate-500" />
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
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-black placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Photo Preview */}
                {imageUrl ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Image className="size-3.5 text-indigo-600" />
                        <span>Photo Preview</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Photo Ready
                      </span>
                    </div>

                    <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 group shadow-inner flex items-center justify-center">
                      <img src={imageUrl} alt="Uploaded preview" className="size-full object-contain sm:object-cover" />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/40 rounded-2xl cursor-pointer transition-all text-center group"
                  >
                    <div className="size-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
                      <Image className="size-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Click to select photo</p>
                    <p className="text-xs text-slate-500 mt-0.5">PNG, JPG, WEBP formats up to 15MB</p>
                  </div>
                )}
              </div>
            )}

            {/* If Video Tab Selected */}
            {mediaType === 'video' && (
              <div className="flex flex-col gap-2.5">
                {/* Upload & URL Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Upload className="size-4" />
                    <span>{videoUrl ? 'Replace Video' : 'Upload Video'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <LinkIcon className="size-3.5 text-slate-500" />
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
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-black placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Video Preview */}
                {videoUrl ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Video className="size-3.5 text-indigo-600" />
                        <span>Video Preview</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Video Ready
                      </span>
                    </div>
                    <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-inner flex items-center justify-center">
                      <video src={videoUrl} controls playsInline className="size-full object-contain max-h-72" />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/40 rounded-2xl cursor-pointer transition-all text-center group"
                  >
                    <div className="size-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
                      <Film className="size-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Click to select video</p>
                    <p className="text-xs text-slate-500 mt-0.5">MP4, WEBM, MOV formats up to 50MB</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add Background Music / Audio Track Option */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <Music className="size-5 text-indigo-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Post Music Track</span>
                <span className="text-xs text-slate-400">
                  {selectedMusic ? `${selectedMusic.title} • ${selectedMusic.artist}` : 'Add background music or song track to your post'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMusicModalOpen(true)}
              className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 shadow-sm"
            >
              {selectedMusic ? 'Change Song' : 'Add Music'}
            </button>
          </div>

          {/* Hashtags & Location Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
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
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-black placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() && !imageUrl.trim() && !videoUrl.trim()}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 transition-all"
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

export default CreatePost;
