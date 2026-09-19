// IndexedDB Persistence Utility for Ryzo
// Used for storing rich media (Reel video data URLs, audio tracks, posts, and 24h stories)
// which exceeds the standard 5MB browser localStorage quota.

const DB_NAME = 'ryzo_app_db';
const DB_VERSION = 2; // Bumped to 2 to introduce 'stories' store
const POSTS_STORE = 'posts';
const STORIES_STORE = 'stories';

/**
 * Open or initialize the IndexedDB instance
 */
export const openDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      resolve(null);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(POSTS_STORE)) {
        db.createObjectStore(POSTS_STORE, { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains(STORIES_STORE)) {
        db.createObjectStore(STORIES_STORE, { keyPath: '_id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      resolve(null); // Fallback gracefully if blocked or private browsing
    };
  });
};

/* =========================================================================
   POSTS & REELS INDEXEDDB OPERATIONS
   ========================================================================= */

/**
 * Retrieve all persisted posts and reels from IndexedDB
 */
export const getAllPostsFromDB = async () => {
  try {
    const db = await openDB();
    if (!db || !db.objectStoreNames.contains(POSTS_STORE)) return [];

    return new Promise((resolve) => {
      const transaction = db.transaction([POSTS_STORE], 'readonly');
      const store = transaction.objectStore(POSTS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = (err) => {
        console.warn('IndexedDB getAllPosts error:', err);
        resolve([]);
      };
    });
  } catch (err) {
    console.warn('Failed to load posts from IndexedDB:', err);
    return [];
  }
};

/**
 * Save an entire list of posts to IndexedDB
 */
export const saveAllPostsToDB = async (posts) => {
  if (!Array.isArray(posts) || posts.length === 0) return;

  try {
    const db = await openDB();
    if (!db || !db.objectStoreNames.contains(POSTS_STORE)) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([POSTS_STORE], 'readwrite');
      const store = transaction.objectStore(POSTS_STORE);

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = (err) => {
        console.warn('IndexedDB saveAllPosts transaction error:', err);
        resolve(false);
      };

      posts.forEach((post) => {
        if (post && post._id) {
          store.put(post);
        }
      });
    });
  } catch (err) {
    console.warn('Failed to save posts to IndexedDB:', err);
  }
};

/**
 * Save or update a single post / reel
 */
export const saveSinglePostToDB = async (post) => {
  if (!post || !post._id) return;

  try {
    const db = await openDB();
    if (!db || !db.objectStoreNames.contains(POSTS_STORE)) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([POSTS_STORE], 'readwrite');
      const store = transaction.objectStore(POSTS_STORE);
      const request = store.put(post);

      request.onsuccess = () => resolve(true);
      request.onerror = (err) => {
        console.warn('IndexedDB saveSinglePost error:', err);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('Failed saving post to IndexedDB:', err);
  }
};

/**
 * Delete a post / reel from IndexedDB
 */
export const deletePostFromDB = async (postId) => {
  if (!postId) return;

  try {
    const db = await openDB();
    if (!db || !db.objectStoreNames.contains(POSTS_STORE)) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([POSTS_STORE], 'readwrite');
      const store = transaction.objectStore(POSTS_STORE);
      const request = store.delete(postId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Failed deleting post from IndexedDB:', err);
  }
};

/* =========================================================================
   STORIES INDEXEDDB OPERATIONS (24H PERSISTENCE & RICH MEDIA STORAGE)
   ========================================================================= */

/**
 * Retrieve all persisted stories from IndexedDB
 */
export const getAllStoriesFromDB = async () => {
  try {
    const db = await openDB();
    if (!db || !db.objectStoreNames.contains(STORIES_STORE)) return [];

    return new Promise((resolve) => {
      const transaction = db.transaction([STORIES_STORE], 'readonly');
      const store = transaction.objectStore(STORIES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = (err) => {
        console.warn('IndexedDB getAllStories error:', err);
        resolve([]);
      };
    });
  } catch (err) {
    console.warn('Failed to load stories from IndexedDB:', err);
    return [];
  }
};

/**
 * Save an entire list of stories to IndexedDB
 */
export const saveAllStoriesToDB = async (stories) => {
  if (!Array.isArray(stories) || stories.length === 0) return;

  try {
    const db = await openDB();
    if (!db || !db.objectStoreNames.contains(STORIES_STORE)) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(STORIES_STORE);

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = (err) => {
        console.warn('IndexedDB saveAllStories transaction error:', err);
        resolve(false);
      };

      stories.forEach((story) => {
        if (story && story._id) {
          store.put(story);
        }
      });
    });
  } catch (err) {
    console.warn('Failed to save stories to IndexedDB:', err);
  }
};

/**
 * Save or update a single story immediately
 */
export const saveSingleStoryToDB = async (story) => {
  if (!story || !story._id) return;

  try {
    const db = await openDB();
    if (!db || !db.objectStoreNames.contains(STORIES_STORE)) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(STORIES_STORE);
      const request = store.put(story);

      request.onsuccess = () => resolve(true);
      request.onerror = (err) => {
        console.warn('IndexedDB saveSingleStory error:', err);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('Failed saving story to IndexedDB:', err);
  }
};

/**
 * Delete a story from IndexedDB
 */
export const deleteStoryFromDB = async (storyId) => {
  if (!storyId) return;

  try {
    const db = await openDB();
    if (!db || !db.objectStoreNames.contains(STORIES_STORE)) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORIES_STORE], 'readwrite');
      const store = transaction.objectStore(STORIES_STORE);
      const request = store.delete(storyId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Failed deleting story from IndexedDB:', err);
  }
};
