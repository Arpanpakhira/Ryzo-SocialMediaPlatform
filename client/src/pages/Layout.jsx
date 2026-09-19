import React from 'react';
import Sidebar from '../components/Sidebar';
import { MobileHeader, MobileBottomNav } from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import StoryViewer from '../components/StoryViewer';
import StoryCreatorModal from '../components/StoryCreatorModal';
import CreatePostModal from '../components/CreatePostModal';
import EditProfileModal from '../components/EditProfileModal';
import NotificationDrawer from '../components/NotificationDrawer';
import CommentModal from '../components/CommentModal';
import CreateHighlightModal from '../components/CreateHighlightModal';
import HighlightViewerModal from '../components/HighlightViewerModal';
import { useApp } from '../context/AppContext';

const Layout = () => {
  const location = useLocation();
  const isReels = location.pathname.startsWith('/reels');

  const { 
    darkMode,
    activeStoryIndex, 
    activeCommentPost,
    setActiveCommentPost,
    activeHighlight,
    isCreateStoryOpen, 
    isCreatePostOpen, 
    isCreateHighlightOpen,
    isEditProfileOpen 
  } = useApp();

  return (
    <div className={`w-full min-h-screen flex flex-col md:flex-row relative transition-colors duration-300 ${
      darkMode 
        ? 'ryzo-bg-dark text-slate-100 selection:bg-amber-500 selection:text-slate-950' 
        : 'ryzo-bg-olive text-slate-100 selection:bg-amber-400 selection:text-slate-950'
    }`}>
      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Desktop Navigation Spacer so content isn't covered by fixed sidebar */}
      <div className="hidden md:block w-[72px] shrink-0 pointer-events-none" />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Page Body */}
      <main className={`flex-1 min-w-0 ${isReels ? 'pb-14 md:pb-0 overflow-hidden' : 'pb-16 md:pb-6 overflow-y-auto'}`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Overlays & Modals */}
      {activeStoryIndex !== null && <StoryViewer />}
      {activeCommentPost && (
        <CommentModal post={activeCommentPost} onClose={() => setActiveCommentPost(null)} />
      )}
      {activeHighlight && <HighlightViewerModal />}
      {isCreateHighlightOpen && <CreateHighlightModal />}
      {isCreateStoryOpen && <StoryCreatorModal />}
      {isCreatePostOpen && <CreatePostModal />}
      {isEditProfileOpen && <EditProfileModal />}
      <NotificationDrawer />
    </div>
  );
};




export default Layout;
