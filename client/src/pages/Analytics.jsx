import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Award,
  Film,
  Image,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  Globe,
  Zap,
  CheckCircle2,
  Sliders,
  Lock,
} from 'lucide-react';

const Analytics = () => {
  const { currentUser, posts = [], stories = [], accountType, setAccountTypeMode } = useApp();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('30d'); // '7d', '30d', '90d'
  const [activeTab, setActiveTab] = useState('reach'); // 'reach', 'audience', 'content'

  if (accountType === 'casual') {
    return (
      <div className="flex-1 min-h-[80vh] bg-slate-50/60 p-4 md:p-8 max-w-4xl mx-auto flex items-center justify-center animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-xl flex flex-col items-center justify-center text-center gap-6 max-w-md relative overflow-hidden border-t-4 border-t-indigo-600">
          <div className="size-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Lock className="size-10" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold w-fit mx-auto">
              Professional Feature Locked
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Switch to Professional Mode
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              You are currently using <strong>Casual Personal Mode</strong>. Creator Insights, reach graphs, follower demographics, and content performance metrics are only available for <strong>Professional Creator Accounts</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
            <button
              onClick={() => {
                setAccountTypeMode('professional');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Switch to Professional Mode
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 hover:bg-slate-200 transition-all"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic metrics scaling according to selected timeframe
  const multiplier = timeframe === '7d' ? 0.25 : timeframe === '90d' ? 2.8 : 1.0;

  const totalReach = Math.round(42850 * multiplier);
  const totalImpressions = Math.round(78420 * multiplier);
  const totalEngagement = Math.round(14620 * multiplier);
  const profileVisits = Math.round(8940 * multiplier);
  const netFollowerGrowth = Math.round(1280 * multiplier);

  // Daily Reach Trend Data (for custom chart)
  const reachDays = [
    { day: 'Mon', reach: 3200, impressions: 5400 },
    { day: 'Tue', reach: 4100, impressions: 6900 },
    { day: 'Wed', reach: 5800, impressions: 9800 },
    { day: 'Thu', reach: 4900, impressions: 8100 },
    { day: 'Fri', reach: 7200, impressions: 12400 },
    { day: 'Sat', reach: 8900, impressions: 14800 },
    { day: 'Sun', reach: 8750, impressions: 14200 },
  ];

  // Age Breakdown
  const ageGroups = [
    { group: '18–24', percentage: 42, count: '18.0K' },
    { group: '25–34', percentage: 38, count: '16.2K' },
    { group: '35–44', percentage: 14, count: '6.0K' },
    { group: '45+', percentage: 6, count: '2.6K' },
  ];

  // Top Cities / Locations
  const topLocations = [
    { city: 'Kolkata, IN', percentage: '34%' },
    { city: 'Mumbai, IN', percentage: '22%' },
    { city: 'Delhi, IN', percentage: '18%' },
    { city: 'Bengaluru, IN', percentage: '14%' },
    { city: 'International', percentage: '12%' },
  ];

  // Peak Follower Activity Hours
  const peakHours = [
    { time: '9 AM', activity: 45 },
    { time: '12 PM', activity: 68 },
    { time: '3 PM', activity: 55 },
    { time: '6 PM', activity: 92 },
    { time: '9 PM', activity: 100 },
    { time: '12 AM', activity: 38 },
  ];

  // Top performing content
  const userPosts = posts.filter(
    (p) =>
      (p.user?._id && p.user?._id === currentUser?._id) ||
      (p.user?.username && p.user?.username === currentUser?.username)
  );

  return (
    <div className="flex-1 min-h-screen bg-slate-50/60 p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 size-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-400 fill-amber-400" />
              <span>Pro Creator Insights</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">Updated 5m ago</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2 mt-1">
            <span>Audience & Content Analytics</span>
            <BarChart3 className="size-7 text-indigo-400" />
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-medium max-w-xl">
            Track your profile reach, follower growth, peak audience active hours, and content engagement metrics.
          </p>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 z-10 shrink-0">
          {[
            { key: '7d', label: 'Last 7 Days' },
            { key: '30d', label: 'Last 30 Days' },
            { key: '90d', label: 'Last 90 Days' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTimeframe(t.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === t.key
                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Reach */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Eye className="size-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="size-3.5" />
              <span>+18.4%</span>
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Accounts Reached
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {totalReach.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Impressions</span>
            <span className="font-bold text-slate-700">{totalImpressions.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: Engagement */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
              <Heart className="size-5 fill-pink-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="size-3.5" />
              <span>+24.1%</span>
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Content Engagement
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {totalEngagement.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Engagement Rate</span>
            <span className="font-bold text-slate-700">8.4%</span>
          </div>
        </div>

        {/* Card 3: Profile Activity */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="size-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="size-3.5" />
              <span>+12.8%</span>
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Profile Visits
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {profileVisits.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Link Clicks</span>
            <span className="font-bold text-slate-700">1,420</span>
          </div>
        </div>

        {/* Card 4: Follower Growth */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
          <div className="flex items-center justify-between">
            <div className="size-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Users className="size-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="size-3.5" />
              <span>+9.6%</span>
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Net Follower Growth
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              +{netFollowerGrowth.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Total Followers</span>
            <span className="font-bold text-slate-700">12,480</span>
          </div>
        </div>

      </div>

      {/* Main Interactive Charts & Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Visual Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="size-5 text-indigo-600" />
                <span>Performance Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Daily accounts reached vs content impressions overview
              </p>
            </div>

            {/* Chart Tab switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { key: 'reach', label: 'Reach Trend' },
                { key: 'audience', label: 'Audience Hours' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Render Active Chart View */}
          {activeTab === 'reach' ? (
            <div className="flex flex-col gap-6">
              {/* Visual Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-3 px-2 pt-6">
                {reachDays.map((item, idx) => {
                  const maxReach = 10000;
                  const reachPct = (item.reach / maxReach) * 100;
                  const impPct = (item.impressions / 15000) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      
                      {/* Hover Tooltip Popup */}
                      <div className="opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-xl flex flex-col gap-0.5 pointer-events-none mb-1 z-10 text-center whitespace-nowrap">
                        <span className="font-bold text-indigo-300">{item.day}</span>
                        <span>Reach: {item.reach.toLocaleString()}</span>
                        <span>Impr: {item.impressions.toLocaleString()}</span>
                      </div>

                      {/* Bar Container */}
                      <div className="w-full flex items-end justify-center gap-1.5 h-44 bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                        {/* Reach Bar */}
                        <div
                          style={{ height: `${reachPct}%` }}
                          className="w-1/2 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-xl transition-all duration-300 group-hover:brightness-110 shadow-xs"
                        />
                        {/* Impression Bar */}
                        <div
                          style={{ height: `${impPct}%` }}
                          className="w-1/2 bg-gradient-to-t from-purple-400 to-pink-400 rounded-xl transition-all duration-300 group-hover:brightness-110 shadow-xs"
                        />
                      </div>

                      <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-indigo-500" />
                  <span>Accounts Reached</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-pink-400" />
                  <span>Impressions</span>
                </div>
              </div>
            </div>
          ) : (
            /* Audience Hours View */
            <div className="flex flex-col gap-4 py-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Clock className="size-4 text-indigo-500" />
                <span>Peak Follower Online Activity (Most Active Times)</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {peakHours.map((h, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                      h.activity > 80
                        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">{h.time}</span>
                      <span className={h.activity > 80 ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>
                        {h.activity}% Active
                      </span>
                    </div>
                    {/* Activity Meter */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${h.activity}%` }}
                        className={`h-full rounded-full ${
                          h.activity > 80 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900 font-medium flex items-center gap-3 mt-2">
                <Sparkles className="size-5 text-indigo-600 shrink-0" />
                <span>
                  <strong>Best Time to Post:</strong> Your followers are most active between <strong>6:00 PM – 9:00 PM</strong>. Posting during this window yields 34% more initial comments.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Audience Demographics & AI Insights */}
        <div className="flex flex-col gap-6">
          
          {/* Audience Demographics Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="size-5 text-indigo-600" />
              <span>Audience Demographics</span>
            </h3>

            {/* Age Distribution */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Age Distribution
              </span>
              <div className="flex flex-col gap-2">
                {ageGroups.map((a, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{a.group}</span>
                      <span>{a.percentage}% ({a.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${a.percentage}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Locations */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Top Cities & Regions
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {topLocations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700"
                  >
                    <span>{loc.city}</span>
                    <span className="font-bold text-indigo-600">{loc.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart AI Creator Recommendations Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              <Award className="size-4" />
              <span>Growth Recommendation</span>
            </div>
            <h4 className="text-base font-extrabold leading-snug">
              Boost Your Reel Reach by 45%
            </h4>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Short Reels with background music attached receive 2.4x higher shares on Ryzo! Try adding trending music to your next post.
            </p>
            <div className="pt-2">
              <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white inline-flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-300" />
                <span>Optimized for your profile</span>
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Top Performing Content Highlights Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="size-5 text-amber-500" />
              <span>Top Performing Content</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Your highest engaged posts and reels published over the selected period
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            High Engagement
          </span>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Item 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-100/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Film className="size-3" />
                <span>Reel • 18.4K Plays</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">2 days ago</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 line-clamp-2">
              "Building modern web apps with custom audio trim controls! 🎵✨ #coding #webdev"
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-200/60">
              <span className="flex items-center gap-1 text-pink-600 font-bold">
                <Heart className="size-3.5 fill-pink-600" /> 1,420
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="size-3.5" /> 248
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="size-3.5 text-indigo-500" /> 182
              </span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 bg-purple-100/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Image className="size-3" />
                <span>Post • 12.1K Reach</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">5 days ago</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 line-clamp-2">
              "Late night coding sessions & smooth design systems. What features are you building?"
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-200/60">
              <span className="flex items-center gap-1 text-pink-600 font-bold">
                <Heart className="size-3.5 fill-pink-600" /> 980
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="size-3.5" /> 114
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="size-3.5 text-amber-500" /> 94
              </span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-600 bg-pink-100/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="size-3" />
                <span>Story • 96% Completion</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1 day ago</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 line-clamp-2">
              "Interactive Q&A: Ask me anything about full-stack social network architecture!"
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-200/60">
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <Eye className="size-3.5" /> 3,840
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="size-3.5 text-emerald-600" /> 86 replies
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Analytics;
