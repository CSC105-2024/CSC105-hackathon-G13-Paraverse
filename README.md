# CSC105-hackathon-G13-Paraverse
## :alarm_clock: Paraverse
Paraverse is an interactive web application designed to explore historical, political, cultural, and fictional events through speculative "what if" scenarios. It allows users to reimagine real-world events by presenting alternative outcomes that often contradict established facts—creating thought-provoking paradoxes. This platform fosters critical thinking and creative exploration by encouraging users to revisit past moments and construct alternate narratives that challenge conventional perspectives.
---

## :point_right: Getting Started

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/your-username/G13-Paraverse.git
cd G13-Paraverse


## :robot: Frontend - React

React

Axios

React Router DOM

Tailwind CSS

Getting Started - React Client
1.Navigate to the frontend directory:
 ```bash
cd Frontend
   ```
2.Navigate to the frontend directory:
 ```bash
npm install
   ```
3.Create a .env file and configure the following variables:
 ```bash
DATABASE_URL="file:./dev.db"
 ```
4.Start the development server:
 ```bash
npm run dev
 ```
5.The server will be running on:
 ```bash
(http://localhost:5173)
 ```

### :wrench: Backend - Hono
### :hammer_and_wrench: 
Hono

SQLite

Prisma

### :robot: API Endpoints
### :blond_haired_man: Auth Routes

| Method | Endpoint                      | Description                                  |
|--------|-------------------------------|----------------------------------------------|
| POST   | /user/signup                  | Register a new user                          |
| POST   | /user/login                   | Log in and receive a JWT token               |
| POST   | /user/forgot-password         | Send password reset link to user email       |
| POST   | /user/reset-password/:token   | Reset user password using token              |
| GET    | /profile                      | Retrieve logged-in user's profile            |
| PUT    | /user/updateProfile           | Update user profile information              |
| GET    | /user/verify-token            | Verify if JWT token is valid                 |

### :accessibility: Post Routes

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | /posts/           | Get all posts (with filters)         |
| GET    | /posts/:id        | Get post by ID                       |     
| GET    | /categories       | Get available categories             |
| POST   | /posts            | Create new post                      |
| GET    | /my-posts         | Get your own posts                   |
| PUT    | /posts/:id        | Update a post                        |
| DELETE | /reaction/:gameId | Delete the current user's reaction   |
| DELETE | /posts/:id        | Delete a post                        |

### :inbpx_tray: Comment Routes

| Method | Endpoint               | Description                                |
|--------|------------------------|--------------------------------------------|
| POST   | /comments              | Add a comment                              |
| GET    | /posts/:postId/comments| Get comments for a post                    |
| GET    | /comments/:id          | Get a single comment                       |
| PUT    | /comments/:id          | Update a comment                           |
| DELETE | /comments/:id          | Delete a comment                           |


### :thumbup: Like Routes   

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| POST   | /posts/:postId/like           | Like/unlike a post                   |
| GET    | /posts/:postId/like-status    | Create a new comment for a game      |
| GET    | /posts/:postId/likes          | Get all likes for a post             |
| GET    | /user/likes                   | Get posts liked by current user      |



## :robot: Backend Server Setup
Node.js
Hono Framework
Prisma ORM
SQLite Database

Getting Started - React Client
1.Navigate to the backend directory:
 ```bash
cd Backend
   ```
2.Navigate to the backend directory:
 ```bash
npm install
   ```
3.Create a .env file and configure the following variables:
 ```bash
DATABASE_URL="file:./dev.db"
 ```
4.Run database migrations (if applicable):
 ```bash
npx prisma migrate dev
 ```
5.Generate Prisma client:
 ```bash
npx prisma generate
 ```
6.Start the development server:
 ```bash
npm run dev
 ```
7.The server will be running on::
 ```bash
(http://localhost:3306)
 ```
