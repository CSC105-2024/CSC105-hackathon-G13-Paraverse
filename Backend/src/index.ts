import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from './generated/prisma/index.js';
import authRoutes from './routes/user.routes.ts';
import postRoutes from './routes/userpost.routes.ts';
import commentRoutes from './routes/comment.routes.ts';
import likeRoutes from './routes/like.routes.ts';
import 'dotenv/config'
 
export const prisma = new PrismaClient();
const app = new Hono()
 
app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
 
// Routes
app.route('/auth', authRoutes);
app.route('/api', postRoutes);
app.route('/api', commentRoutes);
app.route('/api', likeRoutes); // This should already be there
 
// Health check endpoint
app.get('/', (c) => {
  return c.json({
    status: true,
    message: 'Paraverse API is running',
    version: '1.0.0'
  });
});
 
serve({ fetch: app.fetch, port: Number(process.env.PORT || 3000) }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});