
# Campus Connections Backend

A simple backend API for the Campus Connections university clubs platform.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Make sure MongoDB is installed and running locally or use MongoDB Atlas.

3. Create a .env file with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/campus-connections
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=5000
   VITE_API_URL=http://localhost:5000/api
   ```

4. Run the server:
   ```
   node server.js
   ```

## Important Notes

- This project uses ES modules. All JavaScript files use `import/export` syntax rather than `require()`.
- To import from other files, remember to include the `.js` extension in imports (e.g. `import User from '../models/User.js'`).
- The package.json file contains `"type": "module"` to enable ES module support.

## MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named "campus-connections"
3. The application will automatically create the necessary collections on first run.

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile (Auth required)
- `GET /api/users/profile/:username` - Get user by username
- `PUT /api/users/profile` - Update user profile (Auth required)

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID
- `POST /api/clubs` - Create a new club (Auth required)
- `PUT /api/clubs/:id` - Update a club (Auth required, Admin only)
- `POST /api/clubs/:id/join` - Join a club (Auth required)
- `POST /api/clubs/:id/leave` - Leave a club (Auth required)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create a new post (Auth required)
- `PUT /api/posts/:id` - Update a post (Auth required, Author only)
- `DELETE /api/posts/:id` - Delete a post (Auth required, Author or Club Admin only)
- `POST /api/posts/:id/like` - Like a post (Auth required)
- `POST /api/posts/:id/unlike` - Unlike a post (Auth required)

### Comments
- `POST /api/posts/comment` - Create a comment (Auth required)
- `DELETE /api/posts/comment/:id` - Delete a comment (Auth required, Author only)

## Notes for Development

- The backend uses simple JWT token authentication
- Tokens are stored in localStorage on the frontend
- Posts require approval from club admins before they are visible to others
- Posts can be either public (visible to all) or private (visible only to logged-in users)
