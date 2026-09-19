import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import ChatBox from './ChatBox';
import { Search, MessageSquarePlus, MessageCircle } from 'lucide-react';
import { dummyConnectionsData } from '../assets/assets';

const Messages = () => {
  const navigate = useNavigate();
  const { recentChats, currentUser, darkMode } = useApp();
  const { onlineUsers } = useSocket();

  const [selectedUserId, setSelectedUserId] = useState(
    recentChats[0]?.from_user_id?._id || dummyConnectionsData[1]?._id || 'user_2'
  );
  const [search, setSearch] = useState('');

  const conversationList = dummyConnectionsData.filter((u) => u._id !== currentUser._id);

  const filteredConversations = conversationList.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-4 md:p-6 h-[calc(100dvh-112px)] md:h-[calc(100vh-80px)]">
      <div className={`size-full rounded-none sm:rounded-3xl border-0 sm:border shadow-sm flex overflow-hidden ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        {/* Left Side: Recent Conversation List */}
        <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col h-full ${
          darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-100'
        }`}>
          {/* Top Title & Search */}
          <div className={`p-4 border-b flex flex-col gap-3 ${
            darkMode ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <h1 className={`text-xl font-bold flex items-center gap-2 ${
                darkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                <span>Messages</span>
                <MessageCircle className="size-5 text-amber-500" />
              </h1>
              <button className={`p-2 rounded-full transition-colors ${
                darkMode ? 'bg-amber-950/40 text-amber-300' : 'bg-amber-50 text-amber-600'
              }`}>
                <MessageSquarePlus className="size-4.5" />
              </button>
            </div>

            <div className="relative">
              <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages & friends..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded-2xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                  darkMode
                    ? 'bg-slate-800/80 border border-slate-700/60 text-slate-100 placeholder-slate-400'
                    : 'bg-slate-100/80 border border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {filteredConversations.map((user) => {
              const isSelected = selectedUserId === user._id;
              const isOnline = onlineUsers.includes(user._id);
              const userRecentChat = recentChats.find(
                (c) => c.from_user_id._id === user._id || c.to_user_id._id === user._id
              );

              return (
                <div
                  key={user._id}
                  onClick={() => {
                    setSelectedUserId(user._id);
                    if (window.innerWidth < 768) {
                      navigate(`/messages/${user._id}`);
                    }
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? darkMode
                        ? 'bg-amber-950/40 border border-amber-500/30'
                        : 'bg-amber-50/80 border border-amber-100/60'
                      : darkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={user.profile_picture}
                      alt={user.full_name}
                      className="size-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div
                      className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-white ${
                        isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {user.full_name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {userRecentChat
                          ? new Date(userRecentChat.updatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '12:45 PM'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate">
                      {userRecentChat ? userRecentChat.text : 'Tap to open chat...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active ChatBox View */}
        <div className="hidden md:flex flex-1 flex-col h-full bg-slate-50">
          <ChatBox activeUserId={selectedUserId} />
        </div>
      </div>
    </div>
  );
};

export default Messages;

