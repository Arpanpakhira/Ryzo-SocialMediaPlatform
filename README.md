
# 🚀 Ryzo — Social Media Platform

Ryzo is a modern, feature-rich **full-stack social media platform** built with React, Node.js, Express.js, MongoDB, Socket.IO, and Cloudinary.

The platform combines the core features of a modern social networking application with real-time communication, stories, reels, media sharing, collections, notifications, audio discovery, and WebRTC-powered audio/video calling.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Frontend Features](#-frontend-features)
- [Backend Features](#-backend-features)
- [Authentication](#-authentication)
- [Real-Time Communication](#-real-time-communication)
- [Messaging](#-messaging)
- [Audio & Video Calling](#-audio--video-calling)
- [Posts](#-posts)
- [Stories](#-stories)
- [Reels](#-reels)
- [Highlights](#-highlights)
- [Connections](#-connections)
- [Notifications](#-notifications)
- [Media Uploads](#️-media-uploads)
- [Music Search](#-music-search)
- [Local Data Persistence](#-local-data-persistence)
- [Database](#️-database)
- [API Endpoints](#-api-endpoints)
- [Installation](#️-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Production Deployment](#-production-deployment)
- [Security](#-security)
- [Future Improvements](#-future-improvements)
- [Learning Outcomes](#-learning-outcomes)
- [Author](#-author)
- [License](#-license)

---

# 📖 Overview

Ryzo is a social media platform designed around a modern, responsive user experience.

Users can:

- Create posts
- Share images and videos
- Create stories
- Create reels
- Like and comment on posts
- Search posts
- Discover content
- Follow and connect with other users
- Save posts
- Organize saved content into collections
- Send real-time messages
- Share posts and stories through chat
- React to messages
- See online users
- See typing indicators
- Make audio/video calls
- Create story highlights
- Search music
- Receive notifications
- Customize their profile and application settings

The application also implements client-side persistence using **localStorage and IndexedDB**, allowing media-heavy content such as videos and stories to be cached locally.

---

# ✨ Features

## 👤 User & Authentication

- Clerk-based authentication
- Protected application routes
- Login page
- User profiles
- Profile editing
- Professional account mode
- Private account option
- Followers and following
- Connection management

---

# 📰 Feed

The main feed provides a social timeline where users can:

- View posts
- Search through posts
- Like posts
- Comment on posts
- Share posts
- Save posts
- Create new posts
- Upload photos
- Upload videos
- Add content/activity information

The feed also includes:

- Stories bar
- Right sidebar
- Quick post creation interface
- Responsive layouts

---

# 📸 Posts

Users can create posts containing:

- Text
- Images
- Videos
- Hashtags
- Mentions

Post functionality includes:

- Create post
- Like/unlike
- Comment
- Share
- Save
- Add to collections
- Search
- Explore/discover posts

The backend also extracts hashtags and mentions from post content.

---

# ⏱️ Stories

Ryzo supports temporary stories with a **24-hour lifecycle**.

Users can:

- Create stories
- Upload story media
- View stories
- Delete stories
- Add interactive content
- Create story polls
- Answer story questions
- Maintain story state locally
- View stories from other users

Stories automatically filter out content older than 24 hours.

---

# 🎬 Reels

Ryzo provides a dedicated short-video reels experience.

Features include:

- Vertical video playback
- Auto-play
- Play/pause
- Mute/unmute
- Audio tracks
- Audio synchronization
- Like reels
- Comment on reels
- Share reels
- Save reels
- Save audio
- Auto-scroll
- Swipe gestures
- Reel navigation
- Video lifecycle management

Only the active reel plays its video/audio to prevent multiple reels from playing simultaneously.

---

# ⭐ Highlights

Users can create profile highlights from their stories.

Features include:

- Create highlight
- View highlights
- Delete highlights
- Persistent highlight data
- Highlight viewer modal

Highlights are stored locally using browser storage.

---

# 💬 Real-Time Messaging

Ryzo uses **Socket.IO** to provide real-time communication.

Users can:

- Send messages
- Receive messages instantly
- See online users
- See typing indicators
- Mark messages as seen
- React to messages
- Share posts
- Share stories
- Send media
- Send audio-related messages

---

# 📞 Audio & Video Calling

The application includes real-time audio/video call signaling using **WebRTC** with Socket.IO.

Supported functionality includes:

- Initiate call
- Receive incoming call
- Answer call
- Reject call
- End call
- Exchange WebRTC ICE candidates
- Audio calls
- Video calls
- Caller information
- Online/offline call detection

### Calling Workflow

```text
User A
   │
   │ call_user
   ▼
Socket.IO Server
   │
   │ incoming_call
   ▼
User B
   │
   │ answer_call
   ▼
Socket.IO Server
   │
   │ call_answered
   ▼
User A
   │
   ▼
WebRTC Connection
   │
   ├── Audio
   └── Video
````

---

# 🔔 Notifications

Ryzo includes a notification system for user activity.

Supported operations include:

* Get notifications
* Create notifications
* Mark individual notification as read
* Mark all notifications as read

Notification functionality is available through the backend notification API.

---

# 🤝 Connections

Users can:

* Follow other users
* Unfollow users
* View followers
* View following
* Manage connections
* View pending connections
* Discover other users

---

# 🔖 Saved Posts & Collections

Users can save posts and reels.

Saved content can be organized into collections.

Example collections include:

```text
Favorites
Code & Tech
```

Collection functionality includes:

* Create collection
* View user collections
* Add posts to collections
* Save posts
* Remove saved posts

---

# 🎵 Music Search

Ryzo includes music search functionality.

The backend communicates with an external music search service and formats returned tracks into a normalized structure.

Music information can include:

* Track title
* Artist
* Artwork
* Preview audio
* Genre
* Duration

Users can also save audio tracks for later use with reels.

---

# 🖼️ Media Uploads

Media uploads are handled by the backend using:

* Multer
* Cloudinary

Supported media can include:

* Images
* Videos
* Audio/media files

### Upload Workflow

```text
User selects file
       ↓
React Frontend
       ↓
Multipart/FormData
       ↓
Express Backend
       ↓
Multer
       ↓
Cloudinary
       ↓
Cloud Media URL
       ↓
Application / MongoDB
```

---

# 💾 Local Data Persistence

Ryzo uses a dual-layer client-side persistence strategy.

## localStorage

Used for lightweight application state such as:

* User profile
* Theme preference
* Account type
* Posts cache
* Stories cache
* Highlights
* Saved audio
* Close friends
* Deleted story IDs

## IndexedDB

Used for larger media-heavy content.

This is particularly useful for:

* High-resolution images
* Uploaded reels
* Video data
* Story media

The application uses IndexedDB to avoid putting large media payloads directly into localStorage.

---

# 🌙 Theme & Application Settings

Ryzo supports application customization including:

* Light mode
* Dark mode
* Data saver option
* Professional account mode
* Private account settings
* Close friends list
* Profile editing
* Application settings

Theme preference is persisted locally.

---

# 🛠️ Tech Stack

## Frontend

* React 19
* Vite
* Tailwind CSS
* React Router
* Clerk
* Socket.IO Client
* Lucide React

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* Multer
* Cloudinary
* CORS
* dotenv

---

## Authentication

* Clerk

---

## Real-Time Communication

* Socket.IO
* WebRTC

---

## Storage

### Database

* MongoDB Atlas

### Media

* Cloudinary

### Client Storage

* localStorage
* IndexedDB

---

# 🏗️ Project Architecture

```text
                         ┌─────────────────────────┐
                         │          Ryzo           │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
          ┌───────────────────┐               ┌───────────────────┐
          │   React Frontend  │               │  Express Backend  │
          │   Vite + Tailwind │               │   Node.js + API   │
          └─────────┬─────────┘               └─────────┬─────────┘
                    │                                   │
                    │                                   │
          ┌─────────┴─────────┐             ┌───────────┼───────────┐
          │                   │             │           │           │
          ▼                   ▼             ▼           ▼           ▼
     Clerk Auth         Socket.IO       MongoDB     Cloudinary   Socket.IO
          │                   │             │           │           │
          │                   │             │           │           │
          ▼                   ▼             ▼           ▼           ▼
      Sessions           Real-Time       Users       Images       Calls
                        Messaging        Posts       Videos
                        Presence         Stories
                        Calling          Messages
```

---

# 📁 Project Structure

```text
Ryzo-SocialMediaPlatform/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   ├── assets.js
│   │   │   ├── bgImage.png
│   │   │   ├── favicon.svg
│   │   │   ├── group_users.png
│   │   │   ├── logo.svg
│   │   │   ├── sample_cover.jpg
│   │   │   ├── sample_profile.jpg
│   │   │   └── sponsored_img.png
│   │   │
│   │   ├── components/
│   │   │   ├── AudioPageModal.jsx
│   │   │   ├── CallModal.jsx
│   │   │   ├── CommentModal.jsx
│   │   │   ├── CreateHighlightModal.jsx
│   │   │   ├── CreatePostModal.jsx
│   │   │   ├── CreateReelModal.jsx
│   │   │   ├── EditProfileModal.jsx
│   │   │   ├── HighlightViewerModal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── MusicPickerModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationDrawer.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── RightSidebar.jsx
│   │   │   ├── SharePostModal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StoriesBar.jsx
│   │   │   ├── StoryCreatorModal.jsx
│   │   │   └── StoryViewer.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AppContext.jsx
│   │   │   └── SocketContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   ├── Connections.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Discover.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Reels.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   └── utils/
│   │       ├── indexedDB.js
│   │       ├── timeAgo.js
│   │       └── typographyStyles.js
│   │
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── highlightController.js
│   │   ├── mediaController.js
│   │   ├── messageController.js
│   │   ├── musicController.js
│   │   ├── notificationController.js
│   │   ├── postController.js
│   │   ├── storyController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Collection.js
│   │   ├── Highlight.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Post.js
│   │   ├── Story.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── highlightRoutes.js
│   │   ├── mediaRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── musicRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── postRoutes.js
│   │   ├── storyRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🔌 API Endpoints

The backend runs on port `5000` by default.

Base URL:

```text
http://localhost:5000
```

---

## 👤 User APIs

### Get User Profile

```http
GET /api/users/:id
```

### Update Profile

```http
PUT /api/users/:id
```

### Follow / Unfollow User

```http
POST /api/users/:id/follow
```

### Get Collections

```http
GET /api/users/collections/:userId
```

### Create Collection

```http
POST /api/users/collections
```

### Add Post to Collection

```http
POST /api/users/collections/:collectionId/add
```

---

# 📝 Post APIs

### Get Posts

```http
GET /api/posts
```

### Explore Posts

```http
GET /api/posts/explore
```

### Search Posts

```http
GET /api/posts/search
```

### Create Post

```http
POST /api/posts
```

### Like / Unlike Post

```http
POST /api/posts/:id/like
```

### Add Comment

```http
POST /api/posts/:id/comment
```

---

# ⏱️ Story APIs

### Get Active Stories

```http
GET /api/stories
```

### Create Story

```http
POST /api/stories
```

### Delete Story

```http
DELETE /api/stories/:id
```

---

# 💬 Message APIs

### Get Conversation

```http
GET /api/messages/:user1/:user2
```

### Send Message

```http
POST /api/messages
```

### Mark Messages as Seen

```http
PUT /api/messages/mark-seen
```

### React to Message

```http
PUT /api/messages/react
```

---

# 🖼️ Media API

### Upload Media

```http
POST /api/media/upload
```

The endpoint accepts a multipart file upload.

---

# 🎵 Music API

### Search Music

```http
GET /api/music/search
```

Example:

```text
/api/music/search?query=rock
```

---

# 🔔 Notification APIs

### Get User Notifications

```http
GET /api/notifications/:userId
```

### Mark All Notifications as Read

```http
PUT /api/notifications/read-all
```

### Mark Single Notification as Read

```http
PUT /api/notifications/:notificationId/read
```

### Create Notification

```http
POST /api/notifications
```

---

# ⭐ Highlight APIs

### Get User Highlights

```http
GET /api/highlights/:userId
```

### Create Highlight

```http
POST /api/highlights
```

### Delete Highlight

```http
DELETE /api/highlights/:highlightId
```

---

# ⚡ Socket.IO Events

Ryzo uses Socket.IO for real-time functionality.

## Connection

```text
connection
```

---

## User Presence

### Register User

```text
register_user
```

### Online Users

```text
get_online_users
```

### Disconnect

```text
disconnect
```

---

# 💬 Real-Time Messaging Events

### Send Message

```text
send_message
```

### Receive Message

```text
receive_message
```

### Message Sent

```text
message_sent
```

### Typing

```text
typing
```

### Stop Typing

```text
stop_typing
```

### Mark Seen

```text
mark_seen
```

### Messages Seen

```text
messages_seen
```

### React to Message

```text
react_message
```

### Message Reacted

```text
message_reacted
```

---

# 📞 WebRTC Calling Events

### Start Call

```text
call_user
```

### Incoming Call

```text
incoming_call
```

### Answer Call

```text
answer_call
```

### Call Answered

```text
call_answered
```

### ICE Candidate

```text
ice_candidate
```

### ICE Candidate Received

```text
ice_candidate_received
```

### Reject Call

```text
reject_call
```

### Call Rejected

```text
call_rejected
```

### End Call

```text
end_call
```

### Call Ended

```text
call_ended
```

### Offline User

```text
call_user_offline
```

---

# 🔐 Authentication

Ryzo uses **Clerk** for frontend authentication.

The application uses Clerk's authentication state to protect application routes.

### Authentication Flow

```text
User
 │
 ▼
Clerk Login
 │
 ▼
Authentication State
 │
 ├── Not Signed In
 │        │
 │        ▼
 │      /login
 │
 └── Signed In
          │
          ▼
       Main App
          │
          ├── Feed
          ├── Reels
          ├── Messages
          ├── Connections
          ├── Discover
          ├── Analytics
          ├── Profile
          └── Settings
```

---

# 🗄️ Database

Ryzo uses **MongoDB** with Mongoose.

### Main Models

```text
User
Post
Story
Message
Notification
Highlight
Collection
```

MongoDB stores application data such as:

* User profiles
* Posts
* Stories
* Messages
* Notifications
* Highlights
* Collections
* Social relationships

---

# ☁️ Cloudinary

Cloudinary is used for cloud-based media storage.

Configuration:

```env
CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Media upload flow:

```text
Frontend
   ↓
Express API
   ↓
Multer
   ↓
Cloudinary
   ↓
Media URL
```

---

# 🔑 Environment Variables

## Frontend

Create:

```text
client/.env
```

Add:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SERVER_URL=http://localhost:5000
```

`VITE_SERVER_URL` is used by Socket.IO and should point to the deployed backend in production.

Example:

```env
VITE_SERVER_URL=https://your-ryzo-backend.onrender.com
```

---

## Backend

Create:

```text
server/.env
```

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Ryzo-SocialMediaPlatform.git
```

Navigate into the project:

```bash
cd Ryzo-SocialMediaPlatform
```

---

# 💻 Frontend Installation

Navigate to the client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Configure:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SERVER_URL=http://localhost:5000
```

Start Vite:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🖥️ Backend Installation

Open another terminal.

Navigate to:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Configure:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

---

# ▶️ Running the Full Application

## Terminal 1 — Backend

```bash
cd server
npm install
npm run dev
```

---

## Terminal 2 — Frontend

```bash
cd client
npm install
npm run dev
```

---

## Application URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

Backend health check:

```text
http://localhost:5000/
```

Expected response:

```text
Ryzo API & Real-time Server is running...
```

---

# 🌐 Production Deployment

Ryzo consists of two independently deployable applications:

```text
Frontend
   │
   ▼
React + Vite
   │
   ▼
Static Hosting

Backend
   │
   ▼
Node.js + Express + Socket.IO
   │
   ▼
Node-compatible Hosting
```

---

## Backend Deployment

Deploy the `server` directory to a Node.js-compatible hosting provider.

Set:

```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri

CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The backend must support **WebSocket / Socket.IO connections** for real-time messaging and calling.

---

## Frontend Deployment

Build the frontend:

```bash
cd client
npm run build
```

Configure:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
VITE_SERVER_URL=https://your-production-backend.com
```

Then deploy the generated application.

---

# 🔄 Production Architecture

```text
                  ┌────────────────────────┐
                  │    React + Vite App    │
                  │       Frontend         │
                  └───────────┬────────────┘
                              │
                    HTTPS / REST / WebSocket
                              │
                              ▼
                  ┌────────────────────────┐
                  │    Node + Express      │
                  │     Socket.IO Server   │
                  └───────────┬────────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       MongoDB Atlas      Cloudinary       Socket.IO
             │                │                │
             │                │                ▼
             │                │          Real-Time Users
             │                │
             ▼                ▼
          Database          Media
```

---

# 📱 Responsive Design

The application is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

Responsive layouts are implemented throughout:

* Feed
* Reels
* Messages
* Profile
* Connections
* Discover
* Settings
* Navigation
* Modals

Mobile-specific navigation and layouts are also implemented in the application.

---

# 💾 Client-Side Storage Architecture

Ryzo uses two browser storage mechanisms.

## localStorage

Used for:

```text
User profile
Theme
Account type
Posts cache
Stories cache
Highlights
Saved audio
Close friends
Deleted stories
```

## IndexedDB

Used for larger media:

```text
Video files
Reel media
High-resolution images
Story media
```

### Storage Architecture

```text
                    Application State
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
            localStorage         IndexedDB
                 │                   │
          Lightweight Data       Heavy Media
                 │                   │
                 └─────────┬─────────┘
                           │
                           ▼
                     React State
```

---

# 🛡️ Security

Never commit sensitive credentials to GitHub.

Your `.gitignore` should contain:

```gitignore
node_modules/
.env
.env.*
dist/
```

Sensitive information includes:

```text
Clerk credentials
MongoDB connection strings
Cloudinary API keys
Cloudinary secrets
Production server URLs when private
```

Never expose private Cloudinary credentials in frontend code.

Only the Clerk **publishable key** belongs in the frontend environment.

---

# 🚀 Future Improvements

Potential improvements include:

* Advanced recommendation system
* Better content moderation
* Direct user search
* Hashtag pages
* Trending content
* Advanced notification preferences
* Push notifications
* More advanced analytics
* Message search
* Group chats
* Group video calls
* Voice notes
* Story reactions
* Story mentions
* Advanced privacy controls
* Post scheduling
* Content reporting
* Admin moderation dashboard
* Automated testing
* CI/CD pipeline
* Progressive Web App support

---

# 🎓 Learning Outcomes

This project demonstrates practical experience with:

* Full-stack web development
* React architecture
* Vite
* Tailwind CSS
* React Router
* Clerk authentication
* REST APIs
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* Real-time communication
* WebRTC signaling
* Cloudinary
* Multer
* Browser storage
* IndexedDB
* localStorage
* Responsive UI development
* Social media application architecture
* Media handling
* File uploads
* Real-time messaging
* Audio/video communication

---

# 💡 Key Technical Highlights

## Full-Stack Architecture

```text
React
  +
Node.js
  +
Express.js
  +
MongoDB
```

---

## Authentication

```text
React
  ↓
Clerk
  ↓
Authentication State
  ↓
Protected Routes
```

---

## Real-Time Messaging

```text
User A
  ↓
Socket.IO
  ↓
Express / Socket Server
  ↓
Socket.IO
  ↓
User B
```

---

## Audio/Video Calling

```text
User A
  ↓
WebRTC Offer
  ↓
Socket.IO
  ↓
User B
  ↓
WebRTC Answer
  ↓
Peer-to-Peer Connection
```

---

## Media Upload

```text
React
  ↓
Multipart FormData
  ↓
Multer
  ↓
Cloudinary
  ↓
Media URL
```

---

# 🏆 Project Highlights

Ryzo combines several real-world application concepts into one full-stack social networking platform:

* 🔐 Clerk authentication
* 📰 Social feed
* 📸 Posts
* ⏱️ 24-hour stories
* 🎬 Reels
* ⭐ Highlights
* 💬 Real-time messaging
* 🟢 Online presence
* ✍️ Typing indicators
* ❤️ Message reactions
* 📞 Audio/video calling
* 🔔 Notifications
* 🤝 Connections
* 🔖 Saved posts
* 📁 Collections
* 🎵 Music discovery
* ☁️ Cloudinary media storage
* 💾 IndexedDB media persistence
* 📱 Responsive interface

---

# 🧪 Development Commands

## Frontend

Install:

```bash
npm install
```

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

---

## Backend

Install:

```bash
npm install
```

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

# 📊 Main Application Routes

The frontend currently includes:

```text
/login

/
/reels
/messages
/messages/:userId
/connections
/discover
/analytics
/settings
/profile
/profile/:profileId
/create-post
```

---

# 🧩 Main Components

Important frontend components include:

```text
Navbar
Sidebar
RightSidebar
StoriesBar
StoryCreatorModal
StoryViewer
PostCard
CreatePostModal
CreateReelModal
CommentModal
SharePostModal
NotificationDrawer
CallModal
AudioPageModal
MusicPickerModal
CreateHighlightModal
HighlightViewerModal
EditProfileModal
```

---

# 📦 Main Backend Modules

```text
Users
Posts
Stories
Messages
Media
Music
Notifications
Highlights
Collections
```

---

# 👨‍💻 Author

## Arpan Pakhira

**B.Tech Computer Science & Engineering**

### Technical Interests

* Full-Stack Development
* React.js
* JavaScript
* Node.js
* Express.js
* MongoDB
* REST APIs
* Socket.IO
* WebRTC
* AI-powered applications
* Modern UI/UX

---

# 📬 Contact

For collaboration, project discussions, or development opportunities, feel free to connect with me through GitHub or LinkedIn.

---

# ⭐ Support

If you find Ryzo useful or interesting, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is intended for educational, portfolio, and demonstration purposes.

If you plan to distribute or modify the project publicly, add an appropriate open-source license.

---

# 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/Ryzo-SocialMediaPlatform.git

# Enter project
cd Ryzo-SocialMediaPlatform

# Install frontend
cd client
npm install

# Start frontend
npm run dev
```

Open another terminal:

```bash
# Enter backend
cd server

# Install backend dependencies
npm install

# Start backend
npm run dev
```

Open:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:5000
```

---

# 🎉 Ryzo

**A modern full-stack social media platform featuring real-time messaging, stories, reels, media sharing, notifications, collections, music discovery, and WebRTC-powered audio/video communication.**

```
```
