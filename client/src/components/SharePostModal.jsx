import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { dummyConnectionsData } from '../assets/assets';
import { X, Search, Send, Check } from 'lucide-react';

const SharePostModal = ({ post, onClose }) => {
  const { currentUser, sendMessage } = useApp();
  const { emitSendMessage } = useSocket();
  const [search, setSearch] = useState('');
  const [sentMap, setSentMap] = useState({});

  const friends = dummyConnectionsData.filter((u) => u._id !== currentUser._id);

  const filteredFriends = friends.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleShareToUser = (targetUser) => {
    const sharedPostPayload = {
      post_id: post._id,
      content: post.content || '',
      image_url: post.image_urls?.[0] || '',
      author_name: post.user?.full_name || 'Social Creator',
      author_avatar: post.user?.profile_picture || '',
    };

    const newMsg = sendMessage(
      targetUser._id,
      '',
      '',
      'post_share',
      { shared_post: sharedPostPayload }
    );

    if (newMsg) {
      emitSendMessage(newMsg);
    }

    setSentMap((prev) => ({ ...prev, [targetUser._id]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Background click to close */}
      <div onClick={onClose} className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Share Post to Direct Message</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Post Preview Card */}
        <div className="mx-4 mt-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
          {post.image_urls?.[0] ? (
            <img
              src={post.image_urls[0]}
              alt="Post preview"
              className="size-12 rounded-xl object-cover"
            />
          ) : (
            <div className="size-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
              Post
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-800 block truncate">
              {post.user?.full_name}
            </span>
            <p className="text-[11px] text-slate-500 truncate">
              {post.content || 'Shared photo'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {filteredFriends.map((user) => {
            const hasSent = Boolean(sentMap[user._id]);
            return (
              <div
                key={user._id}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    className="size-10 rounded-full object-cover ring-2 ring-indigo-500/10"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">{user.full_name}</span>
                    <span className="text-[10px] text-slate-400">@{user.username}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleShareToUser(user)}
                  disabled={hasSent}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    hasSent
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  {hasSent ? (
                    <>
                      <Check className="size-3.5" />
                      <span>Sent</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
