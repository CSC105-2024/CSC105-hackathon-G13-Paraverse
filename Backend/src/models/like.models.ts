// models/like.model.ts
import { prisma } from '../index.ts';

export class LikeModel {
  static async toggleLike(userId: number, postId: number) {
    try {
      // Check if like already exists
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });

      if (existingLike) {
        // Unlike: Remove the like
        await prisma.$transaction([
          prisma.like.delete({
            where: {
              id: existingLike.id
            }
          }),
          prisma.post.update({
            where: { id: postId },
            data: {
              likes: {
                decrement: 1
              }
            }
          })
        ]);
        return { action: 'unliked', liked: false };
      } else {
        // Like: Add the like
        await prisma.$transaction([
          prisma.like.create({
            data: {
              userId,
              postId
            }
          }),
          prisma.post.update({
            where: { id: postId },
            data: {
              likes: {
                increment: 1
              }
            }
          })
        ]);
        return { action: 'liked', liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw new Error('Failed to toggle like');
    }
  }

  static async getUserLikeStatus(userId: number, postId: number) {
    try {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });
      return !!like;
    } catch (error) {
      console.error('Error checking like status:', error);
      throw new Error('Failed to check like status');
    }
  }

  static async getPostLikes(postId: number) {
    try {
      const likes = await prisma.like.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return likes;
    } catch (error) {
      console.error('Error getting post likes:', error);
      throw new Error('Failed to get post likes');
    }
  }

  static async getUserLikes(userId: number) {
    try {
      const likes = await prisma.like.findMany({
        where: { userId },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              details: true,
              category: true,
              createdAt: true,
              author: {
                select: {
                  username: true,
                  profilePicture: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return likes;
    } catch (error) {
      console.error('Error getting user likes:', error);
      throw new Error('Failed to get user likes');
    }
  }
}