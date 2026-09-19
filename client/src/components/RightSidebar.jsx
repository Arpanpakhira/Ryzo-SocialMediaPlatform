import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets, dummyConnectionsData } from '../assets/assets';
import { TrendingUp, UserPlus, ExternalLink, Sparkles } from 'lucide-react';

const TRENDING_TOPICS = [
  { tag: '#ArtificialIntelligence', category: 'Tech', posts: '42.8k' },
  { tag: '#FullStackDevelopment', category: 'Coding', posts: '19.4k' },
  { tag: '#UiUxDesign', category: 'Design', posts: '12.1k' },
  { tag: '#React19', category: 'Web', posts: '8.9k' },
  { tag: '#StartupLife', category: 'Business', posts: '15.3k' },
];

const RightSidebar = () => {
  const { toggleFollowUser, following, darkMode } = useApp();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col gap-6 w-80 p-6 h-screen sticky top-0 overflow-y-auto no-scrollbar">
      {/* Trending Topics Widget */}
      <div className={`rounded-3xl p-5 border transition-colors duration-300 ${
        darkMode
          ? 'ryzo-glass-panel border-amber-500/20 shadow-2xl'
          : 'ryzo-glass-olive-card border-amber-500/25 shadow-2xl'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">Trending Topics</h3>
        </div>
        <div className="flex flex-col gap-3">
          {TRENDING_TOPICS.map((topic) => (
            <div
              key={topic.tag}
              className="flex items-center justify-between cursor-pointer group py-1"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                  {topic.tag}
                </span>
                <span className="text-[10px] text-slate-400">
                  {topic.category} • {topic.posts} posts
                </span>
              </div>
              <Sparkles className="size-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Suggested People Widget */}
      <div className={`rounded-3xl p-5 border transition-colors duration-300 ${
        darkMode
          ? 'ryzo-glass-panel border-amber-500/20 shadow-2xl'
          : 'ryzo-glass-olive-card border-amber-500/25 shadow-2xl'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="size-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Suggested for You</h3>
          </div>
          <span className="text-xs font-semibold text-amber-400 cursor-pointer hover:underline">
            See all
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {dummyConnectionsData.slice(1).map((user) => {
            const isFollowing = following.some((u) => u._id === user._id);

            return (
              <div key={user._id} className="flex items-center justify-between">
                <div 
                  onClick={() => navigate(`/profile/${user._id || user.username}`)}
                  className="flex items-center gap-3 cursor-pointer group/user"
                >
                  <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    className="size-9 rounded-full object-cover ring-2 ring-amber-500/40 group-hover/user:ring-amber-300 transition-all"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200 leading-tight group-hover/user:text-amber-300 transition-colors">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover/user:underline">@{user.username}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(user._id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isFollowing
                      ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      : 'ryzo-btn-gold hover:scale-[1.03]'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sponsored Card */}
      <div className="bg-gradient-to-br from-amber-950 via-yellow-950 to-slate-950 border border-amber-500/30 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-15">
          <Sparkles className="size-24 text-amber-300" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
          Sponsored
        </span>
        <h4 className="text-sm font-bold mt-2.5 leading-snug">
          Build Next-Gen Web Apps with Ryzo
        </h4>
        <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
          Connect with millions of developers and creators around the world.
        </p>
        <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md px-3.5 py-2 rounded-xl transition-all shadow-md">
          <span>Learn More</span>
          <ExternalLink className="size-3.5" />
        </button>
      </div>

      {/* Footer info */}
      <div className="px-2 text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1 font-medium">
        <span onClick={() => navigate('/settings?tab=help&subtab=about')} className="hover:text-amber-400 cursor-pointer transition-colors">About</span>
        <span onClick={() => navigate('/settings?tab=help&subtab=faq')} className="hover:text-amber-400 cursor-pointer transition-colors">Help</span>
        <span onClick={() => navigate('/settings?tab=help&subtab=faq')} className="hover:text-amber-400 cursor-pointer transition-colors">Press</span>
        <span onClick={() => navigate('/settings?tab=help&subtab=about')} className="hover:text-amber-400 cursor-pointer transition-colors">API</span>
        <span onClick={() => navigate('/settings?tab=help&subtab=about')} className="hover:text-amber-400 cursor-pointer transition-colors">Jobs</span>
        <span onClick={() => navigate('/settings?tab=help&subtab=terms')} className="hover:text-amber-400 cursor-pointer transition-colors">Privacy</span>
        <span onClick={() => navigate('/settings?tab=help&subtab=terms')} className="hover:text-amber-400 cursor-pointer transition-colors">Terms</span>
        <p className="w-full mt-2 text-[10px] text-slate-500">
          © 2026 Ryzo Inc. All rights reserved.
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
