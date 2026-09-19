import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true }, // User ID receiving the notification
    sender: { type: String, required: true }, // User ID triggering the action
    type: {
      type: String,
      enum: ['like', 'comment', 'mention', 'follow', 'story_reaction'],
      required: true,
    },
    post: { type: String, default: null }, // Post ID if applicable
    story: { type: String, default: null }, // Story ID if applicable
    text: { type: String, default: '' }, // Detail text (e.g. comment text or story reaction emoji)
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
