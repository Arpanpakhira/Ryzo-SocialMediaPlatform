import express from 'express';
import { getPosts, createPost, getExplorePosts, searchPosts, toggleLikePost, addComment } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/explore', getExplorePosts);
router.get('/search', searchPosts);
router.post('/', createPost);
router.post('/:id/like', toggleLikePost);
router.post('/:id/comment', addComment);

export default router;
