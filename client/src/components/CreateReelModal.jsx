import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Film, Music, MapPin, Sparkles, Upload, Check, Disc } from 'lucide-react';
import MusicPickerModal from './MusicPickerModal';

const CreateReelModal = ({ onClose, initialMusic = null }) => {
  const { addPost, currentUser } = useApp();
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedMusic, setSelectedMusic] = useState(initialMusic);
  const [audioTitle, setAudioTitle] = useState(
    initialMusic
      ? initialMusic.title
        ? `${initialMusic.title} • ${initialMusic.artist}`
        : initialMusic.audio_title || 'Selected Audio'
      : 'Original Audio'
  );
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const sampleReelVideos = [
    'https://videos.pexels.com/video-files/14447442/14447442-hd_1080_1920_30fps.mp4',
    'https://videos.pexels.com/video-files/4114797/4114797-sd_540_960_25fps.mp4',
    'https://videos.pexels.com/video-files/856973/856973-hd_1080_1920_30fps.mp4',
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoUrl(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setVideoUrl(data.url);
      }
    } catch (err) {
      console.error('Failed uploading video file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    const trackTitle = selectedMusic
      ? `${selectedMusic.title} • ${selectedMusic.artist}`
      : audioTitle.trim() || 'Original Audio';

    addPost({
      content,
      video_url: videoUrl.trim(),
      image_urls: [],
      post_type: 'reel',
      is_reel: true,
      aspect_ratio: '9:16',
      audio_title: trackTitle,
      audio_track: selectedMusic,
      location,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      {/* Background overlay click to close */}
      <div onClick={onClose} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="size-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Create New Reel (9:16)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.profile_picture}
              alt={currentUser?.full_name}
              className="size-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{currentUser?.full_name}</span>
              <span className="text-xs text-slate-400">@{currentUser?.username}</span>
            </div>
          </div>

          {/* Video Upload Area */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Film className="size-4 text-indigo-400" />
              <span>Upload Short Video (9:16 Vertical format)</span>
            </span>

            {videoUrl ? (
              <div className="relative w-44 h-72 mx-auto rounded-2xl overflow-hidden border border-slate-700 bg-black mt-1 group">
                <video src={videoUrl} controls className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => setVideoUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-md"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-950/20 rounded-2xl cursor-pointer transition-all">
                <div className="size-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                  <Upload className="size-6" />
                </div>
                <p className="text-xs font-semibold text-white">Click to select 9:16 Reel Video</p>
                <p className="text-[11px] text-slate-400 mt-1">MP4, WebM, MOV formats up to 50MB</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {!videoUrl && (
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[11px] text-slate-400 font-medium">Or pick a demo reel video (with song):</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('https://videos.pexels.com/video-files/14447442/14447442-hd_1080_1920_30fps.mp4');
                      if (!selectedMusic) {
                        setSelectedMusic({
                          id: 'track_1',
                          title: 'As It Was',
                          artist: 'Harry Styles',
                          artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/07/41/6a/07416a78-38b9-2d47-7ce8-8a52a44c510f/196874010112.jpg/100x100bb.jpg',
                          audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/35/b6/a0/35b6a026-26bc-cfb1-30d3-9c3c1820c63f/mzaf_8281785747956416426.plus.aac.p.m4a',
                          duration: 30,
                          start_time: 0,
                        });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-[11px] text-slate-200 border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <span>🌄 Sunset Peak (As It Was)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('https://videos.pexels.com/video-files/4114797/4114797-sd_540_960_25fps.mp4');
                      if (!selectedMusic) {
                        setSelectedMusic({
                          id: 'track_2',
                          title: 'Sunflower (Spider-Man)',
                          artist: 'Post Malone & Swae Lee',
                          artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/100x100bb.jpg',
                          audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/f0/d6/98f0d67e-f8bf-762d-cac7-1c6b3b6b35dd/mzaf_4543283896248560946.plus.aac.p.m4a',
                          duration: 30,
                          start_time: 0,
                        });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-[11px] text-slate-200 border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <span>💻 Tech Coding (Sunflower)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('https://videos.pexels.com/video-files/856973/856973-hd_1080_1920_30fps.mp4');
                      if (!selectedMusic) {
                        setSelectedMusic({
                          id: 'track_3',
                          title: 'Blinding Lights',
                          artist: 'The Weeknd',
                          artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/bf/1a/05/bf1a052e-ec0b-689a-0e6e-bcbfd534575c/20UMGIM02796.rgb.jpg/100x100bb.jpg',
                          audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/9f/c7/919fc77c-3f26-0e36-e82b-5e4c0d4a2a22/mzaf_10526019561005234509.plus.aac.p.m4a',
                          duration: 30,
                          start_time: 0,
                        });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-[11px] text-slate-200 border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <span>🏎️ Motion Drive (Blinding Lights)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Real Music / Song Selection */}
          <div className="flex flex-col gap-2 p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Music className="size-4 text-indigo-400" />
                <span>Audio Track / Song</span>
              </span>
              <button
                type="button"
                onClick={() => setIsMusicModalOpen(true)}
                className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
              >
                <Music className="size-3.5" />
                <span>{selectedMusic ? 'Change Song' : 'Choose Real Song'}</span>
              </button>
            </div>

            {selectedMusic ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-indigo-500/30">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMusic.artwork}
                    alt={selectedMusic.title}
                    className="size-10 rounded-lg object-cover ring-1 ring-indigo-500/40"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                      {selectedMusic.title}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {selectedMusic.artist}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-mono font-semibold mt-0.5">
                      Segment: {Math.floor(selectedMusic.start_time || 0)}s - {Math.floor((selectedMusic.start_time || 0) + (selectedMusic.duration || 15))}s ({selectedMusic.duration || 15}s clip)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMusic(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Default: Original Audio. Click "Choose Real Song" to search iTunes tracks.
              </p>
            )}
          </div>

          {/* Reel Caption */}
          <textarea
            rows={3}
            placeholder="Write a caption for your Reel..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
          />

          {/* Location Input */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
              <MapPin className="size-3.5 text-indigo-400" />
              <span>Location</span>
            </div>
            <input
              type="text"
              placeholder="Los Angeles, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!videoUrl.trim() || isUploading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-semibold text-white shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="size-4" />
              <span>{isUploading ? 'Uploading...' : 'Publish Reel'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Music Search & Picker Modal */}
      {isMusicModalOpen && (
        <MusicPickerModal
          onSelectTrack={(track) => setSelectedMusic(track)}
          onClose={() => setIsMusicModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CreateReelModal;

