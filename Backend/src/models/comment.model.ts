// models/comment.model.ts
import { prisma } from '../index.js';

export interface CreateCommentInput {
  content: string;
  postId: number;
  authorId: number;
}

export interface UpdateCommentInput {
  content: string;
}

export class CommentModel {
  // Create a new comment
  static async create(data: CreateCommentInput) {
    return await prisma.comment.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  // Get all comments for a specific post
  static async getByPostId(postId: number) {
    return await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a specific comment by ID
  static async getById(id: number) {
    return await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  // Update a comment
  static async update(id: number, data: UpdateCommentInput) {
    return await prisma.comment.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  // Delete a comment
  static async delete(id: number) {
    return await prisma.comment.delete({
      where: { id },
    });
  }

  // Check if comment exists and belongs to user
  static async isCommentOwner(commentId: number, userId: number) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });
    return comment?.authorId === userId;
  }

  // Get comment count for a post
  static async getCommentCount(postId: number) {
    return await prisma.comment.count({
      where: { postId },
    });
  }
}