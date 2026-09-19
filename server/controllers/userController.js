import { User } from '../models/User.js';
import { Collection } from '../models/Collection.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'full_name username profile_picture')
      .populate('following', 'full_name username profile_picture')
      .populate('connections', 'full_name username profile_picture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const { currentUserId } = req.body;
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = currentUser.following.includes(targetUser._id);
    if (isFollowing) {
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ isFollowing: !isFollowing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserCollections = async (req, res) => {
  try {
    const { userId } = req.params;
    const collections = await Collection.find({ user: userId }).sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { userId, name, cover_image, postId } = req.body;
    const posts = postId ? [postId] : [];
    const collection = new Collection({
      user: userId,
      name,
      cover_image: cover_image || '',
      posts,
    });
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPostToCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { postId } = req.body;
    const collection = await Collection.findById(collectionId);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });

    if (!collection.posts.includes(postId)) {
      collection.posts.push(postId);
      await collection.save();
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
