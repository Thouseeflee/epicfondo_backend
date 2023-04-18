const express = require('express');
const router = express.Router();
const Post = require('../../modals/createModal');

// Get all posts
router.get('/posts', async (req, res) => {
  const { storyType } = req.query;
  const postFields = '_id title content';

  try {
    let posts;
    if (storyType && storyType !== 'All') {
      posts = await Post.find({ category: storyType }, postFields);
    } else {
      posts = await Post.find({}, postFields);
    }

    // Shorten the content of each post
    posts = posts?.map(post => ({
      ...post.toObject(),
      content: post?.content?.slice(0, 300) + (post.content.length > 300 ? '...' : '')
    }));

    res.send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new post
router.post('/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Get a post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const postFields = '_id title content';
    const post = await Post.findById(req.params.id, postFields);
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a post by ID
router.patch('/posts/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'content'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a post by ID
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
