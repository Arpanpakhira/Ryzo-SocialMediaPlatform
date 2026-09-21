import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Reels from './pages/Reels'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Layout from './pages/Layout'
import { useAuth } from '@clerk/clerk-react'

const App = () => {
  const { isLoaded, isSignedIn } = useAuth()

  // Wait for Clerk to determine authentication state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      {/* Login page */}
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected application */}
      <Route
        path="/"
        element={isSignedIn ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Feed />} />
        <Route path="reels" element={<Reels />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:userId" element={<ChatBox />} />
        <Route path="connections" element={<Connections />} />
        <Route path="discover" element={<Discover />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:profileId" element={<Profile />} />
        <Route path="create-post" element={<CreatePost />} />
      </Route>

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to={isSignedIn ? "/" : "/login"} replace />}
      />
    </Routes>
  )
}

export default App
