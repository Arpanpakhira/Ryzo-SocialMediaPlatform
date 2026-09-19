import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Star, BellOff } from 'lucide-react';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const StoriesBar = () => {
  const { stories, currentUser, setActiveStoryIndex, setIsCreateStoryOpen, darkMode, mutedStoryUserIds = [] } = useApp();

  // 1. Filter stories to only include those created within the last 24 hours
  const activeStories = stories.filter((story) => {
    if (!story.createdAt) return true;
    const createdTime = new Date(story.createdAt).getTime();
    return Date.now() - createdTime < TWENTY_FOUR_HOURS_MS;
  });

  // 2. Check if current logged-in user has an active story
  const userStoryIndex = activeStories.findIndex(
    (story) =>
      story.user?._id === currentUser?._id ||
      story.user?.username === currentUser?.username
  );
  const hasUserStory = userStoryIndex !== -1;
  const userFirstStory = hasUserStory ? activeStories[userStoryIndex] : null;

  // Deduplicate other users' active stories so each creator displays exactly ONE avatar ring
  const otherStories = [];
  activeStories.forEach((story) => {
    const isSelf =
      (story.user?._id && currentUser?._id && story.user._id === currentUser._id) ||
      (story.user?.username && currentUser?.username && story.user.username === currentUser.username);
    if (!isSelf && story.user) {
      const alreadyAdded = otherStories.some(
        (s) =>
          (s.user?._id && story.user?._id && s.user._id === story.user._id) ||
          (s.user?.username && story.user?.username && s.user.username === story.user.username) ||
          (s.user?.full_name && story.user?.full_name && s.user.full_name === story.user.full_name)
      );
      if (!alreadyAdded) {
        otherStories.push(story);
      }
    }
  });

  // Sort other stories so that muted creators appear at the very end of the story tray
  const sortedOtherStories = [...otherStories].sort((a, b) => {
    const aMuted = mutedStoryUserIds.includes(String(a.user?._id)) || mutedStoryUserIds.includes(String(a.user?.username));
    const bMuted = mutedStoryUserIds.includes(String(b.user?._id)) || mutedStoryUserIds.includes(String(b.user?.username));
    if (aMuted === bMuted) return 0;
    return aMuted ? 1 : -1;
  });

  return (
    <div className={`w-full rounded-none border-x-0 border-t-0 border-b md:rounded-3xl md:border mb-1 md:mb-6 px-3 py-2.5 md:p-4 overflow-x-auto no-scrollbar transition-colors duration-300 ${
      darkMode
        ? 'bg-slate-900/90 md:ryzo-glass-panel border-slate-800/80 shadow-md md:shadow-2xl'
        : 'bg-[#152316]/95 md:ryzo-glass-olive-card border-amber-500/20 shadow-md md:shadow-xl'
    }`}>
      <div className="flex items-center gap-3 sm:gap-4 min-w-max">
        {/* Your Story Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <div
            onClick={() => {
              if (hasUserStory) {
                setActiveStoryIndex(userStoryIndex);
              } else {
                setIsCreateStoryOpen(true);
              }
            }}
            className={`relative size-15 sm:size-16 rounded-full p-[2.5px] transition-transform group-hover:scale-105 active:scale-95 ${
              hasUserStory
                ? userFirstStory?.is_close_friends
                  ? 'bg-gradient-to-tr from-emerald-400 via-teal-400 to-green-500 shadow-md'
                  : 'bg-gradient-to-tr from-yellow-200 via-amber-400 to-amber-600 shadow-md shadow-amber-500/20'
                : darkMode
                  ? 'border-2 border-dashed border-amber-500/50 group-hover:border-amber-400 bg-amber-950/20'
                  : 'border-2 border-dashed border-amber-400/80 group-hover:border-amber-600 bg-amber-50/50'
            }`}
          >
            <div className={`size-full rounded-full p-0.5 ${darkMode ? 'bg-slate-900' : 'bg-slate-900'}`}>
              <img
                src={currentUser?.profile_picture}
                alt="Your Story"
                className="size-full rounded-full object-cover"
              />
            </div>
            {/* Add story (+) icon badge */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsCreateStoryOpen(true);
              }}
              title="Add new story"
              className={`absolute bottom-0 right-0 size-4.5 sm:size-5 rounded-full border-2 text-slate-950 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all font-bold ${
                darkMode ? 'bg-amber-500 border-slate-900 hover:bg-amber-400' : 'bg-amber-500 border-slate-900 hover:bg-amber-400'
              }`}
            >
              <Plus className="size-3 stroke-[3]" />
            </div>
          </div>
          <span className={`text-[11px] sm:text-xs font-medium max-w-[64px] sm:max-w-[70px] truncate text-center transition-colors ${
            darkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-300 group-hover:text-amber-400'
          }`}>
            {hasUserStory ? 'Your Story' : 'Your Story'}
          </span>
        </div>

        {/* Other Users' 24-Hour Active Stories List */}
        {sortedOtherStories.map((story) => {
          const originalIndex = activeStories.findIndex((s) => s._id === story._id);
          const isText = story.media_type === 'text';
          const isCF = story.is_close_friends;
          const isMutedCreator =
            mutedStoryUserIds.includes(String(story.user?._id)) ||
            mutedStoryUserIds.includes(String(story.user?.username));

          return (
            <div
              key={story._id}
              onClick={() => setActiveStoryIndex(originalIndex)}
              className={`flex flex-col items-center gap-1.5 cursor-pointer group transition-opacity ${
                isMutedCreator ? 'opacity-60 hover:opacity-100' : ''
              }`}
              title={isMutedCreator ? `Muted story from @${story.user?.username || 'user'}` : undefined}
            >
              <div
                className={`relative size-15 sm:size-16 rounded-full p-[2.5px] group-hover:scale-105 active:scale-95 transition-transform shadow-md ${
                  isMutedCreator
                    ? 'border-2 border-slate-700/80 bg-slate-800/80 shadow-none'
                    : isCF
                    ? 'bg-gradient-to-tr from-emerald-400 via-teal-400 to-green-500'
                    : 'bg-gradient-to-tr from-yellow-200 via-amber-400 to-amber-600 shadow-amber-500/20'
                }`}
              >
                <div className={`size-full rounded-full p-0.5 ${darkMode ? 'bg-slate-900' : 'bg-slate-900'}`}>
                  {isText ? (
                    <div
                      style={{ backgroundColor: story.background_color || '#d97706' }}
                      className="size-full rounded-full flex items-center justify-center text-white font-bold text-[10px] p-1 text-center truncate"
                    >
                      Aa
                    </div>
                  ) : (
                    <img
                      src={story.media_url || story.user?.profile_picture}
                      alt={story.user?.full_name}
                      className={`size-full rounded-full object-cover ${isMutedCreator ? 'grayscale-[35%]' : ''}`}
                    />
                  )}
                </div>

                {isCF && !isMutedCreator && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-4 sm:size-4.5 rounded-full bg-emerald-500 border border-slate-900 text-white flex items-center justify-center shadow-xs">
                    <Star className="size-2.5 fill-white" />
                  </div>
                )}

                {isMutedCreator && (
                  <div
                    title="Muted"
                    className="absolute -bottom-0.5 -right-0.5 size-4 sm:size-4.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center shadow-xs"
                  >
                    <BellOff className="size-2.5 text-amber-400" />
                  </div>
                )}
              </div>
              <span className={`text-[11px] sm:text-xs font-medium max-w-[64px] sm:max-w-[72px] truncate text-center transition-colors ${
                darkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-300 group-hover:text-amber-400'
              }`}>
                {story.user?.username || story.user?.full_name?.split(' ')[0] || 'User'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoriesBar;
