import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyConnectionsData } from '../assets/assets';
import CallModal from '../components/CallModal';
import {
  Send,
  Image,
  Phone,
  Video,
  Info,
  ArrowLeft,
  CheckCheck,
  Mic,
  Square,
  Trash2,
  Play,
  Pause,
  Smile,
  Film,
  ExternalLink,
} from 'lucide-react';

const ChatBox = ({ activeUserId }) => {
  const { userId: routeUserId } = useParams();
  const targetUserId = activeUserId || routeUserId || 'user_2';
  const navigate = useNavigate();

  const {
    currentUser,
    messages,
    sendMessage,
    addIncomingMessage,
    markMessagesAsSeenLocally,
    toggleMessageReaction,
  } = useApp();

  const {
    socket,
    onlineUsers,
    typingUsers,
    incomingCall,
    emitTyping,
    emitStopTyping,
    emitSendMessage,
    emitMarkSeen,
    emitReactMessage,
    emitCallUser,
  } = useSocket();

  const [inputText, setInputText] = useState('');
  const [activeCall, setActiveCall] = useState(null); // { callType: 'video'|'audio', isIncoming: boolean }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const createdMessage = sendMessage(
      targetUserId,
      inputText,
      '',
      'text'
    );

    if (createdMessage) {
      emitSendMessage(createdMessage);
    }

    emitStopTyping(targetUserId);
    setInputText('');
  };

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioDurations, setAudioDurations] = useState({});

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const audioRefMap = useRef({});

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isTargetOnline = onlineUsers.includes(targetUserId);
  const isTargetTyping = Boolean(typingUsers[targetUserId]);

  const targetUser =
    dummyConnectionsData.find((u) => u._id === targetUserId) || {
      _id: targetUserId,
      full_name: 'Aakash Sharma',
      username: 'aakash_s',
      profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    };

  const chatMessages = messages.filter(
    (msg) =>
      (msg.from_user_id === currentUser._id && msg.to_user_id === targetUserId) ||
      (msg.from_user_id === targetUserId && msg.to_user_id === currentUser._id)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, isTargetTyping]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (incomingMsg) => {
      addIncomingMessage(incomingMsg);
      if (incomingMsg.from_user_id === targetUserId) {
        emitMarkSeen(targetUserId);
        markMessagesAsSeenLocally(targetUserId);
      }
    };

    const handleMessageReacted = ({ messageId, userId, emoji, reactions }) => {
      toggleMessageReaction(messageId, emoji, userId, reactions);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_reacted', handleMessageReacted);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_reacted', handleMessageReacted);
    };
  }, [
    socket,
    targetUserId,
    addIncomingMessage,
    emitMarkSeen,
    markMessagesAsSeenLocally,
    toggleMessageReaction,
  ]);

  useEffect(() => {
    emitMarkSeen(targetUserId);
    markMessagesAsSeenLocally(targetUserId);
  }, [targetUserId]);

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const elapsedSeconds = Math.max(
          1,
          Math.round((Date.now() - (recordingStartTimeRef.current || Date.now())) / 1000)
        );
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          const newMsg = sendMessage(targetUserId, '', base64Audio, 'audio', {
            audio_duration: elapsedSeconds,
          });
          if (newMsg) emitSendMessage(newMsg);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required for voice notes.');
    }
  };

  const stopAndSendRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  const formatTimer = (seconds) => {
    const total = Math.max(0, Math.round(seconds || 0));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleAudioPlay = (msgId) => {
    const audioEl = audioRefMap.current[msgId];
    if (!audioEl) return;

    if (playingAudioId === msgId) {
      audioEl.pause();
      setPlayingAudioId(null);
    } else {
      if (playingAudioId && audioRefMap.current[playingAudioId]) {
        audioRefMap.current[playingAudioId].pause();
      }
      audioEl.play();
      setPlayingAudioId(msgId);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    emitTyping(targetUserId);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(targetUserId);
    }, 1500);
  };

  const handleEmojiReact = (msgId, emoji) => {
    toggleMessageReaction(msgId, emoji, currentUser._id);
    emitReactMessage(msgId, emoji, targetUserId);
    setActiveReactionMsgId(null);
  };

  const EMOJI_LIST = ['❤️', '😂', '🔥', '👍', '😮', '😢'];

  return (
    <div className="flex flex-col h-full bg-white rounded-none sm:rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/messages')}
            className="md:hidden p-1.5 rounded-full text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div 
            onClick={() => navigate(`/profile/${targetUser._id || targetUser.username}`)}
            className="flex items-center gap-3 cursor-pointer group/user"
          >
            <div className="relative">
              <img
                src={targetUser.profile_picture}
                alt={targetUser.full_name}
                className="size-10 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover/user:ring-indigo-500 transition-all"
              />
              <div
                className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-white ${
                  isTargetOnline ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight group-hover/user:text-indigo-600 transition-colors">
                {targetUser.full_name}
              </span>
              <span
                className={`text-[11px] font-medium flex items-center gap-1 ${
                  isTargetOnline ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {isTargetOnline ? 'Active Now' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <button 
            onClick={() => {
              setActiveCall({ callType: 'audio', isIncoming: false });
              emitCallUser({
                toUserId: targetUserId,
                callType: 'audio',
                callerInfo: currentUser,
              });
            }}
            title="Start Audio Call"
            className="p-2 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <Phone className="size-4.5" />
          </button>
          <button 
            onClick={() => {
              setActiveCall({ callType: 'video', isIncoming: false });
              emitCallUser({
                toUserId: targetUserId,
                callType: 'video',
                callerInfo: currentUser,
              });
            }}
            title="Start Video Call"
            className="p-2 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <Video className="size-4.5" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            <Info className="size-4.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50">
        {chatMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center py-12">
            <img
              src={targetUser.profile_picture}
              alt={targetUser.full_name}
              className="size-20 rounded-full object-cover mb-3 ring-4 ring-indigo-500/10"
            />
            <h4 className="text-sm font-bold text-slate-700">{targetUser.full_name}</h4>
            <p className="text-xs text-slate-400 mt-1">Say hi to start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.from_user_id === currentUser._id;
            const isReactionPickerOpen = activeReactionMsgId === msg._id;
            const reactions = msg.reactions || [];

            return (
              <div
                key={msg._id}
                className={`relative group flex flex-col max-w-[80%] md:max-w-[70%] ${
                  isMe ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                {/* Reaction Picker Bar */}
                {isReactionPickerOpen && (
                  <div
                    className={`absolute -top-10 z-30 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-lg flex items-center gap-2 animate-in fade-in zoom-in-75 duration-150 ${
                      isMe ? 'right-0' : 'left-0'
                    }`}
                  >
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiReact(msg._id, emoji)}
                        className="text-lg hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Content Container */}
                <div className="relative flex items-center gap-1 group">
                  {/* Reaction trigger icon for desktop hover */}
                  {!isMe && (
                    <button
                      onClick={() =>
                        setActiveReactionMsgId(isReactionPickerOpen ? null : msg._id)
                      }
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-opacity"
                    >
                      <Smile className="size-4" />
                    </button>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all ${
                      isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {/* 1. Voice Note Player */}
                    {msg.message_type === 'audio' && msg.media_url && (
                      <div className="flex items-center gap-3 py-1 min-w-[200px]">
                        <button
                          type="button"
                          onClick={() => toggleAudioPlay(msg._id)}
                          className={`p-2.5 rounded-full transition-transform active:scale-95 ${
                            isMe ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                          }`}
                        >
                          {playingAudioId === msg._id ? (
                            <Pause className="size-4" />
                          ) : (
                            <Play className="size-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex items-center gap-1 h-4">
                            {[40, 70, 30, 90, 50, 80, 40, 60, 100, 50, 70, 30].map((h, i) => (
                              <span
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`w-1 rounded-full ${
                                  playingAudioId === msg._id
                                    ? isMe
                                      ? 'bg-white animate-pulse'
                                      : 'bg-indigo-600 animate-pulse'
                                    : isMe
                                    ? 'bg-white/50'
                                    : 'bg-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-[10px] font-mono ${
                              isMe ? 'text-white/80' : 'text-slate-400'
                            }`}
                          >
                            {formatTimer(audioDurations[msg._id] || msg.audio_duration)}
                          </span>
                        </div>

                        <audio
                          ref={(el) => (audioRefMap.current[msg._id] = el)}
                          src={msg.media_url}
                          onLoadedMetadata={(e) => {
                            const dur = Math.round(e.target.duration);
                            if (dur && !isNaN(dur) && isFinite(dur)) {
                              setAudioDurations((prev) => ({ ...prev, [msg._id]: dur }));
                            }
                          }}
                          onEnded={() => setPlayingAudioId(null)}
                        />
                      </div>
                    )}

                    {/* 2. Image attachment */}
                    {msg.message_type === 'image' && msg.media_url && (
                      <img
                        src={msg.media_url}
                        alt="Attached media"
                        className="w-full max-h-56 object-cover rounded-xl mb-2"
                      />
                    )}

                    {/* 3. Shared Post Preview Card */}
                    {msg.message_type === 'post_share' && msg.shared_post && (
                      <div
                        onClick={() => navigate('/')}
                        className={`p-2.5 rounded-xl border mb-2 cursor-pointer transition-all ${
                          isMe
                            ? 'bg-white/10 border-white/20 hover:bg-white/20'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <img
                            src={
                              msg.shared_post.author_avatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'
                            }
                            alt={msg.shared_post.author_name}
                            className="size-5 rounded-full object-cover"
                          />
                          <span className="text-[11px] font-bold truncate">
                            {msg.shared_post.author_name}
                          </span>
                          <ExternalLink className="size-3 ml-auto opacity-70" />
                        </div>
                        {msg.shared_post.image_url && (
                          <img
                            src={msg.shared_post.image_url}
                            alt="Shared post media"
                            className="w-full h-32 object-cover rounded-lg mb-1.5"
                          />
                        )}
                        {msg.shared_post.content && (
                          <p className="text-[11px] line-clamp-2 opacity-90">
                            {msg.shared_post.content}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 4. Story Reply Preview Card */}
                    {msg.message_type === 'story_reply' && msg.shared_story && (
                      <div
                        className={`p-2.5 rounded-xl border mb-2 flex items-center gap-2.5 ${
                          isMe
                            ? 'bg-white/10 border-white/20'
                            : 'bg-indigo-50/60 border-indigo-100'
                        }`}
                      >
                        {msg.shared_story.media_url ? (
                          <img
                            src={msg.shared_story.media_url}
                            alt="Story thumbnail"
                            className="size-12 rounded-lg object-cover ring-2 ring-indigo-500/30"
                          />
                        ) : (
                          <div className="size-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                            <Film className="size-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                            Replied to Story
                          </span>
                          <span className="text-xs font-semibold block truncate">
                            {msg.shared_story.author_name}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Text content */}
                    {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                  </div>

                  {/* Reaction trigger icon for sender hover */}
                  {isMe && (
                    <button
                      onClick={() =>
                        setActiveReactionMsgId(isReactionPickerOpen ? null : msg._id)
                      }
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-opacity"
                    >
                      <Smile className="size-4" />
                    </button>
                  )}
                </div>

                {/* Floating Reaction Badges */}
                {reactions.length > 0 && (
                  <div
                    className={`-mt-2.5 z-10 flex gap-1 ${
                      isMe ? 'mr-3 justify-end' : 'ml-3 justify-start'
                    }`}
                  >
                    {reactions.map((r, i) => (
                      <span
                        key={i}
                        className="bg-white border border-slate-200 text-[11px] px-1.5 py-0.5 rounded-full shadow-2xs"
                      >
                        {r.emoji}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Timestamp & Seen Checkmark */}
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && (
                    <CheckCheck
                      className={`size-3 ${msg.seen ? 'text-indigo-600' : 'text-slate-400'}`}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Real-time Typing Indicator */}
        {isTargetTyping && (
          <div className="flex items-center gap-2 self-start bg-white border border-slate-200/80 px-3.5 py-2 rounded-2xl text-xs text-slate-500 rounded-bl-none shadow-xs">
            <span className="font-semibold text-slate-700">
              {targetUser.full_name?.split(' ')[0]}
            </span>{' '}
            is typing
            <span className="flex gap-1 items-center ml-1">
              <span className="size-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="size-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="size-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Active Bar */}
      {isRecording ? (
        <div className="p-3 bg-rose-50 border-t border-rose-100 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="relative flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-3 bg-rose-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-rose-700">
              Recording Voice Note {formatTimer(recordingTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cancelRecording}
              className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={stopAndSendRecording}
              className="px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-rose-700 transition-colors"
            >
              <Square className="size-3.5 fill-current" />
              <span>Send Note</span>
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
        >
          <label className="p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 cursor-pointer transition-colors">
            <Image className="size-5" />
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = async () => {
                  let imgUrl = reader.result;
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('http://localhost:5000/api/media/upload', {
                      method: 'POST',
                      body: formData,
                    });
                    const data = await res.json();
                    if (data.url) imgUrl = data.url;
                  } catch (err) {
                    console.log('Chat image upload fallback:', err);
                  }
                  const createdMessage = sendMessage(targetUserId, '', imgUrl, 'image');
                  if (createdMessage) emitSendMessage(createdMessage);
                };
                reader.readAsDataURL(file);
              }}
              className="hidden"
            />
          </label>

            <button
              type="button"
              onClick={startRecording}
              className="p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <Mic className="size-5" />
            </button>

            <input
              type="text"
              placeholder={`Message ${targetUser.full_name?.split(' ')[0]}...`}
              value={inputText}
              onChange={handleInputChange}
              className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-50 hover:shadow-md transition-all"
            >
              <Send className="size-4" />
            </button>
          </form>
      )}

      {/* WebRTC Video & Audio Call Overlay Modal */}
      {(activeCall || incomingCall) && (
        <CallModal
          targetUser={incomingCall ? incomingCall.caller_info : targetUser}
          callType={incomingCall ? incomingCall.call_type : (activeCall?.callType || 'video')}
          isIncoming={Boolean(incomingCall || activeCall?.isIncoming)}
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
};

export default ChatBox;
