// controllers/comment.controller.ts
import type { Context } from 'hono';
import { CommentModel } from '../models/comment.model.js';
import { verifyAuth } from '../middleware/auth.js';

export class CommentController {
  // Create a new comment
  static async createComment(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { content, postId } = await c.req.json();

      // Validation
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return c.json({ error: 'Content is required and cannot be empty' }, 400);
      }

      if (!postId || typeof postId !== 'number') {
        return c.json({ error: 'Valid post ID is required' }, 400);
      }

      if (content.trim().length > 1000) {
        return c.json({ error: 'Comment cannot exceed 1000 characters' }, 400);
      }

      const comment = await CommentModel.create({
        content: content.trim(),
        postId,
        authorId: userId,
      });

      return c.json({
        success: true,
        message: 'Comment created successfully',
        data: comment,
      }, 201);

    } catch (error) {
      console.error('Create comment error:', error);
      return c.json({ error: 'Failed to create comment' }, 500);
    }
  }

  // Get all comments for a post
  static async getPostComments(c: Context) {
    try {
      const postId = parseInt(c.req.param('postId'));

      if (isNaN(postId)) {
        return c.json({ error: 'Invalid post ID' }, 400);
      }

      const comments = await CommentModel.getByPostId(postId);
      const commentCount = await CommentModel.getCommentCount(postId);

      return c.json({
        success: true,
        data: {
          comments,
          count: commentCount,
        },
      });

    } catch (error) {
      console.error('Get comments error:', error);
      return c.json({ error: 'Failed to fetch comments' }, 500);
    }
  }

  // Get a specific comment
  static async getComment(c: Context) {
    try {
      const commentId = parseInt(c.req.param('id'));

      if (isNaN(commentId)) {
        return c.json({ error: 'Invalid comment ID' }, 400);
      }

      const comment = await CommentModel.getById(commentId);

      if (!comment) {
        return c.json({ error: 'Comment not found' }, 404);
      }

      return c.json({
        success: true,
        data: comment,
      });

    } catch (error) {
      console.error('Get comment error:', error);
      return c.json({ error: 'Failed to fetch comment' }, 500);
    }
  }

  // Update a comment
  static async updateComment(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const commentId = parseInt(c.req.param('id'));
      const { content } = await c.req.json();

      if (isNaN(commentId)) {
        return c.json({ error: 'Invalid comment ID' }, 400);
      }

      // Validation
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return c.json({ error: 'Content is required and cannot be empty' }, 400);
      }

      if (content.trim().length > 1000) {
        return c.json({ error: 'Comment cannot exceed 1000 characters' }, 400);
      }

      // Check if comment exists and user owns it
      const isOwner = await CommentModel.isCommentOwner(commentId, userId);
      if (!isOwner) {
        return c.json({ error: 'Comment not found or you do not have permission to edit it' }, 404);
      }

      const updatedComment = await CommentModel.update(commentId, {
        content: content.trim(),
      });

      return c.json({
        success: true,
        message: 'Comment updated successfully',
        data: updatedComment,
      });

    } catch (error) {
      console.error('Update comment error:', error);
      return c.json({ error: 'Failed to update comment' }, 500);
    }
  }

  // Delete a comment
  static async deleteComment(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const commentId = parseInt(c.req.param('id'));

      if (isNaN(commentId)) {
        return c.json({ error: 'Invalid comment ID' }, 400);
      }

      // Check if comment exists and user owns it
      const isOwner = await CommentModel.isCommentOwner(commentId, userId);
      if (!isOwner) {
        return c.json({ error: 'Comment not found or you do not have permission to delete it' }, 404);
      }

      await CommentModel.delete(commentId);

      return c.json({
        success: true,
        message: 'Comment deleted successfully',
      });

    } catch (error) {
      console.error('Delete comment error:', error);
      return c.json({ error: 'Failed to delete comment' }, 500);
    }
  }
}