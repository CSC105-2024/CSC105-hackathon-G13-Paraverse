// routes/post.routes.ts
import { Hono } from 'hono';
import {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  getCategories
} from '../controller/userpost.controller.ts';

const router = new Hono();

// Public routes
router.get('/posts', getAllPosts);           // GET /posts - Get all posts with pagination and filtering
router.get('/posts/:id', getPostById);       // GET /posts/:id - Get a single post by ID
router.get('/categories', getCategories);    // GET /categories - Get all available categories

// Protected routes (require authentication)
router.post('/posts', createPost);           // POST /posts - Create a new post
router.get('/my-posts', getUserPosts);       // GET /my-posts - Get current user's posts
router.put('/posts/:id', updatePost);        // PUT /posts/:id - Update a post
router.delete('/posts/:id', deletePost);     // DELETE /posts/:id - Delete a post

export default router;