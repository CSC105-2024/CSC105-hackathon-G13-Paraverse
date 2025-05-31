import type { Context } from "hono";
import { prisma } from "../index.ts";
import { verifyAuth } from "../middleware/auth.ts";
import { title } from "process";
import { auth } from "hono/utils/basic-auth";

export const createComment = async (c: Context) => {
    try {
        const userId = await verifyAuth(c);
        if (!userId) {
            return c.json({ status: false, message: "Unauthorized" }, 401);
        }
        const { content } = await c.req.json();
        if( !content ) {
            return c.json({ status: false, message: "Content is required" }, 400);
        }
        const comment = await prisma.comment.create({
            data: {
                content,
                authorId: userId,
                postId: c.req.param("postId")
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true
                    }
                }
            }
        });
        return c.json({
            status: true,
            message: "Comment created successfully",
            comment
        }, 201);
    } catch (error) {
        console.error("Create comment error:", error);
        return c.json({ status: false, message: "Failed to create comment" }, 500);
    }
};

export const getAllCommentsInPost = async (c: Context) => {
    try {
        const postId = c.req.param("postId");
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true
                    }
                }
            }
        });
    }
}

