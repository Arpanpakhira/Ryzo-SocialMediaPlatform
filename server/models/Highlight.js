import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // User ID
    title: { type: String, required: true },
    cover_image: { type: String, default: '' },
    stories: [
      {
        _id: { type: String },
        content: { type: String, default: '' },
        media_url: { type: String, default: '' },
        media_type: { type: String, default: 'text' },
        background_color: { type: String, default: '#4f46e5' },
        audio_title: { type: String, default: null },
        audio_track: { type: String, default: null },
        createdAt: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Highlight = mongoose.model('Highlight', highlightSchema);
