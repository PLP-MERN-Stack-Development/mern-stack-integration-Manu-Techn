import express from 'express';
import Post from '../models/Post.js';
import Category from '../models/Category.js';

const router = express.Router();

// Get all posts
router.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// Get all categories
router.get('/categories', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// Create a new post
router.post('/posts', async (req, res) => {
    const post = await Post.create(req.body);
    res.json(post);
});

// Create a new category
router.post('/categories', async (req, res) => {
    const category = await Category.create(req.body);
    res.json(category);
});

export default router;