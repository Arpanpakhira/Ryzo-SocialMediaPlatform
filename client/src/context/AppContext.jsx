import React, { createContext, useContext, useState, useEffect } from 'react';
import { SocketProvider } from './SocketContext';
import {
  dummyUserData,
  dummyStoriesData,
  dummyPostsData,
  dummyRecentMessagesData,
  dummyMessagesData,
  dummyConnectionsData,
  dummyFollowersData,
  dummyFollowingData,
  dummyPendingConnectionsData,
  dummyNotificationsData,
  dummyHighlightsData,
} from '../assets/assets';
import {
  getAllPostsFromDB,
  saveAllPostsToDB,
  saveSinglePostToDB,
  deletePostFromDB,
  getAllStoriesFromDB,
  saveAllStoriesToDB,
  saveSingleStoryToDB,
  deleteStoryFromDB,
} from '../utils/indexedDB';



const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...dummyUserData, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Error reading user profile from localStorage:', e);
    }
    return dummyUserData;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ryzo_user_profile', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Error syncing user profile to localStorage:', e);
    }
  }, [currentUser]);

  const [isDemoAuthenticated, setIsDemoAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_demo_auth');
      if (saved !== null) {
        return saved === 'true';
      }
    } catch (e) {}
    return true; // Default to true so profile links & direct URL routes work seamlessly
  });

  useEffect(() => {
    try {
      localStorage.setItem('ryzo_demo_auth', String(isDemoAuthenticated));
    } catch (e) {}
  }, [isDemoAuthenticated]);

  const [accountType, setAccountType] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_account_type');
      if (saved) return saved;
    } catch (e) {}
    return 'professional'; // Default to professional mode
  });

  const setAccountTypeMode = (mode) => {
    setAccountType(mode);
    try {
      localStorage.setItem('ryzo_account_type', mode);
    } catch (e) {}
  };

  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_app_theme');
      if (saved) return saved === 'dark';
    } catch (e) {}
    return false; // Default will be white mode as requested
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ryzo_app_theme', next ? 'dark' : 'white');
      } catch (e) {}
      return next;
    });
  };

  const [dataSaver, setDataSaver] = useState(false);

  // Posts & Reels state with Dual-Layer Persistence (localStorage + IndexedDB)
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_app_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = [...parsed];
          dummyPostsData.forEach((dummy) => {
            if (!combined.some((p) => p._id === dummy._id)) {
              combined.push(dummy);
            }
          });
          return combined;
        }
      }
    } catch (e) {
      console.warn('Error reading posts from localStorage:', e);
    }
    return dummyPostsData;
  });

  // Hydrate full posts & reels from IndexedDB on startup (where large reel video files/Base64 are safely stored)
  useEffect(() => {
    let isMounted = true;
    const hydratePosts = async () => {
      try {
        const dbPosts = await getAllPostsFromDB();
        if (isMounted && Array.isArray(dbPosts) && dbPosts.length > 0) {
          setPosts((prevPosts) => {
            const map = new Map();
            // Start with current in-memory / localStorage posts
            prevPosts.forEach((p) => {
              if (p && p._id) map.set(p._id, p);
            });
            // Merge in IndexedDB posts (these hold high-fidelity video streams and uploaded reels)
            dbPosts.forEach((p) => {
              if (p && p._id) map.set(p._id, p);
            });
            // Ensure dummy baseline posts exist
            dummyPostsData.forEach((dummy) => {
              if (!map.has(dummy._id)) {
                map.set(dummy._id, dummy);
              }
            });
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('Failed hydrating posts from IndexedDB:', err);
      }
    };

    hydratePosts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize posts to IndexedDB and safe localStorage cache
  useEffect(() => {
    if (!posts || posts.length === 0) return;

    // 1. Always save all posts and reels (with full Base64/video payloads) to IndexedDB
    saveAllPostsToDB(posts);

    // 2. Safely cache to localStorage with quota-exceeded safeguard
    try {
      const serialized = JSON.stringify(posts);
      if (serialized.length < 2 * 1024 * 1024) {
        localStorage.setItem('ryzo_app_posts', serialized);
      } else {
        // Strip heavy data: image and video strings in the localStorage copy so quota is never exceeded
        const lightweight = posts.map((p) => {
          let updated = { ...p };
          if (p.video_url && p.video_url.startsWith('data:') && p.video_url.length > 50000) {
            updated.video_url = '';
            updated._storedInDB = true;
          }
          if (Array.isArray(p.image_urls)) {
            const hasHeavyImg = p.image_urls.some((img) => img && img.startsWith('data:') && img.length > 50000);
            if (hasHeavyImg) {
              updated.image_urls = p.image_urls.map((img) => (img && img.startsWith('data:') && img.length > 50000 ? '' : img));
              updated._storedInDB = true;
            }
          }
          return updated;
        });
        const lightSerialized = JSON.stringify(lightweight);
        if (lightSerialized.length < 2 * 1024 * 1024) {
          localStorage.setItem('ryzo_app_posts', lightSerialized);
        }
      }
    } catch (quotaErr) {
      // Safely silent since IndexedDB already holds all posts and media
    }
  }, [posts]);

  // Deleted Stories tracker to prevent resurrecting deleted dummy/persisted stories upon refresh
  const [deletedStoryIds, setDeletedStoryIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_deleted_story_ids');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ryzo_deleted_story_ids', JSON.stringify(deletedStoryIds));
    } catch (e) {}
  }, [deletedStoryIds]);

  // 1. Stories state with Dual-Layer Persistence (localStorage quick cache + IndexedDB rich media)
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_app_stories');
      const savedDeleted = localStorage.getItem('ryzo_deleted_story_ids');
      const deletedIds = savedDeleted ? JSON.parse(savedDeleted) : [];

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
          // Filter active 24h stories that are not deleted
          const active24h = parsed.filter((story) => {
            if (!story || !story._id) return false;
            if (deletedIds.includes(story._id)) return false;
            if (!story.createdAt) return true;
            return Date.now() - new Date(story.createdAt).getTime() < TWENTY_FOUR_HOURS;
          });
          // Preserve dummy baseline network stories if not deleted
          const combined = [...active24h];
          dummyStoriesData.forEach((dummy) => {
            if (!deletedIds.includes(dummy._id) && !combined.some((s) => s._id === dummy._id)) {
              combined.push(dummy);
            }
          });
          return combined;
        }
      }
    } catch (err) {
      console.error('Error loading stories from localStorage:', err);
    }
    return dummyStoriesData;
  });

  // Hydrate full stories (including high-resolution photos and video Data URLs) from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    const hydrateStories = async () => {
      try {
        const dbStories = await getAllStoriesFromDB();
        if (isMounted && Array.isArray(dbStories) && dbStories.length > 0) {
          const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
          const validDbStories = dbStories.filter((s) => {
            if (!s || !s._id) return false;
            if (deletedStoryIds.includes(s._id)) return false;
            if (!s.createdAt) return true;
            return Date.now() - new Date(s.createdAt).getTime() < TWENTY_FOUR_HOURS;
          });

          if (validDbStories.length > 0) {
            setStories((prevStories) => {
              const map = new Map();
              // Start with current in-memory / localStorage stories
              prevStories.forEach((s) => {
                if (s && s._id && !deletedStoryIds.includes(s._id)) {
                  map.set(s._id, s);
                }
              });
              // Merge in IndexedDB stories (holds full high-resolution media payloads)
              validDbStories.forEach((s) => {
                map.set(s._id, s);
              });
              // Ensure baseline dummy stories exist if not deleted
              dummyStoriesData.forEach((dummy) => {
                if (!deletedStoryIds.includes(dummy._id) && !map.has(dummy._id)) {
                  map.set(dummy._id, dummy);
                }
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.warn('Failed hydrating stories from IndexedDB:', err);
      }
    };

    hydrateStories();
    return () => {
      isMounted = false;
    };
  }, [deletedStoryIds]);

  // Dual-Sync: Fetch active stories from MongoDB Atlas and merge into state and IndexedDB
  useEffect(() => {
    let isMounted = true;
    const syncWithAtlas = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stories');
        if (!res.ok) return;
        const cloudStories = await res.json();
        if (isMounted && Array.isArray(cloudStories) && cloudStories.length > 0) {
          const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
          const validCloudStories = cloudStories.filter((s) => {
            if (!s || !s._id) return false;
            if (deletedStoryIds.includes(s._id)) return false;
            if (!s.createdAt) return true;
            return Date.now() - new Date(s.createdAt).getTime() < TWENTY_FOUR_HOURS;
          });

          if (validCloudStories.length > 0) {
            setStories((prevStories) => {
              const map = new Map();
              // Keep current local/indexedDB stories
              prevStories.forEach((s) => {
                if (s && s._id && !deletedStoryIds.includes(s._id)) {
                  map.set(s._id, s);
                }
              });
              // Merge in fresh cloud stories from MongoDB Atlas
              validCloudStories.forEach((cloudStory) => {
                if (!map.has(cloudStory._id)) {
                  map.set(cloudStory._id, cloudStory);
                  // Silently cache new cloud story in IndexedDB for offline access
                  saveSingleStoryToDB(cloudStory);
                } else {
                  // Keep local media but update metadata
                  const local = map.get(cloudStory._id);
                  const merged = { ...cloudStory, ...local };
                  map.set(cloudStory._id, merged);
                }
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        // Quiet fallback to IndexedDB when server/cloud is offline
      }
    };

    syncWithAtlas();
    return () => {
      isMounted = false;
    };
  }, [deletedStoryIds]);

  // Synchronize stories to IndexedDB (full media) and safe localStorage cache
  useEffect(() => {
    if (!stories || stories.length === 0) return;

    // 1. Always save all stories to IndexedDB (safe from localStorage 5MB quota limit)
    saveAllStoriesToDB(stories);

    // 2. Safely cache to localStorage with quota safeguard
    try {
      const serialized = JSON.stringify(stories);
      if (serialized.length < 1.5 * 1024 * 1024) {
        localStorage.setItem('ryzo_app_stories', serialized);
      } else {
        // Heavy payload: strip large base64 strings in localStorage copy so quota is never exceeded
        const lightweight = stories.map((s) => {
          if (s.media_url && s.media_url.startsWith('data:') && s.media_url.length > 50000) {
            return { ...s, media_url: '', _storedInDB: true };
          }
          return s;
        });
        localStorage.setItem('ryzo_app_stories', JSON.stringify(lightweight));
      }
    } catch (quotaErr) {
      console.warn('LocalStorage quota guarded for stories; IndexedDB holds full stories.', quotaErr);
    }
  }, [stories]);

  const [messages, setMessages] = useState(dummyMessagesData);
  const [recentChats, setRecentChats] = useState(dummyRecentMessagesData);
  const [connections, setConnections] = useState(dummyConnectionsData);
  const [followers, setFollowers] = useState(dummyFollowersData);
  const [following, setFollowing] = useState(dummyFollowingData);
  const [pendingConnections, setPendingConnections] = useState(dummyPendingConnectionsData);
  const [savedPostIds, setSavedPostIds] = useState(['post_1', 'reel_1']);
  const [collections, setCollections] = useState([
    {
      _id: 'col_1',
      name: 'Favorites',
      cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200',
      posts: ['post_1', 'reel_1'],
    },
    {
      _id: 'col_2',
      name: 'Code & Tech',
      cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200',
      posts: ['post_2'],
    },
  ]);
  
  // Highlights state with localStorage persistence
  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_app_highlights');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading highlights from localStorage:', e);
    }
    return dummyHighlightsData;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ryzo_app_highlights', JSON.stringify(highlights));
    } catch (e) {
      console.error('Error saving highlights to localStorage:', e);
    }
  }, [highlights]);

  // Saved Audios state with localStorage persistence
  const [savedAudios, setSavedAudios] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_app_saved_audios');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved audios:', e);
    }
    return [
      {
        id: 'track_chill_sunset',
        title: 'Chill Sunset Beats',
        artist: 'Original Audio',
        artwork: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        audio_url: '',
        reels_count: 1420,
        is_trending: true,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ryzo_app_saved_audios', JSON.stringify(savedAudios));
    } catch (e) {
      console.error('Error saving audios to localStorage:', e);
    }
  }, [savedAudios]);

  const toggleSaveAudio = (audioTrack) => {
    if (!audioTrack) return;
    const trackId = audioTrack.id || audioTrack._id || audioTrack.title;
    setSavedAudios((prev) => {
      const exists = prev.some((a) => (a.id || a._id || a.title) === trackId);
      if (exists) {
        return prev.filter((a) => (a.id || a._id || a.title) !== trackId);
      } else {
        const normalized = {
          id: trackId,
          title: audioTrack.title || audioTrack.audio_title || 'Original Audio',
          artist: audioTrack.artist || audioTrack.user?.full_name || 'Original Audio',
          artwork: audioTrack.artwork || audioTrack.user?.profile_picture || '',
          audio_url: audioTrack.audio_url || '',
          reels_count: audioTrack.reels_count || 1,
          is_trending: Boolean(audioTrack.is_trending),
        };
        return [normalized, ...prev];
      }
    });
  };

  const isAudioSaved = (audioTrack) => {
    if (!audioTrack) return false;
    const trackId = typeof audioTrack === 'string' ? audioTrack : (audioTrack.id || audioTrack._id || audioTrack.title);
    return savedAudios.some((a) => (a.id || a._id || a.title) === trackId);
  };

  // Close Friends list with localStorage persistence
  const [closeFriendsList, setCloseFriendsList] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_app_close_friends');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return ['user_2', 'user_3'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ryzo_app_close_friends', JSON.stringify(closeFriendsList));
    } catch (e) {}
  }, [closeFriendsList]);

  const toggleCloseFriend = (userId) => {
    setCloseFriendsList((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const voteStoryPoll = (storyId, optionIndex) => {
    setStories((prev) =>
      prev.map((story) => {
        if (story._id === storyId && story.sticker) {
          const currentVotes = story.sticker.votes || {};
          const updatedVotes = { ...currentVotes, [currentUser._id]: optionIndex };
          const updatedStory = {
            ...story,
            sticker: {
              ...story.sticker,
              votes: updatedVotes,
            },
          };
          saveSingleStoryToDB(updatedStory);
          return updatedStory;
        }
        return story;
      })
    );
  };

  const answerStoryQA = (storyId, answerText) => {
    if (!answerText.trim()) return;
    setStories((prev) =>
      prev.map((story) => {
        if (story._id === storyId && story.sticker) {
          const currentResponses = story.sticker.responses || [];
          const newResp = {
            _id: 'qa_' + Date.now(),
            user: currentUser,
            text: answerText.trim(),
            createdAt: new Date().toISOString(),
          };
          const updatedStory = {
            ...story,
            sticker: {
              ...story.sticker,
              responses: [newResp, ...currentResponses],
            },
          };
          saveSingleStoryToDB(updatedStory);
          return updatedStory;
        }
        return story;
      })
    );
  };

  // UI Modal & Overlay States
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isCreateHighlightOpen, setIsCreateHighlightOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotificationsData);
  const [searchQuery, setSearchQuery] = useState('');

  const createHighlight = (newHighlightData) => {
    const newHl = {
      _id: 'hl_' + Date.now(),
      user_id: currentUser._id,
      title: newHighlightData.title || 'Highlight',
      cover_image: newHighlightData.cover_image || newHighlightData.stories?.[0]?.media_url || 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
      stories: newHighlightData.stories || [],
    };
    setHighlights((prev) => [newHl, ...prev]);
  };

  const deleteHighlight = (highlightId) => {
    setHighlights((prev) => prev.filter((h) => h._id !== highlightId));
  };



  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };


  const extractTags = (text = '') => {
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;
    const hashtags = [];
    const mentions = [];
    let match;

    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(match[1].toLowerCase());
    }
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1].toLowerCase());
    }

    return { hashtags, mentions };
  };

  // 1. Post Actions
  const addPost = (newPostData) => {
    const { hashtags, mentions } = extractTags(newPostData.content || '');

    const newPost = {
      _id: 'post_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      user: currentUser,
      content: newPostData.content || '',
      image_urls: newPostData.image_urls || [],
      video_url: newPostData.video_url || '',
      post_type: newPostData.post_type || (newPostData.video_url ? 'reel' : newPostData.image_urls?.length ? 'image' : 'text'),
      is_reel: newPostData.is_reel || Boolean(newPostData.video_url),
      aspect_ratio: newPostData.aspect_ratio || (newPostData.video_url ? '9:16' : '1:1'),
      audio_title: newPostData.audio_title || 'Original Audio',
      audio_track: newPostData.audio_track || null,
      location: newPostData.location || '',
      hashtags: newPostData.hashtags || hashtags,
      mentions: newPostData.mentions || mentions,
      tagged_users: newPostData.tagged_users || [],
      font_style: newPostData.font_style || 'modern',
      text_design: newPostData.text_design || 'plain',
      text_color: newPostData.text_color || null,
      bg_gradient: newPostData.bg_gradient || null,
      likes_count: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    saveSinglePostToDB(newPost); // Immediately persist directly to IndexedDB
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    deletePostFromDB(postId);
  };

  const toggleVerificationStatus = () => {
    setCurrentUser((prev) => ({
      ...prev,
      is_verified: !prev.is_verified,
    }));
  };

  const createCollection = (name, initialPostId = null) => {
    if (!name.trim()) return;
    const newCol = {
      _id: 'col_' + Date.now(),
      name: name.trim(),
      cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200',
      posts: initialPostId ? [initialPostId] : [],
    };
    setCollections((prev) => [newCol, ...prev]);
    if (initialPostId && !savedPostIds.includes(initialPostId)) {
      setSavedPostIds((prev) => [...prev, initialPostId]);
    }
  };

  const addPostToCollection = (collectionId, postId) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col._id === collectionId) {
          if (!col.posts.includes(postId)) {
            return { ...col, posts: [...col.posts, postId] };
          }
        }
        return col;
      })
    );
    if (!savedPostIds.includes(postId)) {
      setSavedPostIds((prev) => [...prev, postId]);
    }
  };

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          const likes = post.likes_count || [];
          const hasLiked = likes.includes(currentUser._id);
          const updatedLikes = hasLiked
            ? likes.filter((id) => id !== currentUser._id)
            : [...likes, currentUser._id];
          return { ...post, likes_count: updatedLikes };
        }
        return post;
      })
    );
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          const comments = post.comments || [];
          const newComment = {
            _id: 'comment_' + Date.now(),
            user: currentUser,
            text,
            createdAt: new Date().toISOString(),
          };
          return { ...post, comments: [...comments, newComment] };
        }
        return post;
      })
    );
  };

  const toggleSavePost = (postId) => {
    setSavedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // 2. Story Actions with Immediate IndexedDB Persistence
  const addStory = (newStoryData) => {
    const newStory = {
      _id: 'story_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      user: currentUser,
      content: newStoryData.content || '',
      media_url: newStoryData.media_url || '',
      media_type: newStoryData.media_type || 'text',
      background_color: newStoryData.background_color || '#4f46e5',
      audio_track: newStoryData.audio_track || null,
      audio_title: newStoryData.audio_title || null,
      is_close_friends: Boolean(newStoryData.is_close_friends),
      sticker: newStoryData.sticker || null,
      tagged_users: newStoryData.tagged_users || [],
      hotspots: newStoryData.hotspots || [],
      font_style: newStoryData.font_style || 'modern',
      text_design: newStoryData.text_design || 'plain',
      text_color: newStoryData.text_color || '#ffffff',
      text_align: newStoryData.text_align || 'center',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Immediately update in-memory state
    setStories((prev) => [newStory, ...prev]);

    // 2. Immediately save to IndexedDB (safe from browser 5MB quota)
    saveSingleStoryToDB(newStory);

    // 3. Concurrently sync to MongoDB Atlas in background
    fetch('http://localhost:5000/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStory),
    }).catch(() => {});

    // 4. Update localStorage cache safely
    try {
      const saved = localStorage.getItem('ryzo_app_stories');
      const existing = saved ? JSON.parse(saved) : [];
      const updated = [newStory, ...existing.filter((s) => s._id !== newStory._id)];
      const serialized = JSON.stringify(updated);
      if (serialized.length < 1.5 * 1024 * 1024) {
        localStorage.setItem('ryzo_app_stories', serialized);
      } else {
        const lightweight = updated.map((s) => {
          if (s.media_url && s.media_url.startsWith('data:') && s.media_url.length > 50000) {
            return { ...s, media_url: '', _storedInDB: true };
          }
          return s;
        });
        localStorage.setItem('ryzo_app_stories', JSON.stringify(lightweight));
      }
    } catch (err) {
      console.warn('LocalStorage quota guarded; IndexedDB holds full story.', err);
    }
  };

  const deleteStory = (storyId) => {
    // 1. Track in deletedStoryIds so deleted dummy/network stories never resurrect upon refresh
    setDeletedStoryIds((prev) => (prev.includes(storyId) ? prev : [...prev, storyId]));

    // 2. Remove from active in-memory stories state
    setStories((prev) => prev.filter((s) => s._id !== storyId));

    // 3. Immediately delete from IndexedDB
    deleteStoryFromDB(storyId);

    // 4. Concurrently delete from MongoDB Atlas
    fetch(`http://localhost:5000/api/stories/${storyId}`, {
      method: 'DELETE',
    }).catch(() => {});

    // 5. Update localStorage cache
    try {
      const saved = localStorage.getItem('ryzo_app_stories');
      if (saved) {
        const existing = JSON.parse(saved);
        const updated = existing.filter((s) => s._id !== storyId);
        localStorage.setItem('ryzo_app_stories', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn('Error updating localStorage after story deletion:', err);
    }
  };

  const tagStoryUser = (storyId, taggedUser) => {
    setStories((prev) => {
      const updated = prev.map((s) => {
        if (s._id === storyId) {
          const currentTags = s.tagged_users || [];
          const exists = currentTags.some(
            (u) =>
              (u.username && u.username === taggedUser.username) ||
              (u._id && u._id === taggedUser._id)
          );
          if (!exists) {
            const modified = { ...s, tagged_users: [...currentTags, taggedUser] };
            saveSingleStoryToDB(modified);
            fetch('http://localhost:5000/api/stories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(modified),
            }).catch(() => {});
            return modified;
          }
        }
        return s;
      });
      return updated;
    });
  };

  const [mutedStoryUserIds, setMutedStoryUserIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_muted_story_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const toggleMuteStoryUser = (userIdOrUsername) => {
    const key = String(userIdOrUsername);
    setMutedStoryUserIds((prev) => {
      const isMuted = prev.includes(key);
      const updated = isMuted ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem('ryzo_muted_story_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Easter Egg Hotspot Discoveries State
  const [discoveredHotspots, setDiscoveredHotspots] = useState(() => {
    try {
      const saved = localStorage.getItem('ryzo_discovered_hotspots');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('ryzo_discovered_hotspots', JSON.stringify(discoveredHotspots));
    } catch (e) {}
  }, [discoveredHotspots]);

  const recordHotspotDiscovered = (storyId, hotspotId) => {
    if (!storyId || !hotspotId) return;
    setDiscoveredHotspots((prev) => {
      const list = prev[storyId] || [];
      if (list.includes(hotspotId)) return prev;
      return { ...prev, [storyId]: [...list, hotspotId] };
    });
  };

  // 3. Message Actions
  const addIncomingMessage = (newMsg) => {
    // If the message was sent by current user, it is already added locally by sendMessage
    if (newMsg.from_user_id === currentUser._id) return;

    setMessages((prev) => {
      if (prev.some((m) => m._id === newMsg._id)) return prev;
      return [...prev, newMsg];
    });

    const otherUserId =
      newMsg.from_user_id === currentUser._id ? newMsg.to_user_id : newMsg.from_user_id;

    const previewText =
      newMsg.message_type === 'audio'
        ? '🎤 Voice note'
        : newMsg.message_type === 'post_share'
        ? '📷 Shared a post'
        : newMsg.message_type === 'story_reply'
        ? '💬 Replied to story'
        : newMsg.text || 'Sent media';

    setRecentChats((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.from_user_id._id === otherUserId || c.to_user_id._id === otherUserId
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          text: previewText,
          updatedAt: newMsg.createdAt || new Date().toISOString(),
        };
        return updated;
      }
      return prev;
    });
  };

  const markMessagesAsSeenLocally = (targetUserId) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.from_user_id === targetUserId && msg.to_user_id === currentUser._id) {
          return { ...msg, seen: true };
        }
        return msg;
      })
    );
  };

  const toggleMessageReaction = (messageId, emoji, userId, updatedReactionsServer) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg._id === messageId) {
          if (updatedReactionsServer) {
            return { ...msg, reactions: updatedReactionsServer };
          }
          const reactions = msg.reactions || [];
          const existingIdx = reactions.findIndex((r) => r.user === userId && r.emoji === emoji);
          let newReactions = [...reactions];
          if (existingIdx > -1) {
            newReactions.splice(existingIdx, 1);
          } else {
            newReactions = newReactions.filter((r) => r.user !== userId);
            newReactions.push({ user: userId, emoji });
          }
          return { ...msg, reactions: newReactions };
        }
        return msg;
      })
    );
  };

  const sendMessage = (
    toUserId,
    text = '',
    mediaUrl = '',
    messageType = 'text',
    extraPayload = {}
  ) => {
    if (!text.trim() && !mediaUrl && !extraPayload.shared_post && !extraPayload.shared_story) {
      return null;
    }

    const newMessage = {
      _id: 'msg_' + Date.now(),
      from_user_id: currentUser._id,
      to_user_id: toUserId,
      text: text || '',
      message_type: messageType,
      media_url: mediaUrl || '',
      audio_duration: extraPayload.audio_duration || 0,
      shared_post: extraPayload.shared_post || null,
      shared_story: extraPayload.shared_story || null,
      reactions: [],
      seen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Update recent chats preview
    const previewText =
      messageType === 'audio'
        ? '🎤 Voice note'
        : messageType === 'post_share'
        ? '📷 Shared a post'
        : messageType === 'story_reply'
        ? '💬 Replied to story'
        : text || 'Sent media';

    setRecentChats((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.from_user_id._id === toUserId || c.to_user_id._id === toUserId
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          text: previewText,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }
      return prev;
    });

    return newMessage;
  };


  // 4. User Profile & Network Actions
  const updateProfile = (updatedData) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updatedData };
      try {
        localStorage.setItem('ryzo_user_profile', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error saving updated profile to localStorage:', err);
      }
      return updated;
    });

    // If profile picture, full name, or username changed, update active stories and posts
    if (updatedData.profile_picture || updatedData.full_name || updatedData.username) {
      setStories((prev) =>
        prev.map((story) => {
          const isOwn =
            (story.user?._id && currentUser?._id && story.user._id === currentUser._id) ||
            (story.user?.username && currentUser?.username && story.user.username === currentUser.username);
          if (isOwn) {
            const updatedStory = {
              ...story,
              user: {
                ...story.user,
                ...(updatedData.full_name ? { full_name: updatedData.full_name } : {}),
                ...(updatedData.username ? { username: updatedData.username } : {}),
                ...(updatedData.profile_picture ? { profile_picture: updatedData.profile_picture } : {}),
              },
            };
            saveSingleStoryToDB(updatedStory);
            return updatedStory;
          }
          return story;
        })
      );

      setPosts((prev) =>
        prev.map((post) => {
          const isOwn =
            (post.user?._id && currentUser?._id && post.user._id === currentUser._id) ||
            (post.user?.username && currentUser?.username && post.user.username === currentUser.username);
          if (isOwn) {
            const updatedPost = {
              ...post,
              user: {
                ...post.user,
                ...(updatedData.full_name ? { full_name: updatedData.full_name } : {}),
                ...(updatedData.username ? { username: updatedData.username } : {}),
                ...(updatedData.profile_picture ? { profile_picture: updatedData.profile_picture } : {}),
              },
            };
            saveSinglePostToDB(updatedPost);
            return updatedPost;
          }
          return post;
        })
      );
    }
  };

  const toggleFollowUser = (userId) => {
    setFollowing((prev) => {
      const isFollowing = prev.some((u) => u._id === userId);
      if (isFollowing) {
        return prev.filter((u) => u._id !== userId);
      } else {
        const userToFollow =
          dummyConnectionsData.find((u) => u._id === userId) || {
            _id: userId,
            full_name: 'Social User',
            username: 'user_' + userId.slice(-4),
            profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
          };
        return [...prev, userToFollow];
      }
    });
  };

  const acceptConnectionRequest = (user) => {
    setPendingConnections((prev) => prev.filter((u) => u._id !== user._id));
    setConnections((prev) => [...prev, user]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateProfile,
        isDemoAuthenticated,
        setIsDemoAuthenticated,
        posts,
        addPost,
        deletePost,
        toggleLike,
        addComment,
        savedPostIds,
        toggleSavePost,
        collections,
        createCollection,
        addPostToCollection,
        extractTags,
        stories,
        addStory,
        deleteStory,
        tagStoryUser,
        mutedStoryUserIds,
        toggleMuteStoryUser,
        discoveredHotspots,
        recordHotspotDiscovered,
        activeStoryIndex,
        setActiveStoryIndex,
        activeCommentPost,
        setActiveCommentPost,

        messages,
        recentChats,
        sendMessage,
        addIncomingMessage,
        markMessagesAsSeenLocally,
        toggleMessageReaction,
        connections,
        followers,
        following,
        pendingConnections,
        toggleFollowUser,
        acceptConnectionRequest,
        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateStoryOpen,
        setIsCreateStoryOpen,
        isCreateHighlightOpen,
        setIsCreateHighlightOpen,
        highlights,
        createHighlight,
        deleteHighlight,
        activeHighlight,
        setActiveHighlight,
        isEditProfileOpen,
        setIsEditProfileOpen,

        isNotificationsOpen,
        setIsNotificationsOpen,
        notifications,
        setNotifications,
        unreadNotificationsCount,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        savedAudios,
        toggleSaveAudio,
        isAudioSaved,
        closeFriendsList,
        toggleCloseFriend,
        voteStoryPoll,
        answerStoryQA,
        toggleVerificationStatus,
        searchQuery,
        setSearchQuery,
        accountType,
        setAccountTypeMode,
        isPrivateAccount,
        setIsPrivateAccount,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        dataSaver,
        setDataSaver,
      }}
    >

      <SocketProvider currentUser={currentUser}>
        {children}
      </SocketProvider>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

