import mongoose from 'mongoose';
import { Message } from '../models/Message.js';

export const getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { from_user_id: user1, to_user_id: user2 },
        { from_user_id: user2, to_user_id: user1 },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { from_user_id, to_user_id } = req.body;
    await Message.updateMany(
      { from_user_id, to_user_id, seen: false },
      { $set: { seen: true } }
    );
    res.json({ success: true, message: 'Messages marked as seen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { messageId, userId, emoji } = req.body;
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(200).json({ success: true, messageId, userId, emoji });
    }
    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: 'Message not found' });

    const existingIndex = msg.reactions.findIndex((r) => r.user === userId && r.emoji === emoji);
    if (existingIndex > -1) {
      msg.reactions.splice(existingIndex, 1);
    } else {
      msg.reactions = msg.reactions.filter((r) => r.user !== userId);
      msg.reactions.push({ user: userId, emoji });
    }

    await msg.save();
    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
