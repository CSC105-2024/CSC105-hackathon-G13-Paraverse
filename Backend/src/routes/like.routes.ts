// routes/like.routes.ts
import { Hono } from 'hono';
import { LikeController } from '../controller/like.controller.ts';

const likeRoutes = new Hono();

// Toggle like/unlike on a post
likeRoutes.post('/posts/:postId/like', LikeController.toggleLike);

// Get user's like status for a specific post
likeRoutes.get('/posts/:postId/like-status', LikeController.getLikeStatus);

// Get all likes for a specific post
likeRoutes.get('/posts/:postId/likes', LikeController.getPostLikes);

// Get all posts liked by the current user
likeRoutes.get('/user/likes', LikeController.getUserLikes);

export default likeRoutes;