import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    user: { type: mongoose.Schema.Types.Mixed, required: true },
    content: { type: String, default: '' },
    media_url: { type: String, default: '' },
    media_type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
    background_color: { type: String, default: '#4f46e5' },
    audio_track: { type: mongoose.Schema.Types.Mixed, default: null },
    audio_title: { type: String, default: null },
    is_close_friends: { type: Boolean, default: false },
    sticker: { type: mongoose.Schema.Types.Mixed, default: null },
    tagged_users: { type: Array, default: [] },
    hotspots: { type: Array, default: [] },
    font_style: { type: String, default: 'modern' },
    text_design: { type: String, default: 'plain' },
    text_color: { type: String, default: '#ffffff' },
    text_align: { type: String, default: 'center' },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  { timestamps: true, _id: false }
);

storySchema.index({ expiresAt: 1 });

export const Story = mongoose.model('Story', storySchema);
