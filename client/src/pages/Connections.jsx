import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserCheck, UserPlus, Clock, MessageCircle, Check, X, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const {
    connections,
    followers,
    following,
    pendingConnections,
    acceptConnectionRequest,
    toggleFollowUser,
    closeFriendsList = [],
    toggleCloseFriend,
  } = useApp();

  const [activeTab, setActiveTab] = useState('connections'); // 'connections', 'followers', 'following', 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const getActiveList = () => {
    switch (activeTab) {
      case 'followers':
        return followers;
      case 'following':
        return following;
      case 'pending':
        return pendingConnections;
      case 'connections':
      default:
        return connections;
    }
  };

  const currentList = getActiveList();
  const filteredList = currentList.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>Network & Connections</span>
            <Users className="size-6 text-indigo-600" />
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Manage your network, followers, and connection requests.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="size-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-xs"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 border-b border-slate-200/80">
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border-b-2 -mb-0.5 ${
            activeTab === 'connections'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="size-4" />
          <span>Connections ({connections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('followers')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border-b-2 -mb-0.5 ${
            activeTab === 'followers'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="size-4" />
          <span>Followers ({followers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('following')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border-b-2 -mb-0.5 ${
            activeTab === 'following'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="size-4" />
          <span>Following ({following.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border-b-2 -mb-0.5 ${
            activeTab === 'pending'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="size-4" />
          <span>Pending ({pendingConnections.length})</span>
          {pendingConnections.length > 0 && (
            <span className="size-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingConnections.length}
            </span>
          )}
        </button>
      </div>

      {/* Network Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 border border-slate-100 text-center text-slate-400 shadow-xs">
            <Users className="size-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">No users found in this list.</p>
            <p className="text-xs text-slate-400 mt-1">Try switching tabs or searching for someone else.</p>
          </div>
        ) : (
          filteredList.map((user) => {
            const isFollowingUser = following.some((u) => u._id === user._id);

            const handleNavigateToProfile = () => {
              const targetId = user._id || user.username;
              navigate(`/profile/${targetId}`);
            };

            return (
              <div
                key={user._id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                {/* Cover & Avatar Header */}
                <div
                  onClick={handleNavigateToProfile}
                  className="flex items-center gap-4 mb-4 cursor-pointer group/user"
                >
                  <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    className="size-14 rounded-2xl object-cover ring-4 ring-indigo-500/10 group-hover/user:ring-indigo-500 transition-all shadow-xs"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-800 group-hover/user:text-indigo-600 transition-colors truncate">
                      {user.full_name}
                    </span>
                    <span className="text-xs text-slate-400 group-hover/user:underline truncate">@{user.username}</span>
                    <span className="text-[11px] text-indigo-600 font-medium mt-0.5">
                      {user.location || 'New York, NY'}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p 
                  onClick={handleNavigateToProfile}
                  className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50 hover:bg-indigo-50/50 p-3 rounded-2xl cursor-pointer transition-colors"
                >
                  {user.bio || 'Product Creator & Designer exploring tech and life.'}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                  {activeTab === 'pending' ? (
                    <>
                      <button
                        onClick={() => acceptConnectionRequest(user)}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-indigo-700 transition-colors"
                      >
                        <Check className="size-4" />
                        Accept
                      </button>
                      <button className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                        <X className="size-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleFollowUser(user._id)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isFollowingUser
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                        }`}
                      >
                        <UserPlus className="size-4" />
                        {isFollowingUser ? 'Following' : 'Follow'}
                      </button>
                      <button
                        onClick={() => toggleCloseFriend(user._id || user.username)}
                        title={
                          closeFriendsList.includes(user._id || user.username)
                            ? 'Remove from Close Friends'
                            : 'Add to Close Friends'
                        }
                        className={`p-2.5 rounded-xl border transition-all ${
                          closeFriendsList.includes(user._id || user.username)
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Star className={`size-4 ${closeFriendsList.includes(user._id || user.username) ? 'fill-white' : ''}`} />
                      </button>
                      <button
                        onClick={() => navigate('/messages')}
                        className="p-2.5 rounded-xl border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <MessageCircle className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Connections;
