import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  user: { type: String, required: true }, // User ID or ObjectId
  emoji: { type: String, required: true },
});

const sharedPostSchema = new mongoose.Schema({
  post_id: { type: String },
  content: { type: String, default: '' },
  image_url: { type: String, default: '' },
  author_name: { type: String, default: '' },
  author_avatar: { type: String, default: '' },
});

const sharedStorySchema = new mongoose.Schema({
  story_id: { type: String },
  content: { type: String, default: '' },
  media_url: { type: String, default: '' },
  media_type: { type: String, default: 'text' },
  author_name: { type: String, default: '' },
  author_avatar: { type: String, default: '' },
});

const messageSchema = new mongoose.Schema(
  {
    from_user_id: { type: String, required: true },
    to_user_id: { type: String, required: true },
    text: { type: String, default: '' },
    message_type: {
      type: String,
      enum: ['text', 'image', 'audio', 'post_share', 'story_reply'],
      default: 'text',
    },
    media_url: { type: String, default: '' },
    audio_duration: { type: Number, default: 0 },
    shared_post: sharedPostSchema,
    shared_story: sharedStorySchema,
    reactions: [reactionSchema],
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);

