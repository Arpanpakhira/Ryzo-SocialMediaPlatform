import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const audioTrackSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  artist: { type: String, default: '' },
  artwork: { type: String, default: '' },
  audio_url: { type: String, default: '' },
});

const postSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    content: { type: String, default: '' },
    image_urls: [{ type: String }],
    post_type: { type: String, enum: ['text', 'image', 'text_with_image', 'video', 'reel'], default: 'text' },
    is_reel: { type: Boolean, default: false },
    video_url: { type: String, default: '' },
    aspect_ratio: { type: String, default: '4:5' }, // '9:16' for reels, '4:5' / '1:1' for feed
    audio_title: { type: String, default: 'Original Audio' },
    audio_track: audioTrackSchema,
    views_count: { type: Number, default: 0 },
    likes_count: [{ type: String }],
    comments: [commentSchema],
    hashtags: [{ type: String, index: true }],
    mentions: [{ type: String }],
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

export const Post = mongoose.model('Post', postSchema);
