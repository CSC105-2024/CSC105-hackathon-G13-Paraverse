// routes/comment.routes.ts
import { Hono } from 'hono';
import { CommentController } from '../controller/usercomment.controller.ts';

const commentRoutes = new Hono();

commentRoutes.post('/comments', CommentController.createComment);

commentRoutes.get('/posts/:postId/comments', CommentController.getPostComments);

commentRoutes.get('/comments/:id', CommentController.getComment);

commentRoutes.put('/comments/:id', CommentController.updateComment);

commentRoutes.delete('/comments/:id', CommentController.deleteComment);

export default commentRoutes;