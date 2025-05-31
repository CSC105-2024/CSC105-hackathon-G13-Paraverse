// controllers/like.controller.ts
import type { Context } from 'hono';
import { LikeModel } from '../models/like.models.ts';
import { verifyAuth } from '../middleware/auth.ts';

export class LikeController {
  static async toggleLike(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ 
          success: false, 
          message: 'Authentication required' 
        }, 401);
      }

      const postId = parseInt(c.req.param('postId'));
      if (isNaN(postId)) {
        return c.json({ 
          success: false, 
          message: 'Invalid post ID' 
        }, 400);
      }

      const result = await LikeModel.toggleLike(userId, postId);
      
      return c.json({
        success: true,
        message: `Post ${result.action} successfully`,
        data: {
          postId,
          liked: result.liked,
          action: result.action
        }
      });
    } catch (error) {
      console.error('Toggle like error:', error);
      return c.json({ 
        success: false, 
        message: 'Internal server error' 
      }, 500);
    }
  }

  static async getLikeStatus(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ 
          success: false, 
          message: 'Authentication required' 
        }, 401);
      }

      const postId = parseInt(c.req.param('postId'));
      if (isNaN(postId)) {
        return c.json({ 
          success: false, 
          message: 'Invalid post ID' 
        }, 400);
      }

      const liked = await LikeModel.getUserLikeStatus(userId, postId);
      
      return c.json({
        success: true,
        data: {
          postId,
          liked
        }
      });
    } catch (error) {
      console.error('Get like status error:', error);
      return c.json({ 
        success: false, 
        message: 'Internal server error' 
      }, 500);
    }
  }

  static async getPostLikes(c: Context) {
    try {
      const postId = parseInt(c.req.param('postId'));
      if (isNaN(postId)) {
        return c.json({ 
          success: false, 
          message: 'Invalid post ID' 
        }, 400);
      }

      const likes = await LikeModel.getPostLikes(postId);
      
      return c.json({
        success: true,
        data: {
          postId,
          likes,
          totalLikes: likes.length
        }
      });
    } catch (error) {
      console.error('Get post likes error:', error);
      return c.json({ 
        success: false, 
        message: 'Internal server error' 
      }, 500);
    }
  }

  static async getUserLikes(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ 
          success: false, 
          message: 'Authentication required' 
        }, 401);
      }

      const likes = await LikeModel.getUserLikes(userId);
      
      return c.json({
        success: true,
        data: {
          likes,
          totalLikes: likes.length
        }
      });
    } catch (error) {
      console.error('Get user likes error:', error);
      return c.json({ 
        success: false, 
        message: 'Internal server error' 
      }, 500);
    }
  }
}