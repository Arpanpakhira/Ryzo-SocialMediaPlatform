import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { X, Send, Heart } from 'lucide-react';

const CommentModal = ({ post, onClose }) => {
  const { addComment, currentUser } = useApp();
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const comments = post.comments || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addComment(post._id, text);
      setText('');
    }
  };

  const handleNavigateToProfile = (user) => {
    if (!user) return;
    onClose();
    const targetId = user._id || user.username;
    const isSelf = user._id === currentUser._id || user.username === currentUser.username;
    navigate(isSelf ? '/profile' : `/profile/${targetId}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] h-[550px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Comments ({comments.length})
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {comments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center py-10">
              <p className="text-sm font-medium">No comments yet.</p>
              <p className="text-xs text-slate-400 mt-1">Be the first to start the conversation!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div 
                key={comment._id} 
                onClick={() => handleNavigateToProfile(comment.user)}
                className="flex gap-3 items-start cursor-pointer group/comment p-1.5 rounded-2xl hover:bg-slate-50 transition-all"
              >
                <img
                  src={comment.user?.profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'}
                  alt={comment.user?.full_name}
                  className="size-8 rounded-full object-cover ring-2 ring-transparent group-hover/comment:ring-indigo-500 transition-all"
                />
                <div className="flex-1 bg-slate-50 group-hover/comment:bg-indigo-50/40 p-3 rounded-2xl transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover/comment:text-indigo-600 transition-colors">
                      {comment.user?.full_name || 'User'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
          <img
            src={currentUser?.profile_picture}
            alt={currentUser?.full_name}
            className="size-8 rounded-full object-cover"
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2 rounded-full bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
