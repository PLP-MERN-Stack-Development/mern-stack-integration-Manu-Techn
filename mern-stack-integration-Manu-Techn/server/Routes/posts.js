const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');

const router = express.Router();

// GET /api/posts - Get all blog posts
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all posts...');
        const posts = await Post.find().populate('category');
        console.log('Posts Successfully Found!:', posts.length);
        res.json({
            success: true,
            message: 'Posts fetched successfully!',
            count: posts.length,
            data: posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts. Sorry!',
            error: error.message
        });
    }
});

// POST /api/posts - Create a new blog post
router.post('/', async (req, res) => {
    try {
        console.log('Post creation started');
        console.log('Request body:', req.body);

        const { title, content, category } = req.body;

        // Basic validation
        if (!title || !content) {
            console.log('Validation failed: Title and content are required');
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        // Check if category exists
        if (category) {
            console.log('Checking if category exists:', category);
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found!'
                });
            }
            console.log('Category exists:', categoryExists.name);
        }

        console.log('Creating post with data:', req.body);
        const post = await Post.create(req.body);
        console.log('Post created successfully with ID:', post._id);

        const populatedPost = await Post.findById(post._id).populate('category');
        console.log('Populated post data:', populatedPost);
        
        res.status(201).json({
            success: true,
            data: populatedPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        console.error('Error message:', error.message);
        console.error('Full error', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create post',
            error: error.message
        });
    }
});

// PUT /api/posts/:id - Update a blog post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update post',
            error: error.message
        });
    }
});

// DELETE /api/posts/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete post',
            error: error.message
        });
    }
});

module.exports = router;