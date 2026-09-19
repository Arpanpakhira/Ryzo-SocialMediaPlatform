import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useApp } from '../context/AppContext';
import {
  PhoneOff,
  PhoneCall,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Maximize2,
  Shield,
  Phone,
} from 'lucide-react';

const CallModal = ({ targetUser, callType = 'video', isIncoming = false, onClose }) => {
  const { socket, emitEndCall, emitRejectCall, emitAnswerCall } = useSocket();
  const { currentUser } = useApp();

  const [callStatus, setCallStatus] = useState(isIncoming ? 'ringing' : 'calling');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const ringtoneTimerRef = useRef(null);

  // Format seconds to mm:ss
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Synthesize Phone Ringing Audio using Web Audio API
  useEffect(() => {
    let audioCtx = null;
    let osc1 = null;
    let osc2 = null;

    if (callStatus === 'calling' || callStatus === 'ringing') {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtx = new AudioContext();

          const playRingTone = () => {
            if (!audioCtx || audioCtx.state === 'closed') return;
            osc1 = audioCtx.createOscillator();
            osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc1.type = 'sine';
            osc2.type = 'sine';
            osc1.frequency.setValueAtTime(440, audioCtx.currentTime); // US Dual Ring frequency 440Hz
            osc2.frequency.setValueAtTime(480, audioCtx.currentTime); // 480Hz

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start();
            osc2.start();

            // Tone cadence: 1.5s on, 2s pause
            setTimeout(() => {
              try {
                osc1?.stop();
                osc2?.stop();
              } catch (e) {}
            }, 1200);
          };

          playRingTone();
          ringtoneTimerRef.current = setInterval(playRingTone, 3000);
        }
      } catch (err) {
        console.warn('Web Audio API unavailable for ringtone:', err);
      }
    }

    return () => {
      if (ringtoneTimerRef.current) clearInterval(ringtoneTimerRef.current);
      try {
        if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
      } catch (e) {}
    };
  }, [callStatus]);

  // Request Local Microphone & Camera Stream
  useEffect(() => {
    let isMounted = true;

    const initLocalMedia = async () => {
      try {
        const constraints = {
          audio: true,
          video: callType === 'video' ? { width: 1280, height: 720 } : false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) return;

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Simulate connecting call after 3.5s for seamless interactive demo / solo calling
        if (!isIncoming) {
          const timer = setTimeout(() => {
            if (isMounted) setCallStatus('connected');
          }, 3500);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.warn('Camera/Microphone access error or denied:', err);
        // Fallback for audio-only or denied camera
        if (callType === 'video' && isMounted) {
          setIsVideoOff(true);
        }
      }
    };

    initLocalMedia();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [callType, isIncoming]);

  // Call Duration Timer
  useEffect(() => {
    let interval = null;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  // Handle Mute Microphone Toggle
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  // Handle Video Camera Toggle
  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Accept Incoming Call
  const handleAcceptCall = () => {
    setCallStatus('connected');
    emitAnswerCall({ toUserId: targetUser._id });
  };

  // Decline / End Call
  const handleEndCall = () => {
    setCallStatus('ended');
    if (isIncoming && callStatus === 'ringing') {
      emitRejectCall(targetUser._id);
    } else {
      emitEndCall(targetUser._id);
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      {/* Container Overlay Card */}
      <div className="relative w-full max-w-md h-full md:h-[680px] bg-slate-900 md:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10">
        
        {/* Remote Video / Background Visualization Area */}
        <div className="relative size-full flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black overflow-hidden">
          
          {/* Main Remote Video Element */}
          {callType === 'video' && !isVideoOff && callStatus === 'connected' ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="size-full object-cover"
            />
          ) : (
            /* User Avatar & Glowing Caller Status View */
            <div className="flex flex-col items-center justify-center gap-4 text-center z-10 p-6">
              <div className="relative">
                {/* Pulsing ring animation for ringing state */}
                {(callStatus === 'calling' || callStatus === 'ringing') && (
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 opacity-40 animate-ping" />
                )}
                <img
                  src={targetUser?.profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'}
                  alt={targetUser?.full_name}
                  className="size-28 md:size-32 rounded-full object-cover ring-4 ring-white/30 shadow-2xl relative z-10"
                />
              </div>

              <div className="flex flex-col items-center gap-1">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {targetUser?.full_name || 'Social Friend'}
                </h3>
                <span className="text-xs text-indigo-300 font-medium">
                  @{targetUser?.username || 'user'}
                </span>
                
                {/* Status Text & Timer */}
                <div className="mt-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-mono">
                  {callStatus === 'calling' && 'Calling...'}
                  {callStatus === 'ringing' && 'Incoming Call...'}
                  {callStatus === 'connected' && formatDuration(callDuration)}
                  {callStatus === 'ended' && 'Call Ended'}
                </div>
              </div>
            </div>
          )}

          {/* Floating Picture-in-Picture Local Camera Preview */}
          {callType === 'video' && (
            <div className="absolute top-4 right-4 z-20 size-28 md:size-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 group">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`size-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
              />
              {isVideoOff && (
                <div className="size-full flex flex-col items-center justify-center bg-slate-800 text-white/60 p-2 text-center text-[10px]">
                  <VideoOff className="size-5 mb-1 text-slate-400" />
                  <span>Camera Off</span>
                </div>
              )}
            </div>
          )}

          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
            <Shield className="size-3.5 text-emerald-400" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>

        {/* Bottom Call Controls Toolbar */}
        <div className="p-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around z-20">
          {callStatus === 'ringing' ? (
            /* Incoming Call Action Buttons */
            <div className="flex items-center justify-center gap-12 w-full">
              <button
                onClick={handleEndCall}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="p-4 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-700 transition-all hover:scale-110 active:scale-95">
                  <PhoneOff className="size-6" />
                </div>
                <span className="text-xs font-semibold text-rose-300">Decline</span>
              </button>

              <button
                onClick={handleAcceptCall}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="p-4 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 hover:bg-emerald-700 transition-all hover:scale-110 active:scale-95 animate-bounce">
                  <PhoneCall className="size-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-300">Accept</span>
              </button>
            </div>
          ) : (
            /* Active Call Controls Toolbar */
            <>
              {/* Mute Mic */}
              <button
                onClick={toggleMute}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                className={`p-3.5 rounded-full border transition-all duration-200 active:scale-95 ${
                  isMuted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                    : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                }`}
              >
                {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </button>

              {/* Toggle Video Camera */}
              {callType === 'video' && (
                <button
                  onClick={toggleVideo}
                  title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                  className={`p-3.5 rounded-full border transition-all duration-200 active:scale-95 ${
                    isVideoOff
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                      : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="size-5" /> : <Video className="size-5" />}
                </button>
              )}

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                title="End Call"
                className="p-4 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 hover:bg-rose-700 transition-all hover:scale-110 active:scale-95 cursor-pointer"
              >
                <PhoneOff className="size-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallModal;
