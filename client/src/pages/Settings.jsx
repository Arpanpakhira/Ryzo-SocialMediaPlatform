import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Users,
  Star,
  CheckCircle2,
  ChevronRight,
  Zap,
  HelpCircle,
  Key,
  Smartphone,
  HardDrive,
  LogOut,
  Radio,
  Sliders,
  Check,
  AlertCircle,
  X,
  Download,
  CheckSquare,
  Shield,
  Phone,
  Mail,
  Calendar,
  Globe,
  Trash2,
  Heart,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Languages,
  Film,
  Bookmark,
  Search,
  Filter,
  UserX,
  UserCheck,
  AtSign,
  Smile,
  Info,
  ExternalLink,
  ShieldAlert,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Paperclip,
  Clock,
  LifeBuoy,
  BookOpen,
  FileCheck,
  Cpu,
  Server,
  Activity,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Settings = () => {
  const {
    currentUser,
    updateProfile,
    accountType,
    setAccountTypeMode,
    isPrivateAccount,
    setIsPrivateAccount,
    darkMode,
    setDarkMode,
    dataSaver,
    setDataSaver,
    toggleVerificationStatus,
    closeFriendsList,
    posts = [],
    stories = [],
    followers = [],
    following = [],
  } = useApp();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeSection, setActiveSection] = useState('accounts_center'); // 'accounts_center', 'account_type', 'privacy', 'interactions', 'content_prefs', 'notifications', 'media_app', 'supervision', 'help'
  const [activeModal, setActiveModal] = useState(null); // 'personal_details', 'security', 'devices', 'data_download', 'hidden_words', 'blocked_users', 'language', 'report_problem', 'help_center', 'privacy_terms', 'about_ryzo'
  const [switchSuccessToast, setSwitchSuccessToast] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // 1. Personal Details Form State
  const [emailInput, setEmailInput] = useState(currentUser?.email || 'arpan@example.com');
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '+91 98765 43210');
  const [birthdayInput, setBirthdayInput] = useState(currentUser?.birthday || '1998-08-15');
  const [genderInput, setGenderInput] = useState(currentUser?.gender || 'Male');

  // 2. Security Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // 3. Privacy & Interaction Settings
  const [hideLikeCounts, setHideLikeCounts] = useState(false);
  const [allowTagsFrom, setAllowTagsFrom] = useState('everyone'); // 'everyone', 'following', 'no_one'
  const [allowDMRequests, setAllowDMRequests] = useState('everyone');
  const [allowReelRemix, setAllowReelRemix] = useState(true);
  const [autoHideOffensiveComments, setAutoHideOffensiveComments] = useState(true);
  const [customKeywordBlocklist, setCustomKeywordBlocklist] = useState('spam, buy followers, scam, crypto promo');
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [sensitiveContentLevel, setSensitiveContentLevel] = useState('standard'); // 'standard', 'less', 'more'

  // 4. Connected Devices List
  const [devicesList, setDevicesList] = useState([
    { id: 1, name: 'Windows 11 Chrome', location: 'Kolkata, India', active: 'Active now (Current Device)', current: true },
    { id: 2, name: 'iPhone 15 Pro (Safari)', location: 'Mumbai, India', active: 'Active 2 hours ago', current: false },
    { id: 3, name: 'MacBook Pro (Edge)', location: 'Bengaluru, India', active: 'Active 3 days ago', current: false },
  ]);

  // 5. Blocked / Muted Accounts
  const [blockedUsersList, setBlockedUsersList] = useState([
    { id: 'b_1', name: 'Spam Bot 99', username: 'spambot99', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' },
  ]);

  // 6. Help, Support & Terms State
  const [helpSubTab, setHelpSubTab] = useState('overview'); // 'overview', 'report', 'faq', 'terms', 'about'
  const [termsSubTab, setTermsSubTab] = useState('terms'); // 'terms', 'privacy', 'community', 'cookies'
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState(1);
  const [faqFeedback, setFaqFeedback] = useState({});

  // Report Problem Form State
  const [reportCategory, setReportCategory] = useState('Bug Report');
  const [reportSubject, setReportSubject] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportIncludeSysInfo, setReportIncludeSysInfo] = useState(true);
  const [reportAttachmentName, setReportAttachmentName] = useState('');

  // Support Tickets History
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'RYZ-8492',
      category: 'Bug Report',
      subject: 'Audio playback stutters in Reels',
      status: 'In Review',
      date: 'Sep 15, 2026',
      description: 'Audio playback stutters occasionally on Desktop Chrome when looping vertical reels.',
      response: 'Our audio engineering team has reproduced this issue on Chrome 128. A patch fix is scheduled for release in v2.4.1.'
    },
    {
      id: 'RYZ-7120',
      category: 'Account Security',
      subject: '2FA Verification SMS Delay',
      status: 'Resolved',
      date: 'Sep 02, 2026',
      description: 'SMS verification code took around 3 minutes to arrive when logging in from a new IP.',
      response: 'Carrier gateway latency issue has been resolved. Authenticator app backup is also available.'
    }
  ]);

  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState(null);

  // Sync state with URL search parameters (e.g. /settings?tab=help&subtab=report)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const subtabParam = searchParams.get('subtab');
    const modalParam = searchParams.get('modal');

    if (tabParam) {
      setActiveSection(tabParam);
    }
    if (subtabParam) {
      setHelpSubTab(subtabParam);
    }
    if (modalParam) {
      setActiveModal(modalParam);
    }
  }, [searchParams]);

  // Submit Report Problem Form
  const handleSubmitReport = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!reportSubject.trim() || !reportDescription.trim()) {
      showToast('Please enter a subject and detailed description!');
      return;
    }

    const newTicketId = `RYZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newTicketId,
      category: reportCategory,
      subject: reportSubject,
      status: 'Open',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      description: reportDescription + (reportAttachmentName ? ` (Attachment: ${reportAttachmentName})` : ''),
      response: 'Ticket received. Our support team will review your report within 24 hours.'
    };

    setSupportTickets([newTicket, ...supportTickets]);
    setReportSubject('');
    setReportDescription('');
    setReportAttachmentName('');
    showToast(`Support Ticket ${newTicketId} created successfully!`);
  };

  // Download Legal Terms Document (.TXT)
  const handleDownloadTermsDoc = () => {
    const docText = `RYZO SOCIAL HUB - TERMS OF SERVICE & PRIVACY POLICIES
