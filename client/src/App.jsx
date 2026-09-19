import React from 'react'
import { Route, Routes } from 'react-router-dom'
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
import { useUser } from '@clerk/clerk-react'
import Layout from './pages/Layout'
import { useApp } from './context/AppContext'

const App = () => {
  let clerkUser = null;
  try {
    const clerk = useUser();
    clerkUser = clerk?.user;
  } catch (e) {
    clerkUser = null;
  }

  const { isDemoAuthenticated } = useApp()
  const isAuthenticated = Boolean(clerkUser) || isDemoAuthenticated

  return (
    <>
      <Routes>
        <Route path='/' element={!isAuthenticated ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path='reels' element={<Reels />} />
          <Route path='messages' element={<Messages />} />
          <Route path='messages/:userId' element={<ChatBox />} />
          <Route path='connections' element={<Connections />} />
          <Route path='discover' element={<Discover />} />
          <Route path='analytics' element={<Analytics />} />
          <Route path='settings' element={<Settings />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:profileId' element={<Profile />} />
          <Route path='create-post' element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
