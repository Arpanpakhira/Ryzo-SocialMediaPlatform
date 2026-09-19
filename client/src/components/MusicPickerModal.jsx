import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Search, Music, Play, Pause, Check, Disc, Sliders, Volume2, ArrowLeft, Bookmark, Flame } from 'lucide-react';

const fetchiTunesJsonp = (searchQuery) => {
  return new Promise((resolve) => {
    const callbackName = `itunes_cb_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement('script');
    let timer = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    timer = setTimeout(() => {
      cleanup();
      resolve([]);
    }, 4000);

    window[callbackName] = (data) => {
      cleanup();
      if (data && data.results && data.results.length > 0) {
        const formatted = data.results
          .map((item) => ({
            id: String(item.trackId || item.collectionId || Math.random()),
            title: item.trackName || item.collectionName || 'Unknown Track',
            artist: item.artistName || 'Unknown Artist',
            artwork: item.artworkUrl100 || item.artworkUrl60 || '',
            audio_url: item.previewUrl || '',
            genre: item.primaryGenreName || 'Music',
            trackTimeMillis: item.trackTimeMillis || 180000,
          }))
          .filter((t) => t.audio_url);
        resolve(formatted);
      } else {
        resolve([]);
      }
    };

    script.src = `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=30&callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      resolve([]);
    };

    document.head.appendChild(script);
  });
};

const fallbackTracks = [
  {
    id: 'track_1',
    title: 'As It Was',
    artist: 'Harry Styles',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/07/41/6a/07416a78-38b9-2d47-7ce8-8a52a44c510f/196874010112.jpg/100x100bb.jpg',
    audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/35/b6/a0/35b6a026-26bc-cfb1-30d3-9c3c1820c63f/mzaf_8281785747956416426.plus.aac.p.m4a',
    genre: 'Pop',
    trackTimeMillis: 167000,
  },
  {
    id: 'track_2',
    title: 'Sunflower (Spider-Man)',
    artist: 'Post Malone & Swae Lee',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/100x100bb.jpg',
    audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/f0/d6/98f0d67e-f8bf-762d-cac7-1c6b3b6b35dd/mzaf_4543283896248560946.plus.aac.p.m4a',
    genre: 'Hip-Hop',
    trackTimeMillis: 158000,
  },
  {
    id: 'track_3',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/bf/1a/05/bf1a052e-ec0b-689a-0e6e-bcbfd534575c/20UMGIM02796.rgb.jpg/100x100bb.jpg',
    audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/9f/c7/919fc77c-3f26-0e36-e82b-5e4c0d4a2a22/mzaf_10526019561005234509.plus.aac.p.m4a',
    genre: 'Synthpop',
    trackTimeMillis: 200000,
  },
  {
    id: 'track_4',
    title: 'Levitating',
    artist: 'Dua Lipa',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/10/72/ca/1072ca41-1e96-a81d-efef-6c84c1f6c49e/190295286101.jpg/100x100bb.jpg',
    audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/35/d8/64/35d86419-f5ce-a1bb-98f5-9b24ceec819d/mzaf_17208354146030960533.plus.aac.p.m4a',
    genre: 'Pop',
    trackTimeMillis: 203000,
  },
  {
    id: 'track_5',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/cb/1e/8c/cb1e8c95-3b03-f663-8a3d-36c117d7b57b/190295851080.jpg/100x100bb.jpg',
    audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/58/bc/d0/58bcd081-3069-42b7-0b16-ef1bfbeec960/mzaf_7824987747306233560.plus.aac.p.m4a',
    genre: 'Pop',
    trackTimeMillis: 233000,
  },
  {
    id: 'track_6',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/18/d8/4a/18d84a7e-ee22-0d12-1f48-a8d2bc00b212/17UMGIM16335.rgb.jpg/100x100bb.jpg',
    audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/28/7f/00/287f00d8-04ee-b657-6dfc-2bdfca13bb39/mzaf_10543784115061614742.plus.aac.p.m4a',
    genre: 'Hip-Hop',
    trackTimeMillis: 177000,
  }
];