Document Version: v2.4.0 (Updated September 18, 2026)

1. TERMS OF SERVICE
Welcome to Ryzo Social Hub. By accessing or using our application, websites, or services, you agree to be bound by these Terms of Service.
- Account Responsibility: You are responsible for safeguarding your login credentials and for all activities under your account.
- User Conduct: You agree not to post hate speech, harassment, fake news, or illegal content.
- Content Ownership: You retain ownership of all original media posted to Ryzo. You grant Ryzo a worldwide license to host, display, and distribute your content.

2. PRIVACY POLICY
- Data Collection: We collect profile details, usage telemetry, and technical diagnostic info to provide and improve our service.
- Data Control: You may export or request deletion of your account data at any time under Settings > Accounts Center.

3. COMMUNITY GUIDELINES
- Be authentic, respectful, and safe.
- Spam, automated bots, and impersonation will result in immediate account suspension.

4. COOKIE POLICY
- Essential cookies are required for session management and security.
- Preference and performance cookies help store your app theme and audio settings.

© 2026 Ryzo Inc. All rights reserved.`;

    const blob = new Blob([docText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ryzo_terms_and_privacy_v2.4.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Legal terms document downloaded!');
  };

  // Run System Diagnostics
  const handleRunDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagnosticsResult(null);
    setTimeout(() => {
      setDiagnosticsRunning(false);
      setDiagnosticsResult({
        status: 'Healthy',
        latency: '14ms',
        websocket: 'Connected (Pusher/Socket.io)',
        version: 'v2.4.0 (Build 2026.09.18)',
        storage: 'IndexedDB / LocalStorage OK',
      });
      showToast('System diagnostics complete! All systems operational.');
    }, 1000);
  };

  // Check for App Updates
  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      showToast('You are running the latest version of Ryzo (v2.4.0)!');
    }, 1000);
  };

  // FAQ List Data
  const faqList = [
    {
      id: 1,
      category: 'account',
      question: 'How do I switch between Personal and Professional Creator mode?',
      answer: 'Navigate to Settings > Profile Mode (Casual / Pro). Click "Switch to Professional Creator Mode" to instantly unlock advanced analytics, audience demographics, link in bio customization, and creator monetization features.'
    },
    {
      id: 2,
      category: 'account',
      question: 'How do I get a Verified Creator Badge on Ryzo?',
      answer: 'Verified badges indicate authentic accounts for public figures, creators, and brands. Navigate to Settings > Accounts Center and click "Toggle Verification Request" to verify your identity.'
    },
    {
      id: 3,
      category: 'privacy',
      question: 'Who can view my posts, reels, and active stories?',
      answer: 'If your account is Public, anyone on Ryzo can view your posts and reels. If your account is set to Private (Settings > Privacy & Sharing), only approved followers can see your profile and media.'
    },
    {
      id: 4,
      category: 'privacy',
      question: 'How do I block or filter offensive comments and spam?',
      answer: 'Go to Settings > Messages, Tags & Comments. You can turn on "Hide Offensive Comments" or add custom blocked keywords. You can also view and manage your Blocked Users list at any time.'
    },
    {
      id: 5,
      category: 'reels',
      question: 'What video formats and aspect ratios are supported for Reels?',
      answer: 'Ryzo supports MP4, MOV, and WebM video formats up to 4K resolution at 60fps. The optimal aspect ratio for Reels is 9:16 vertical orientation (1080x1920 pixels).'
    },
    {
      id: 6,
      category: 'reels',
      question: 'How do I add trending audio or background tracks to my content?',
      answer: 'When creating a Reel or Post, click the Music icon to open the Ryzo Music Library. Search trending tracks, preview audio clips, filter by genre, and adjust the audio volume mix.'
    },
    {
      id: 7,
      category: 'monetization',
      question: 'How do Creator Payouts work on Ryzo Social Hub?',
      answer: 'Creators in Professional Mode with over 1,000 followers earn revenue based on Reel impressions, post engagement, and fan gifts. Payouts are transferred automatically on the 1st of every month via connected Stripe or PayPal accounts.'
    },
    {
      id: 8,
      category: 'troubleshooting',
      question: 'What should I do if videos or images fail to upload?',
      answer: 'Ensure your network connection is stable and data saver mode is configured properly under Settings > Data Saver, Quality & Theme. If uploads continue failing, submit a report under "Report a Problem".'
    }
  ];

  const filteredFaqs = faqList.filter((item) => {
    const matchesCat = selectedFaqCategory === 'all' || item.category === selectedFaqCategory;
    const matchesQuery =
      item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Toast Helper
  const showToast = (msg) => {
    setSwitchSuccessToast(msg);
    setTimeout(() => setSwitchSuccessToast(null), 3500);
  };

  const handleModeSwitch = (mode) => {
    setAccountTypeMode(mode);
    const modeName = mode === 'professional' ? 'Professional Creator Mode' : 'Casual Personal Mode';
    showToast(`Switched to ${modeName}!`);
  };

  // Submit Personal Details Update
  const handleSavePersonalDetails = (e) => {
    e.preventDefault();
    updateProfile({
      email: emailInput,
      phone: phoneInput,
      birthday: birthdayInput,
      gender: genderInput,
    });
    setActiveModal(null);
    showToast('Personal details updated successfully!');
  };

  // Submit Password Change
  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (newPass && newPass.length < 6) {
      showToast('New password must be at least 6 characters!');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('New passwords do not match!');
      return;
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setActiveModal(null);
    showToast('Password & Security settings updated!');
  };

  // Log Out From Other Devices
  const handleLogoutOtherDevices = () => {
    setDevicesList((prev) => prev.filter((d) => d.current));
    showToast('Logged out from all other active device sessions.');
  };

  // Download Account Data JSON
  const handleDownloadAccountData = () => {
    const accountData = {
      user_profile: currentUser,
      account_mode: accountType,
      is_verified: currentUser?.is_verified,
      posts_count: posts.length,
      stories_count: stories.length,
      followers_count: followers.length,
      following_count: following.length,
      privacy_settings: {
        is_private: isPrivateAccount,
        hide_likes: hideLikeCounts,
        allow_remix: allowReelRemix,
        language: selectedLanguage,
      },
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(accountData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ryzo_account_data_${currentUser?.username || 'user'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Account data backup downloaded successfully!');
  };

  // Navigation Items
  const navSections = [
    { id: 'accounts_center', label: 'Accounts Center', icon: ShieldCheck, category: 'Account' },
    { id: 'account_type', label: 'Profile Mode (Casual / Pro)', icon: Zap, category: 'Account' },
    { id: 'privacy', label: 'Privacy & Sharing', icon: Lock, category: 'Safety' },
    { id: 'interactions', label: 'Messages, Tags & Comments', icon: MessageSquare, category: 'Safety' },
    { id: 'content_prefs', label: 'Content Preferences & Likes', icon: EyeOff, category: 'Preferences' },
    { id: 'notifications', label: 'Push Notifications', icon: Bell, category: 'Preferences' },
    { id: 'media_app', label: 'Data Saver, Quality & Theme', icon: Sliders, category: 'Preferences' },
    { id: 'supervision', label: 'Supervision & Family Safety', icon: ShieldAlert, category: 'Safety' },
    { id: 'help', label: 'Help, Support & Terms', icon: HelpCircle, category: 'Support' },
  ];

  const filteredNavSections = navSections.filter((s) =>
    s.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen bg-slate-50/60 p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {switchSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-200 border border-white/20">
          <CheckCircle2 className="size-4 text-emerald-300" />
          <span>{switchSuccessToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <SettingsIcon className="size-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Settings & Accounts Center
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage all Instagram-grade account controls, privacy, content filters, and profile modes
            </p>
          </div>
        </div>

        {/* Current Mode Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
          <span className={`size-2.5 rounded-full ${accountType === 'professional' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'}`} />
          <span>{accountType === 'professional' ? 'Professional Creator Mode' : 'Casual Personal Mode'}</span>
        </div>
      </div>

      {/* Main Settings Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sidebar Category Menu */}
        <div className="md:col-span-1 flex flex-col gap-3 bg-white p-3 rounded-3xl border border-slate-200/80 shadow-xs h-fit">
          
          {/* Settings Search Bar */}
          <div className="relative">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="flex flex-col gap-1 max-h-[600px] overflow-y-auto no-scrollbar">
            {filteredNavSections.map((sec) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`size-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Settings Content Area */}
        <div className="md:col-span-3 flex flex-col gap-6">
          
          {/* 1. ACCOUNTS CENTER */}
          {activeSection === 'accounts_center' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Meta / Ryzo Central Hub
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-indigo-600" />
                  <span>Accounts Center</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Manage your connected account experiences, personal details, password security, active sessions, and verification badge.
                </p>
              </div>

              {/* User Profile Overview Header */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser?.profile_picture}
                    alt={currentUser?.full_name}
                    className="size-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                      {currentUser?.full_name}
                      {currentUser?.is_verified && <CheckCircle2 className="size-4 text-indigo-600" />}
                    </span>
                    <span className="text-xs text-slate-400">@{currentUser?.username} • {emailInput}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    toggleVerificationStatus();
                    showToast(currentUser?.is_verified ? 'Verified Creator status updated!' : 'Verification badge requested & added!');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    currentUser?.is_verified
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                      : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {currentUser?.is_verified ? 'Verified Creator ✅' : 'Get Verified Badge'}
                </button>
              </div>

              {/* Accounts Center Controls Grid */}
              <div className="flex flex-col gap-2.5">
                
                <div
                  onClick={() => setActiveModal('personal_details')}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                      <User className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Personal Details & Contact Info
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Email ({emailInput}), Phone ({phoneInput}), Birthday & Gender
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>

                <div
                  onClick={() => setActiveModal('security')}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                      <Key className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Password & Security
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Change password, 2FA status ({is2FAEnabled ? 'Enabled' : 'Disabled'}), login alerts
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>

                <div
                  onClick={() => setActiveModal('devices')}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                      <Smartphone className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Connected Devices & Sessions
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {devicesList.length} active logged-in browser sessions
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>

                <div
                  onClick={() => setActiveModal('data_download')}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                      <HardDrive className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Ad Preferences & Data Download
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Download JSON copy of posts & stories data or manage ad topics
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            </div>
          )}

          {/* 2. PROFILE MODE (Casual vs Professional) */}
          {activeSection === 'account_type' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Account Type Controls
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <Zap className="size-5 text-indigo-600" />
                  <span>Choose Profile Mode</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Switch between Casual Personal Mode and Professional Creator Mode. Professional Mode unlocks creator insights, analytics graphs, and advanced audio tools.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => handleModeSwitch('casual')}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 relative overflow-hidden ${
                    accountType === 'casual'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                      <User className="size-6 text-slate-600" />
                    </div>
                    {accountType === 'casual' && (
                      <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Check className="size-3" />
                        <span>Active Mode</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Casual Mode (Personal)</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      For personal sharing with friends & family. Keeps your experience simple without metrics clutter.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleModeSwitch('professional')}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 relative overflow-hidden ${
                    accountType === 'professional'
                      ? 'border-indigo-600 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/30 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                      <BarChart3 className="size-6 text-white" />
                    </div>
                    {accountType === 'professional' && (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Check className="size-3" />
                        <span>Active Mode</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>Professional Mode (Creator)</span>
                      <Sparkles className="size-4 text-purple-600" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      For creators, public figures & businesses. Unlocks full performance insights, demographics & audio tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. PRIVACY & SHARING */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Account Protection
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <Lock className="size-5 text-indigo-600" />
                  <span>Privacy & Account Visibility</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Control who sees your content, close friends list, and story resharing permissions.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Lock className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-slate-900">Private Account</span>
                      <span className="text-[11px] text-slate-400">Only approved connections can view your posts and stories</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsPrivateAccount(!isPrivateAccount);
                      showToast(isPrivateAccount ? 'Account is now Public!' : 'Account is now Private!');
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isPrivateAccount ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 size-4 rounded-full bg-white transition-transform ${isPrivateAccount ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Star className="size-5 fill-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-slate-900">Close Friends List</span>
                      <span className="text-[11px] text-slate-400">
                        {closeFriendsList.length} members selected for exclusive stories
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/connections')}
                    className="px-3.5 py-1.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 transition-colors"
                  >
                    Manage List
                  </button>
                </div>

                <div
                  onClick={() => setActiveModal('blocked_users')}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <UserX className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-slate-900">Blocked & Muted Accounts</span>
                      <span className="text-[11px] text-slate-400">{blockedUsersList.length} accounts blocked from interacting</span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* 4. MESSAGES, TAGS & COMMENTS */}
          {activeSection === 'interactions' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Interaction Controls
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <MessageSquare className="size-5 text-indigo-600" />
                  <span>Messages, Tags & Comment Filters</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Control who can tag you, send direct message requests, or remix your Reels.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                {/* Allow Tags From */}
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <AtSign className="size-4 text-indigo-600" />
                    <span>Allow Tags & Mentions From</span>
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { key: 'everyone', label: 'Everyone' },
                      { key: 'following', label: 'People You Follow' },
                      { key: 'no_one', label: 'No One' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setAllowTagsFrom(opt.key);
                          showToast(`Tagging set to ${opt.label}!`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          allowTagsFrom === opt.key
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reels Remixing */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Film className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900">Allow Reels Remixing</span>
                      <span className="text-[11px] text-slate-400">Let creators remix your video reels into split-screen clips</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAllowReelRemix(!allowReelRemix);
                      showToast(allowReelRemix ? 'Reel remixing disabled' : 'Reel remixing enabled');
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      allowReelRemix ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 size-4 rounded-full bg-white transition-transform ${allowReelRemix ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Hidden Words Filter Modal Trigger */}
                <div
                  onClick={() => setActiveModal('hidden_words')}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Filter className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900">Hidden Words & Offensive Comments</span>
                      <span className="text-[11px] text-slate-400">Auto-hide offensive comments & custom keyword blocklist</span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* 5. CONTENT PREFERENCES */}
          {activeSection === 'content_prefs' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Feed Customization
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <EyeOff className="size-5 text-indigo-600" />
                  <span>Content Preferences & Like Counts</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Hide like & view counts on your posts, or adjust sensitive content filtering.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                {/* Hide Like Counts Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                      <Heart className="size-5 fill-pink-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900">Hide Like & View Counts</span>
                      <span className="text-[11px] text-slate-400">Hide total likes and video view counts on all posts in feed</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setHideLikeCounts(!hideLikeCounts);
                      showToast(hideLikeCounts ? 'Like counts visible' : 'Like counts hidden across feed');
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      hideLikeCounts ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 size-4 rounded-full bg-white transition-transform ${hideLikeCounts ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Sensitive Content Control */}
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="size-4 text-indigo-600" />
                    <span>Sensitive Content Filtering</span>
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { key: 'less', label: 'Less (Strict Filter)' },
                      { key: 'standard', label: 'Standard (Default)' },
                      { key: 'more', label: 'More' },
                    ].map((sOpt) => (
                      <button
                        key={sOpt.key}
                        onClick={() => {
                          setSensitiveContentLevel(sOpt.key);
                          showToast(`Sensitive content filter set to ${sOpt.label}!`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          sensitiveContentLevel === sOpt.key
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sOpt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Push Notifications
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <Bell className="size-5 text-indigo-600" />
                  <span>Notification Preferences</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Choose what notifications you receive for likes, comments, DM messages, and story updates.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {['Likes & Reactions', 'New Comments & Replies', 'Direct Messages & Voice Notes', 'New Story Poll Votes'].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800">{pref}</span>
                    <button onClick={() => showToast(`Updated ${pref} preference!`)} className="w-10 h-5 rounded-full bg-indigo-600 relative">
                      <span className="absolute top-0.5 right-0.5 size-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. MEDIA QUALITY & APP EXPERIENCES */}
          {activeSection === 'media_app' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                  App Customization
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <Sliders className="size-5 text-indigo-600" />
                  <span>Media Quality & Appearance</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Adjust upload quality, data saver settings, app language, and display theme.
                </p>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                {/* Data Saver Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <HardDrive className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900">Data Saver & High-Quality Uploads</span>
                      <span className="text-[11px] text-slate-400">Upload highest quality videos and media on Wi-Fi</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDataSaver(!dataSaver);
                      showToast(dataSaver ? 'Data Saver disabled!' : 'Data Saver enabled!');
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      dataSaver ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 size-4 rounded-full bg-white transition-transform ${dataSaver ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* App Language */}
                <div
                  onClick={() => setActiveModal('language')}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Languages className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900">App Language</span>
                      <span className="text-[11px] text-slate-400">Current: {selectedLanguage}</span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* 8. SUPERVISION */}
          {activeSection === 'supervision' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Teen & Family Safety
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <ShieldAlert className="size-5 text-emerald-600" />
                  <span>Supervision & Family Center</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Set daily time limits, manage break reminders, and link accounts for family supervision.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="size-6 text-emerald-600 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-slate-900">Set Daily Screen Time Limit</span>
                    <span className="text-[11px] text-slate-500">Get notified when you spend more than 45 minutes daily</span>
                  </div>
                </div>
                <button onClick={() => showToast('Daily screen limit set to 45 mins!')} className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  Set 45m Limit
                </button>
              </div>
            </div>
          )}

          {/* 9. HELP & SUPPORT */}
          {activeSection === 'help' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-6 animate-in fade-in">
              {/* Top Banner Header */}
              <div className="border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                    Customer Support & Legal Center
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                    <HelpCircle className="size-5 text-indigo-600" />
                    <span>Help, Support & Terms</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Report technical issues, browse FAQs, check app status, or view Terms of Service.
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
                {[
                  { id: 'overview', label: 'Overview & Hub', icon: LifeBuoy },
                  { id: 'report', label: 'Report a Problem', icon: AlertCircle },
                  { id: 'faq', label: 'Help Center & FAQs', icon: HelpCircle },
                  { id: 'terms', label: 'Terms & Privacy', icon: FileText },
                  { id: 'about', label: 'About Ryzo v2.4', icon: Info },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = helpSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setHelpSubTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100'
                      }`}
                    >
                      <IconComponent className="size-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SUB-TAB 1: OVERVIEW */}
              {helpSubTab === 'overview' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                  {/* Grid of 4 Main Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1: Report Problem */}
                    <div
                      onClick={() => setHelpSubTab('report')}
                      className="p-5 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/50 via-white to-rose-50/20 hover:border-rose-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <AlertCircle className="size-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          Quick Action
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
                          Report a Problem
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Submit bug reports, security concerns, or account access technical issues directly to our support team.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                        <span>Open Ticket Form</span>
                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 2: Help Center & FAQs */}
                    <div
                      onClick={() => setHelpSubTab('faq')}
                      className="p-5 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/20 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <HelpCircle className="size-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                          Knowledge Base
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Help Center & FAQs
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Browse searchable guides on creator mode, account security, reels, monetization, and troubleshooting.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                        <span>Explore FAQs</span>
                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 3: Terms & Privacy */}
                    <div
                      onClick={() => setHelpSubTab('terms')}
                      className="p-5 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="size-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          Legal & Safety
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Privacy Policy & Terms
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Read Terms of Service, User Content Licensing, Community Rules, and manage Data Collection Rights.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <span>Read Policies</span>
                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 4: About Ryzo */}
                    <div
                      onClick={() => setHelpSubTab('about')}
                      className="p-5 rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/50 via-white to-purple-50/20 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Info className="size-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                          App Info
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                          About Ryzo Social Hub
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Ryzo v2.4.0 (Build 2026.09). System health diagnostics, open source licenses, and version updates.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600">
                        <span>View System Details</span>
                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* System Infrastructure Status Banner */}
                  <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Server className="size-5 text-emerald-400" />
                        <span className="font-extrabold text-sm">Ryzo Cloud Infrastructure Status</span>
                      </div>
                      <button
                        onClick={handleRunDiagnostics}
                        disabled={diagnosticsRunning}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1.5 text-slate-200"
                      >
                        <RefreshCw className={`size-3.5 ${diagnosticsRunning ? 'animate-spin' : ''}`} />
                        <span>{diagnosticsRunning ? 'Checking...' : 'Run Diagnostics'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">API Gateway</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Operational (18ms)
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Realtime Messaging</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Operational (12ms)
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Media CDN</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Operational (24ms)
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Database Cluster</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Operational (5ms)
                        </span>
                      </div>
                    </div>

                    {diagnosticsResult && (
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center justify-between">
                        <span>Diagnostics result: {diagnosticsResult.status} • Latency: {diagnosticsResult.latency} • Storage: {diagnosticsResult.storage}</span>
                      </div>
                    )}
                  </div>

                  {/* Recent Submitted Tickets Summary */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="size-4 text-indigo-600" />
                        <span>Your Recent Support Tickets ({supportTickets.length})</span>
                      </h4>
                      <button
                        onClick={() => setHelpSubTab('report')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        + Create Ticket
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {supportTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900">{ticket.id}</span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                                {ticket.category}
                              </span>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                ticket.status === 'Resolved'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : ticket.status === 'In Review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-indigo-100 text-indigo-700'
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800">{ticket.subject}</p>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{ticket.description}</p>
                          {ticket.response && (
                            <div className="mt-1 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900">
                              <span className="font-bold">Support Reply: </span>
                              <span>{ticket.response}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: REPORT A PROBLEM */}
              {helpSubTab === 'report' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                  <form onSubmit={handleSubmitReport} className="flex flex-col gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-3">
                      <AlertCircle className="size-5 text-indigo-600 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-bold text-indigo-900">Need Technical Assistance or Reporting a Bug?</span>
                        <span className="text-indigo-700/80 text-[11px]">
                          Fill in the details below. Our customer engineering team will review and respond within 24 hours.
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category Selection */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-700">Problem Category</label>
                        <select
                          value={reportCategory}
                          onChange={(e) => setReportCategory(e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        >
                          <option value="Bug Report">Bug Report / App Crash</option>
                          <option value="Account Security">Account Access & Security</option>
                          <option value="Content Violation">Content Violation / Abuse</option>
                          <option value="Feature Request">Feature Request & Idea</option>
                          <option value="Billing & Verification">Billing & Verification Badge</option>
                          <option value="Other Issue">Other Technical Issue</option>
                        </select>
                      </div>

                      {/* Subject */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-700">Subject Summary</label>
                        <input
                          type="text"
                          placeholder="e.g., Audio cuts off when playing vertical reel..."
                          value={reportSubject}
                          onChange={(e) => setReportSubject(e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                          required
                        />
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-700">Detailed Description</label>
                      <textarea
                        rows="4"
                        placeholder="Please describe what happened, steps to reproduce the bug, or details of your request..."
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        className="p-3.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-xs"
                        required
                      />
                    </div>

                    {/* Attachment & System Info Toggles */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sysInfoCheck"
                          checked={reportIncludeSysInfo}
                          onChange={(e) => setReportIncludeSysInfo(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="sysInfoCheck" className="font-bold text-slate-700 text-xs cursor-pointer">
                          Include anonymous diagnostic info (Browser Chrome, Win11 OS, Build v2.4.0)
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                          <Paperclip className="size-3.5 text-slate-500" />
                          <span>{reportAttachmentName ? reportAttachmentName : 'Attach Screenshot'}</span>
                          <input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setReportAttachmentName(e.target.files[0].name);
                                showToast(`File attached: ${e.target.files[0].name}`);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {reportAttachmentName && (
                          <button
                            type="button"
                            onClick={() => setReportAttachmentName('')}
                            className="text-rose-500 font-bold text-[11px] hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="size-4" />
                      <span>Submit Support Ticket</span>
                    </button>
                  </form>

                  {/* My Tickets History */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Submitted Ticket History ({supportTickets.length})
                    </h4>
                    <div className="flex flex-col gap-3">
                      {supportTickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col gap-2 shadow-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-indigo-600 text-xs">{ticket.id}</span>
                              <span className="text-[11px] font-bold text-slate-500">• {ticket.date}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 text-xs">{ticket.subject}</span>
                          <p className="text-xs text-slate-600 leading-relaxed">{ticket.description}</p>
                          {ticket.response && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                              <span className="font-bold text-indigo-600">Customer Care Team: </span>
                              {ticket.response}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: HELP CENTER & FAQS */}
              {helpSubTab === 'faq' && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                  {/* Search Bar & Category Filters */}
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search FAQs, guides, monetization, audio, security..."
                        value={faqSearchQuery}
                        onChange={(e) => setFaqSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                      {faqSearchQuery && (
                        <button
                          onClick={() => setFaqSearchQuery('')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                      {[
                        { id: 'all', label: 'All FAQs' },
                        { id: 'account', label: 'Account & Pro' },
                        { id: 'privacy', label: 'Privacy & Safety' },
                        { id: 'reels', label: 'Reels & Audio' },
                        { id: 'monetization', label: 'Monetization' },
                        { id: 'troubleshooting', label: 'Troubleshooting' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedFaqCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                            selectedFaqCategory === cat.id
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accordion FAQ Items */}
                  <div className="flex flex-col gap-2.5 text-xs">
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq) => {
                        const isExpanded = expandedFaqId === faq.id;
                        return (
                          <div
                            key={faq.id}
                            className={`rounded-2xl border transition-all ${
                              isExpanded
                                ? 'border-indigo-200 bg-indigo-50/30 shadow-xs'
                                : 'border-slate-100 hover:border-slate-200 bg-white'
                            }`}
                          >
                            <button
                              onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                              className="w-full p-4 flex items-center justify-between text-left gap-3 font-bold text-slate-800"
                            >
                              <div className="flex items-center gap-2.5">
                                <HelpCircle className={`size-4 shrink-0 ${isExpanded ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <span>{faq.question}</span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="size-4 text-indigo-600 shrink-0" />
                              ) : (
                                <ChevronDown className="size-4 text-slate-400 shrink-0" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 text-slate-600 font-medium leading-relaxed flex flex-col gap-3 border-t border-indigo-100/60">
                                <p>{faq.answer}</p>
                                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                                  <span>Was this guide helpful?</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setFaqFeedback({ ...faqFeedback, [faq.id]: 'yes' });
                                        showToast('Thank you for your feedback!');
                                      }}
                                      className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 font-bold transition-all ${
                                        faqFeedback[faq.id] === 'yes'
                                          ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      <ThumbsUp className="size-3" /> Yes
                                    </button>
                                    <button
                                      onClick={() => {
                                        setFaqFeedback({ ...faqFeedback, [faq.id]: 'no' });
                                        showToast('Feedback submitted. We will improve this guide!');
                                      }}
                                      className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 font-bold transition-all ${
                                        faqFeedback[faq.id] === 'no'
                                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      <ThumbsDown className="size-3" /> No
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-400 font-medium flex flex-col items-center gap-2">
                        <Search className="size-8 text-slate-300" />
                        <span>No FAQ results matching "{faqSearchQuery}"</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: TERMS & PRIVACY */}
              {helpSubTab === 'terms' && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                  {/* Terms Nav Pills */}
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs overflow-x-auto no-scrollbar">
                    {[
                      { id: 'terms', label: 'Terms of Service' },
                      { id: 'privacy', label: 'Privacy Policy' },
                      { id: 'community', label: 'Community Guidelines' },
                      { id: 'cookies', label: 'Cookie Policy' },
                    ].map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setTermsSubTab(doc.id)}
                        className={`px-3.5 py-2 rounded-xl font-extrabold transition-all whitespace-nowrap ${
                          termsSubTab === doc.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {doc.label}
                      </button>
                    ))}
                  </div>

                  {/* Legal Document Display Area */}
                  <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 flex flex-col gap-4 max-h-96 overflow-y-auto leading-relaxed">
                    {termsSubTab === 'terms' && (
                      <>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-extrabold text-slate-900 text-sm">Ryzo Social Hub - Terms of Service</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">v2.4.0 • Updated Sept 2026</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900">1. Agreement to Terms</h4>
                        <p>By creating an account or using Ryzo Social Hub, you agree to comply with all applicable terms, copyright laws, and safety regulations.</p>

                        <h4 className="font-extrabold text-slate-900">2. User Content & Intellectual Property</h4>
                        <p>You retain full ownership rights to all original images, videos, audio clips, and text you upload to Ryzo. By posting, you grant Ryzo a non-exclusive, worldwide, royalty-free license to store, transmit, and display your media across our platform infrastructure.</p>

                        <h4 className="font-extrabold text-slate-900">3. Prohibited Conduct</h4>
                        <p>Users must not engage in harassment, hate speech, spamming, unauthorized automated data scraping, or posting harmful computer code. Violations will result in permanent account termination.</p>

                        <h4 className="font-extrabold text-slate-900">4. Account Termination & Liability</h4>
                        <p>Ryzo reserves the right to suspend or terminate accounts that violate community rules. Ryzo is provided "as is" without express warranties of uptime or uninterrupted data transmission.</p>
                      </>
                    )}

                    {termsSubTab === 'privacy' && (
                      <>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-extrabold text-slate-900 text-sm">Ryzo Privacy & Data Protection Policy</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">GDPR & CCPA Compliant</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900">1. Information We Collect</h4>
                        <p>We collect information you directly provide (email, phone, profile details, uploaded media) and technical telemetry (IP address, browser type, device identifier) to ensure account security and deliver media streams.</p>

                        <h4 className="font-extrabold text-slate-900">2. Data Usage & Analytics</h4>
                        <p>Your data is used to personalize your feed, serve creator analytics in Professional Mode, and protect the platform against fraud. We never sell your personal contact information to third-party advertisers.</p>

                        <h4 className="font-extrabold text-slate-900">3. Your Data Rights</h4>
                        <p>You have the right to request a full JSON export of your profile data or request complete account deletion. Go to Settings &rarr; Data Control & Export to download your backup archive.</p>
                      </>
                    )}

                    {termsSubTab === 'community' && (
                      <>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-extrabold text-slate-900 text-sm">Ryzo Community Guidelines</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Safety Standards</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900">1. Safety & Civility</h4>
                        <p>Treat all creators and users with respect. Discrimination, harassment, bullying, and hate speech are strictly banned on Ryzo.</p>

                        <h4 className="font-extrabold text-slate-900">2. Authenticity & Spam Prevention</h4>
                        <p>Do not create fake accounts, impersonate public figures, or use automated bots to artificially boost likes, followers, or reel plays.</p>
                      </>
                    )}

                    {termsSubTab === 'cookies' && (
                      <>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-extrabold text-slate-900 text-sm">Ryzo Cookie & Storage Policy</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Cookie Control</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900">1. Essential Cookies</h4>
                        <p>Required for user session authentication, security tokens, and preventing CSRF attacks.</p>

                        <h4 className="font-extrabold text-slate-900">2. Preference & Theme Cookies</h4>
                        <p>Stores your preferred dark mode theme, audio volume levels, and data saver settings in local storage.</p>
                      </>
                    )}
                  </div>

                  {/* Actions: Download & Accept */}
                  <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <FileCheck className="size-5 text-emerald-600 shrink-0" />
                      <span>Document Status: Acknowledged & Active</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadTermsDoc}
                        className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="size-3.5" />
                        <span>Download (.TXT)</span>
                      </button>

                      <button
                        onClick={() => {
                          setTermsAccepted(true);
                          showToast('Terms and Privacy policy acknowledged!');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold transition-all shadow-xs"
                      >
                        Accept Terms
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: ABOUT RYZO */}
              {helpSubTab === 'about' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                  {/* Branding Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-md p-3 border border-white/20 flex items-center justify-center shrink-0">
                        <Sparkles className="size-10 text-amber-400" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-extrabold">Ryzo Social Hub</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px]">
                            v2.4.0 Stable
                          </span>
                        </div>
                        <span className="text-xs text-slate-300 mt-1">
                          Build 2026.09.18 • Real-time Creator Network Engine
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckUpdate}
                      disabled={isCheckingUpdate}
                      className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold transition-all flex items-center gap-2 shrink-0"
                    >
                      <RefreshCw className={`size-4 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                      <span>{isCheckingUpdate ? 'Checking Update...' : 'Check for Updates'}</span>
                    </button>
                  </div>

                  {/* Highlights in Version 2.4 */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      What's New in Ryzo v2.4.0
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                        <CheckCircle2 className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900">Audio Library & Music Picker</span>
                          <span className="text-slate-500 text-[11px]">Search trending music tracks with waveform audio preview player.</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                        <CheckCircle2 className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900">Highlight Covers & Stories</span>
                          <span className="text-slate-500 text-[11px]">Create custom profile story highlights with icon cover picker.</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                        <CheckCircle2 className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900">Professional Creator Mode</span>
                          <span className="text-slate-500 text-[11px]">Instant toggle between Casual Personal mode and Pro Creator analytics.</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                        <CheckCircle2 className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900">Enhanced Privacy Controls</span>
                          <span className="text-slate-500 text-[11px]">Hidden keyword filter, 2FA security controls, and active sessions manager.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Open Source Licenses & Links */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-slate-700">Built with React 19, Vite, Tailwind CSS & Lucide Icons</span>
                    <div className="flex items-center gap-3 font-bold text-indigo-600">
                      <button onClick={() => showToast('Ryzo Core OSS Licenses: MIT License 2026')} className="hover:underline">
                        Open Source Licenses
                      </button>
                      <span>•</span>
                      <button onClick={() => showToast('Navigating to Official Ryzo Docs...')} className="hover:underline">
                        Developer Docs
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* ACCOUNTS CENTER SUB-MODALS */}
      {/* ========================================================================= */}

      {/* SUB-MODAL 1: Personal Details */}
      {activeModal === 'personal_details' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <User className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Personal Details & Contact Info</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSavePersonalDetails} className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-indigo-600" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-indigo-600" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-indigo-600" />
                    <span>Birthday</span>
                  </label>
                  <input
                    type="date"
                    value={birthdayInput}
                    onChange={(e) => setBirthdayInput(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="size-3.5 text-indigo-600" />
                    <span>Gender</span>
                  </label>
                  <select
                    value={genderInput}
                    onChange={(e) => setGenderInput(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Custom">Custom</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-200 transition-all"
                >
                  Save Personal Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: Password & Security */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Key className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Password & Security Controls</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSecurity} className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2.5">
                  <Shield className="size-5 text-purple-600" />
                  <div className="flex flex-col">
                    <span className="font-extrabold text-slate-900">Two-Factor Authentication (2FA)</span>
                    <span className="text-[10px] text-slate-500">Require an SMS / Auth code on new device login</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    is2FAEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${is2FAEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password..."
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters..."
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password..."
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-200 transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL 3: Connected Devices */}
      {activeModal === 'devices' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Smartphone className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Active Login Sessions ({devicesList.length})</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <p className="text-slate-500 font-medium">
                Here are the devices currently logged into your Ryzo account.
              </p>

              <div className="flex flex-col gap-2.5">
                {devicesList.map((dev) => (
                  <div key={dev.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Smartphone className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          {dev.name}
                          {dev.current && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">This Device</span>}
                        </span>
                        <span className="text-[11px] text-slate-400">{dev.location} • {dev.active}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {devicesList.length > 1 && (
                <button
                  type="button"
                  onClick={handleLogoutOtherDevices}
                  className="w-full py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-extrabold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <LogOut className="size-4" />
                  <span>Log Out From All Other Devices</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 4: Data Export */}
      {activeModal === 'data_download' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <HardDrive className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Data Control & Export</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex flex-col gap-3">
                <div className="flex items-center gap-2 font-extrabold text-indigo-900">
                  <Download className="size-5 text-indigo-600" />
                  <span>Download Your Profile Data</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Export a complete JSON backup file of your profile details, published posts, active stories, followers, and user settings.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadAccountData}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  <span>Download Account Backup JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 5: Hidden Words & Offensive Comments */}
      {activeModal === 'hidden_words' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Filter className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Hidden Words & Comment Filter</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-slate-900">Hide Offensive Comments</span>
                <button
                  onClick={() => setAutoHideOffensiveComments(!autoHideOffensiveComments)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${autoHideOffensiveComments ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${autoHideOffensiveComments ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Custom Keyword Blocklist</label>
                <textarea
                  rows="3"
                  value={customKeywordBlocklist}
                  onChange={(e) => setCustomKeywordBlocklist(e.target.value)}
                  className="p-3 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Enter comma-separated words..."
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  showToast('Custom keyword blocklist saved!');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold shadow-md hover:bg-indigo-700"
              >
                Save Keyword Blocklist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 6: App Language */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Languages className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Select App Language</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-1 text-xs max-h-80 overflow-y-auto">
              {['English (US)', 'Español (Spanish)', 'Français (French)', 'Hindi (हिंदी)', '日本語 (Japanese)', 'Deutsch (German)'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setActiveModal(null);
                    showToast(`App language set to ${lang}!`);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl font-bold transition-all ${
                    selectedLanguage === lang ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{lang}</span>
                  {selectedLanguage === lang && <Check className="size-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 7: Report a Problem Popup */}
      {activeModal === 'report_problem' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Report a Problem</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={(e) => { handleSubmitReport(e); setActiveModal(null); }} className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Category</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium"
                >
                  <option value="Bug Report">Bug Report / App Crash</option>
                  <option value="Account Security">Account Security</option>
                  <option value="Content Violation">Content Violation</option>
                  <option value="Billing & Verification">Billing & Verification</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Subject</label>
                <input
                  type="text"
                  placeholder="Summary of issue..."
                  value={reportSubject}
                  onChange={(e) => setReportSubject(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows="3"
                  placeholder="Details of the problem..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="p-3.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 shadow-md transition-all"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL 8: Help Center FAQs Popup */}
      {activeModal === 'help_center' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <HelpCircle className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Help Center & FAQs</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-xs overflow-y-auto">
              <input
                type="text"
                placeholder="Search help topics..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <div className="flex flex-col gap-2">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col gap-1.5">
                    <span className="font-extrabold text-slate-900">{faq.question}</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 9: Privacy & Terms Popup */}
      {activeModal === 'privacy_terms' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">Privacy Policy & Terms of Service</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-xs overflow-y-auto leading-relaxed">
              <h4 className="font-extrabold text-slate-900">Terms of Service</h4>
              <p className="text-slate-600">By using Ryzo Social Hub, you agree to our content licensing, community standards, and security terms.</p>
              <h4 className="font-extrabold text-slate-900 mt-2">Privacy & Data Rights</h4>
              <p className="text-slate-600">We prioritize user data privacy. You may request your data export or account deletion at any time under Settings.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button onClick={handleDownloadTermsDoc} className="px-3.5 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-100">
                  Download Terms (.TXT)
                </button>
                <button onClick={() => { setTermsAccepted(true); setActiveModal(null); showToast('Terms accepted!'); }} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700">
                  Acknowledge & Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 10: About Ryzo Popup */}
      {activeModal === 'about_ryzo' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div onClick={() => setActiveModal(null)} className="absolute inset-0 z-0" />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Info className="size-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">About Ryzo Social Hub</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-xs text-center items-center">
              <div className="size-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="size-8 text-amber-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Ryzo Social Hub v2.4.0</h4>
                <p className="text-slate-500 mt-1">Build 2026.09.18 • All Systems Operational</p>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                Empowering modern creators with high-performance real-time social tools, audio integration, and advanced privacy management.
              </p>
              <button onClick={handleCheckUpdate} className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 shadow-md">
                Check for Updates
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
