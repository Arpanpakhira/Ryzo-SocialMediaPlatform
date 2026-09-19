import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import musicRoutes from './routes/musicRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import highlightRoutes from './routes/highlightRoutes.js';
import { Message } from './models/Message.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP Server & Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/highlights', highlightRoutes);





app.get('/', (req, res) => {
  res.send('Ryzo API & Real-time Server is running...');
});

// Socket.io Presence & Real-time Messaging
const userSocketMap = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('⚡ Socket connected:', socket.id);

  socket.on('register_user', (userId) => {
    if (userId) {
      userSocketMap.set(userId, socket.id);
      socket.userId = userId;
      io.emit('get_online_users', Array.from(userSocketMap.keys()));
      console.log(`🟢 User ${userId} online with socket ${socket.id}`);
    }
  });

  socket.on('send_message', async (data) => {
    const {
      from_user_id,
      to_user_id,
      text,
      media_url,
      message_type,
      audio_duration,
      shared_post,
      shared_story,
    } = data;
    try {
      let savedMsg = {
        _id: 'msg_' + Date.now(),
        from_user_id,
        to_user_id,
        text: text || '',
        media_url: media_url || '',
        message_type: message_type || 'text',
        audio_duration: audio_duration || 0,
        shared_post: shared_post || null,
        shared_story: shared_story || null,
        reactions: [],
        seen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const newMsg = new Message({
          from_user_id,
          to_user_id,
          text: text || '',
          media_url: media_url || '',
          message_type: message_type || 'text',
          audio_duration: audio_duration || 0,
          shared_post: shared_post || null,
          shared_story: shared_story || null,
          reactions: [],
          seen: false,
        });
        savedMsg = await newMsg.save();
      } catch (dbErr) {
        console.warn('DB Save fallback in socket, returning in-memory message object');
      }

      const recipientSocketId = userSocketMap.get(to_user_id);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', savedMsg);
      }
      socket.emit('message_sent', savedMsg);
    } catch (err) {
      console.error('Error in send_message socket handler:', err);
    }
  });

  socket.on('react_message', async ({ messageId, userId, emoji, to_user_id }) => {
    try {
      let updatedReactions = [];
      try {
        const msg = await Message.findById(messageId);
        if (msg) {
          const existingIndex = msg.reactions.findIndex(
            (r) => r.user === userId && r.emoji === emoji
          );
          if (existingIndex > -1) {
            msg.reactions.splice(existingIndex, 1);
          } else {
            msg.reactions = msg.reactions.filter((r) => r.user !== userId);
            msg.reactions.push({ user: userId, emoji });
          }
          await msg.save();
          updatedReactions = msg.reactions;
        }
      } catch (dbErr) {
        console.warn('DB fallback for react_message');
      }

      const reactionPayload = { messageId, userId, emoji, reactions: updatedReactions };

      const recipientSocketId = userSocketMap.get(to_user_id);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('message_reacted', reactionPayload);
      }
      socket.emit('message_reacted', reactionPayload);
    } catch (err) {
      console.error('Error in react_message handler:', err);
    }
  });


  socket.on('typing', ({ from_user_id, to_user_id }) => {
    const recipientSocketId = userSocketMap.get(to_user_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing', { from_user_id });
    }
  });

  socket.on('stop_typing', ({ from_user_id, to_user_id }) => {
    const recipientSocketId = userSocketMap.get(to_user_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('stop_typing', { from_user_id });
    }
  });

  socket.on('mark_seen', async ({ from_user_id, to_user_id }) => {
    try {
      await Message.updateMany(
        { from_user_id, to_user_id, seen: false },
        { $set: { seen: true } }
      );
      const senderSocketId = userSocketMap.get(from_user_id);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messages_seen', { to_user_id });
      }
    } catch (err) {
      console.error('Error in mark_seen socket handler:', err);
    }
  });

  // WebRTC Video & Audio Call Signaling
  socket.on('call_user', ({ to_user_id, offer, call_type, caller_info }) => {
    const recipientSocketId = userSocketMap.get(to_user_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('incoming_call', {
        from_user_id: socket.userId,
        offer,
        call_type: call_type || 'video',
        caller_info,
      });
      console.log(`📞 Call initiated from ${socket.userId} to ${to_user_id} (${call_type})`);
    } else {
      socket.emit('call_user_offline', { to_user_id });
    }
  });

  socket.on('answer_call', ({ to_user_id, answer }) => {
    const recipientSocketId = userSocketMap.get(to_user_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('call_answered', {
        from_user_id: socket.userId,
        answer,
      });
      console.log(`✅ Call answered by ${socket.userId} for ${to_user_id}`);
    }
  });

  socket.on('ice_candidate', ({ to_user_id, candidate }) => {
    const recipientSocketId = userSocketMap.get(to_user_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('ice_candidate_received', {
        from_user_id: socket.userId,
        candidate,
      });
    }
  });

  socket.on('reject_call', ({ to_user_id }) => {
    const recipientSocketId = userSocketMap.get(to_user_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('call_rejected', {
        from_user_id: socket.userId,
      });
    }
  });

  socket.on('end_call', ({ to_user_id }) => {
    const recipientSocketId = userSocketMap.get(to_user_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('call_ended', {
        from_user_id: socket.userId,
      });
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      userSocketMap.delete(socket.userId);
      io.emit('get_online_users', Array.from(userSocketMap.keys()));
      console.log(`🔴 User ${socket.userId} disconnected`);
    }
  });
});

// Connect DB & Start Server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Ryzo Server & Socket.io listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB, starting server fallback...');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (fallback mode)`);
    });
  });

