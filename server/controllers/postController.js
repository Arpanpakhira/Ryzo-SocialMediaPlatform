import { Post } from '../models/Post.js';

export const extractHashtagsAndMentions = (text = '') => {
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

  return {
    hashtags: [...new Set(hashtags)],
    mentions: [...new Set(mentions)],
  };
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'full_name username profile_picture is_verified')
      .populate('comments.user', 'full_name username profile_picture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const extracted = extractHashtagsAndMentions(req.body.content || '');
    const postData = {
      ...req.body,
      hashtags: req.body.hashtags || extracted.hashtags,
      mentions: req.body.mentions || extracted.mentions,
    };

    const newPost = new Post(postData);
    await newPost.save();
    const populated = await newPost.populate('user', 'full_name username profile_picture is_verified');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExplorePosts = async (req, res) => {
  try {
    const now = new Date();
    const posts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes_count', []] } },
          commentsCount: { $size: { $ifNull: ['$comments', []] } },
          hoursOld: {
            $add: [
              {
                $divide: [
                  { $subtract: [now, '$createdAt'] },
                  1000 * 60 * 60,
                ],
              },
              1,
            ],
          },
        },
      },
      {
        $addFields: {
          engagementScore: {
            $divide: [
              { $add: ['$likesCount', { $multiply: [2, '$commentsCount'] }] },
              { $pow: ['$hoursOld', 1.5] },
            ],
          },
        },
      },
      { $sort: { engagementScore: -1, createdAt: -1 } },
      { $limit: 40 },
    ]);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      const posts = await Post.find().sort({ createdAt: -1 }).limit(20);
      return res.json(posts);
    }

    const term = q.trim();
    let filter = {};

    if (term.startsWith('#')) {
      const tag = term.slice(1).toLowerCase();
      filter = { hashtags: tag };
    } else if (term.startsWith('@')) {
      const username = term.slice(1).toLowerCase();
      filter = { mentions: username };
    } else {
      filter = {
        $or: [
          { content: { $regex: term, $options: 'i' } },
          { hashtags: { $regex: term.toLowerCase(), $options: 'i' } },
          { location: { $regex: term, $options: 'i' } },
        ],
      };
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const hasLiked = post.likes_count.includes(userId);
    if (hasLiked) {
      post.likes_count.pull(userId);
    } else {
      post.likes_count.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: userId, text });
    await post.save();
    const updated = await post.populate('comments.user', 'full_name username profile_picture');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

