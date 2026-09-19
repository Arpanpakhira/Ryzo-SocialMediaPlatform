import React, { useState } from 'react';
import { X, Sparkles, Check, Image as ImageIcon, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CreateHighlightModal = () => {
  const {
    isCreateHighlightOpen,
    setIsCreateHighlightOpen,
    createHighlight,
    stories = [],
    currentUser,
  } = useApp();

  const [title, setTitle] = useState('');
  const [selectedStoryIds, setSelectedStoryIds] = useState([]);
  const [coverImage, setCoverImage] = useState('');

  if (!isCreateHighlightOpen) return null;

  // Filter user's stories to allow selecting for highlights
  const userStories = stories.filter(
    (s) =>
      s.user?._id === currentUser._id || s.user?.username === currentUser.username
  );

  const toggleSelectStory = (story) => {
    const id = story._id;
    if (selectedStoryIds.includes(id)) {
      setSelectedStoryIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedStoryIds((prev) => [...prev, id]);
      if (!coverImage && story.media_url) {
        setCoverImage(story.media_url);
      }
    }
  };

  const handleSaveHighlight = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenStories = userStories.filter((s) =>
      selectedStoryIds.includes(s._id)
    );

    // Fallback story if none selected
    const highlightStories = chosenStories.length > 0 ? chosenStories : [
      {
        _id: 'hl_s_' + Date.now(),
        user: currentUser,
        content: title.trim(),
        media_url: coverImage || 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
        media_type: coverImage ? 'image' : 'text',
        background_color: '#4f46e5',
        createdAt: new Date().toISOString(),
      }
    ];

    createHighlight({
      title: title.trim(),
      cover_image: coverImage || highlightStories[0]?.media_url || 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
      stories: highlightStories,
    });

    setIsCreateHighlightOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-rose-200">
              <Sparkles className="size-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-800">
              New Highlight
            </h2>
          </div>
          <button
            onClick={() => setIsCreateHighlightOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSaveHighlight} className="p-5 flex flex-col gap-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Highlight Name
            </label>
            <input
              type="text"
              placeholder="e.g. Travel ✈️, Code & Tech 💻, Gym 🏋️‍♂️"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          {/* Select Stories Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Stories for Highlight
            </label>

            {userStories.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  No active stories found. A cover highlight card will be generated automatically!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {userStories.map((story) => {
                  const isSelected = selectedStoryIds.includes(story._id);

                  return (
                    <div
                      key={story._id}
                      onClick={() => toggleSelectStory(story)}
                      className={`relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/40 scale-95'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                      style={{
                        backgroundColor: story.background_color || '#4f46e5',
                      }}
                    >
                      {story.media_url ? (
                        <img
                          src={story.media_url}
                          alt="Story"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full p-2 flex items-center justify-center text-center text-[10px] text-white font-bold">
                          {story.content}
                        </div>
                      )}

                      {/* Selection Checkmark Badge */}
                      <div
                        className={`absolute top-1.5 right-1.5 size-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-black/40 text-white group-hover:bg-black/60'
                        }`}
                      >
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateHighlightOpen(false)}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 transition-all"
            >
              Done & Add Highlight
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHighlightModal;