const genres = ['Trending', 'Saved Sounds', 'Pop', 'Hip-Hop', 'Dance', 'Chill', 'Lo-Fi', 'Rock'];

const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const MusicPickerModal = ({ onSelectTrack, onClose }) => {
  const { savedAudios } = useApp();
  const [query, setQuery] = useState('Trending');
  const [tracks, setTracks] = useState(fallbackTracks);
  const [loading, setLoading] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);

  // Portion/Segment selection states
  const [activeTrimTrack, setActiveTrimTrack] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [trackDuration, setTrackDuration] = useState(180); // Dynamic full song duration in seconds
  const [isTrimPlaying, setIsTrimPlaying] = useState(false);

  const audioRef = useRef(new Audio());
  const searchTimeoutRef = useRef(null);

  const fetchMusic = async (searchQuery) => {
    const term = (searchQuery || 'Trending').trim();
    setLoading(true);

    try {
      // Strategy 1: Local Express Backend (/api/music/search?q=...)
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(term)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.tracks && data.tracks.length > 0) {
            const valid = data.tracks.filter((t) => t.audio_url);
            if (valid.length > 0) {
              setTracks(valid);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        // Backend API not reachable or error, continue to next strategy
      }

      // Strategy 2: Vite Server Proxy (/itunes-api/search?term=...)
      try {
        const proxyRes = await fetch(`/itunes-api/search?term=${encodeURIComponent(term)}&entity=song&limit=30`);
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          if (proxyData.results && proxyData.results.length > 0) {
            const formatted = proxyData.results
              .map((item) => ({
                id: String(item.trackId || item.collectionId || Math.random()),
                title: item.trackName || item.collectionName || 'Unknown Track',
                artist: item.artistName || 'Unknown Artist',
                artwork: item.artworkUrl100 || item.artworkUrl60 || '',
                audio_url: item.previewUrl || '',
                genre: item.primaryGenreName || 'Music',
                trackTimeMillis: item.trackTimeMillis || 180000,
              }))
              .filter((t) => t.audio_url);

            if (formatted.length > 0) {
              setTracks(formatted);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        // Proxy error, continue to JSONP
      }

      // Strategy 3: Dynamic JSONP Script Injection (Completely bypasses CORS in browser)
      const jsonpResults = await fetchiTunesJsonp(term);
      if (jsonpResults && jsonpResults.length > 0) {
        setTracks(jsonpResults);
        setLoading(false);
        return;
      }

      // Strategy 4: Fallback to filtering curated tracks
      const filteredFallback = fallbackTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(term.toLowerCase()) ||
          t.artist.toLowerCase().includes(term.toLowerCase()) ||
          t.genre.toLowerCase().includes(term.toLowerCase())
      );

      setTracks(filteredFallback.length > 0 ? filteredFallback : fallbackTracks);
    } catch (err) {
      console.warn('Network error fetching music, using fallback list:', err);
      setTracks(fallbackTracks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic(query);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Sync audio metadata duration if loaded file is a full song (> 45s)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      // Only override if the loaded file has a full song duration (> 45s)
      if (audio.duration && isFinite(audio.duration) && audio.duration > 45) {
        setTrackDuration(Math.floor(audio.duration));
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
    };
  }, [activeTrimTrack]);

  // Monitor segment playback boundaries in trim view
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (activeTrimTrack && isTrimPlaying && audio.duration) {
        const sampleLength = audio.duration;
        const sampleTime = startTime % sampleLength;
        if (audio.currentTime >= sampleTime + Math.min(duration, sampleLength) || audio.currentTime < sampleTime) {
          audio.currentTime = sampleTime;
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [activeTrimTrack, isTrimPlaying, startTime, duration]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchMusic(val.trim() || 'Trending');
    }, 400);
  };

  const handleGenreClick = (genre) => {
    setQuery(genre);
    if (genre === 'Saved Sounds') {
      setTracks(savedAudios && savedAudios.length > 0 ? savedAudios : fallbackTracks);
    } else {
      fetchMusic(genre);
    }
  };

  const togglePreviewPlay = (track) => {
    if (!track.audio_url) return;

    if (playingTrackId === track.id) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      setActiveTrimTrack(null);
      audioRef.current.src = track.audio_url;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setPlayingTrackId(track.id);

      audioRef.current.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  const openTrimMode = (track) => {
    audioRef.current.pause();
    setPlayingTrackId(null);
    setActiveTrimTrack(track);
    setStartTime(0);

    // Full original song duration (e.g. 210s = 3m 30s)
    let initialDur = 210;
    if (track.trackTimeMillis) {
      initialDur = Math.max(45, Math.floor(track.trackTimeMillis / 1000));
    } else if (track.duration && track.duration > 45) {
      initialDur = track.duration;
    }
    setTrackDuration(initialDur);

    if (track.audio_url) {
      audioRef.current.src = track.audio_url;
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsTrimPlaying(true)).catch(() => {});
    }
  };

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);
    if (audioRef.current && activeTrimTrack) {
      const sampleLength = audioRef.current.duration || 30;
      audioRef.current.currentTime = newStart % sampleLength;
      if (!isTrimPlaying) {
        audioRef.current.play().then(() => setIsTrimPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleTrimPlay = () => {
    if (!audioRef.current) return;
    if (isTrimPlaying) {
      audioRef.current.pause();
      setIsTrimPlaying(false);
    } else {
      const sampleLength = audioRef.current.duration || 30;
      const sampleTime = startTime % sampleLength;
      if (audioRef.current.currentTime < sampleTime || audioRef.current.currentTime >= sampleTime + duration) {
        audioRef.current.currentTime = sampleTime;
      }
      audioRef.current.play().then(() => setIsTrimPlaying(true)).catch(() => {});
    }
  };

  const confirmSelectTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (!activeTrimTrack) return;

    onSelectTrack({
      title: activeTrimTrack.title,
      artist: activeTrimTrack.artist,
      artwork: activeTrimTrack.artwork,
      audio_url: activeTrimTrack.audio_url,
      start_time: startTime,
      duration: duration,
    });
    onClose();
  };

  const maxSliderStart = Math.max(0, trackDuration - duration);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTrimTrack ? (
              <button
                type="button"
                onClick={() => {
                  audioRef.current.pause();
                  setActiveTrimTrack(null);
                  setIsTrimPlaying(false);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-1"
              >
                <ArrowLeft className="size-5" />
              </button>
            ) : (
              <Music className="size-5 text-indigo-400" />
            )}
            <h3 className="text-lg font-bold text-white">
              {activeTrimTrack ? 'Select Song Portion' : 'Select Music Track / Song'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* MODE 1: Portion Scrubber / Slider view for active song */}
        {activeTrimTrack ? (
          <div className="p-6 flex flex-col items-center gap-5 overflow-y-auto">
            {/* Track Info Card */}
            <div className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-md">
              <div className="relative size-16 shrink-0 rounded-2xl overflow-hidden bg-slate-900 border border-slate-600 shadow-inner">
                {activeTrimTrack.artwork ? (
                  <img
                    src={activeTrimTrack.artwork}
                    alt={activeTrimTrack.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center bg-indigo-900 text-indigo-300">
                    <Music className="size-8" />
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-white truncate">
                  {activeTrimTrack.title}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {activeTrimTrack.artist}
                </span>
                <span className="text-[11px] text-indigo-400 font-semibold mt-1 flex items-center gap-1">
                  <Volume2 className="size-3.5" />
                  <span>Original Song Duration: {formatTime(trackDuration)}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={toggleTrimPlay}
                className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-transform active:scale-110 shrink-0"
              >
                {isTrimPlaying ? (
                  <Pause className="size-5 fill-white text-white" />
                ) : (
                  <Play className="size-5 fill-white text-white ml-0.5" />
                )}
              </button>
            </div>

            {/* Duration Option Pills (Strictly 15s, 30s, 45s) */}
            <div className="flex items-center justify-between w-full px-3 py-2 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
                <Sliders className="size-3.5 text-indigo-400" />
                <span>Portion Duration:</span>
              </span>
              <div className="flex items-center gap-2">
                {[15, 30, 45].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDuration(d);
                      const maxS = Math.max(0, trackDuration - d);
                      if (startTime > maxS) setStartTime(maxS);
                    }}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                      duration === d
                        ? 'bg-indigo-600 border border-indigo-400 text-white shadow-md scale-105'
                        : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Song Portion Selection Scrubber Box */}
            <div className="w-full flex flex-col gap-4 p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Audio Segment Selection (Full Song)
                </span>
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800">
                  {formatTime(startTime)} - {formatTime(startTime + duration)} ({duration}s clip)
                </span>
              </div>

              {/* Simulated Waveform Visualizer with Highlight Window across Full Song */}
              <div className="relative w-full h-12 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-between px-2 gap-1 border border-slate-800">
                {[
                  35, 60, 45, 80, 95, 40, 75, 50, 90, 100, 65, 40, 85, 90, 70,
                  45, 80, 100, 60, 75, 85, 40, 90, 65, 50, 80, 95, 70, 40, 60
                ].map((height, i) => {
                  const barTime = (i / 30) * trackDuration;
                  const isInSegment = barTime >= startTime && barTime <= startTime + duration;
                  return (
                    <div
                      key={i}
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-full transition-all duration-200 ${
                        isInSegment ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-700/60'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Scrollbar / Timeline Slider covering full track length */}
              <div className="flex flex-col gap-1">
                <input
                  type="range"
                  min="0"
                  max={maxSliderStart}
                  step="0.5"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
                  <span>0:00</span>
                  <span>{formatTime(Math.floor(trackDuration * 0.25))}</span>
                  <span>{formatTime(Math.floor(trackDuration * 0.5))}</span>
                  <span>{formatTime(Math.floor(trackDuration * 0.75))}</span>
                  <span>{formatTime(trackDuration)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={() => {
                  audioRef.current.pause();
                  setActiveTrimTrack(null);
                  setIsTrimPlaying(false);
                }}
                className="flex-1 py-3 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Back to Tracks
              </button>
              <button
                type="button"
                onClick={confirmSelectTrack}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="size-4" />
                <span>Add {duration}s Portion</span>
              </button>
            </div>
          </div>
        ) : (
          /* MODE 2: Song Search & Track List View */
          <>
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800 flex flex-col gap-3">
              <div className="relative">
                <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search real songs, artists, or genres (e.g. Post Malone, Harry Styles)..."
                  value={query}
                  onChange={handleSearchChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              {/* Genre Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {genres.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGenreClick(g)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all shrink-0 ${
                      query.toLowerCase() === g.toLowerCase()
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Track List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
                  <Disc className="size-8 animate-spin text-indigo-500" />
                  <span className="text-xs">Searching real songs & preview audio...</span>
                </div>
              ) : tracks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No tracks found for "{query}". Try another search query.
                </div>
              ) : (
                tracks.map((track) => {
                  const isPlaying = playingTrackId === track.id;
                  return (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => openTrimMode(track)}>
                        <div className="relative size-12 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                          {track.artwork ? (
                            <img
                              src={track.artwork}
                              alt={track.title}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center bg-indigo-900 text-indigo-300">
                              <Music className="size-6" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePreviewPlay(track);
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                          >
                            {isPlaying ? (
                              <Pause className="size-5 fill-white text-white" />
                            ) : (
                              <Play className="size-5 fill-white text-white ml-0.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">
                            {track.title}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">
                            {track.artist}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-semibold mt-0.5 flex items-center gap-1">
                            <span>{track.genre}</span>
                            <span>•</span>
                            <span className="text-slate-400">Click to pick portion</span>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openTrimMode(track)}
                        className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition-all shrink-0 ml-2"
                      >
                        <Sliders className="size-3.5" />
                        <span>Trim & Select</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MusicPickerModal;

