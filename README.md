# Task Management System with Role-Based Access

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing tasks with role-based access control. Features a modern, animated UI built with React Bootstrap and Framer Motion, complete with a unique gradient color scheme and smooth animations.

![Task Management System](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-purple)

## ✨ Features

### Core Features
- **User Authentication**: JWT-based authentication with secure password hashing
- **Role-Based Access Control**: Separate permissions for users and admins
- **Task Management**: Full CRUD operations for tasks
- **Protected Routes**: Frontend and backend route protection
- **LocalStorage Integration**: JWT token stored in browser LocalStorage
- **Form Validation**: Required field validation for task creation

### UI/UX Features
- **Modern Design**: Beautiful glass-morphism cards with gradient backgrounds
- **Smooth Animations**: Framer Motion animations throughout the application
- **Unique Color Scheme**: Custom gradient palette (purple, pink, blue, green)
- **Responsive Design**: Fully responsive across all device sizes
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Loading States**: Custom animated spinners and loading indicators
- **Error Handling**: Beautiful error alerts with gradient styling
- **Statistics Dashboard**: Real-time task statistics cards
- **Animated Modals**: Smooth modal transitions for task creation/editing

## 🎨 Design Highlights

### Color Palette
- **Primary Gradient**: Purple (#667eea → #764ba2)
- **Secondary Gradient**: Pink (#f093fb → #f5576c)
- **Accent Gradient**: Blue (#4facfe → #00f2fe)
- **Success Gradient**: Green (#43e97b → #38f9d7)
- **Custom CSS Variables**: Consistent theming throughout

### Animations
- Fade-in animations for page loads
- Slide-in effects for cards and components
- Scale animations for modals and buttons
- Floating animations for icons
- Staggered animations for task lists
- Hover effects on interactive elements
- Pulse effects for loading states

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **React Bootstrap** - Bootstrap components for React
- **Bootstrap 5** - CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls
- **LocalStorage** - Token management

## 📁 Project Structure

```
MERN/
├── Backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── authorize.js      # Role-based authorization middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Task.js            # Task model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── tasks.js           # Task CRUD routes
│   ├── utils/
│   │   └── generateToken.js   # JWT token generator
│   ├── .env                   # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Express server entry point
│
└── Frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── PrivateRoute.js    # Protected route component
    │   │   └── AdminRoute.js      # Admin-only route component
    │   ├── pages/
    │   │   ├── Login.js            # Login page with animations
    │   │   ├── Register.js         # Registration page with animations
    │   │   └── Dashboard.js        # Main dashboard with stats
    │   ├── services/
    │   │   └── api.js              # Axios configuration
    │   ├── utils/
    │   │   └── auth.js             # LocalStorage helpers
    │   ├── App.js                  # Main app component
    │   ├── index.js                # React entry point
    │   └── index.css               # Global styles with animations
    ├── .gitignore
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the Backend directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

   **Note**: 
   - For local MongoDB: Use `mongodb://localhost:27017/taskmanagement`
   - For MongoDB Atlas: Use your connection string from Atlas dashboard
   - Change `JWT_SECRET` to a strong random string in production

4. **Make sure MongoDB is running** on your system.

5. **Start the backend server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - React and React DOM
   - React Bootstrap and Bootstrap
   - Framer Motion
   - React Router DOM
   - Axios

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📡 API Endpoints

### Authentication Routes

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user" // optional: "user" or "admin"
  }
  ```
- **Returns**: `{ success: true, token: "...", user: {...} }`

#### Login User
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Returns**: `{ success: true, token: "...", user: {...} }`

#### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Returns**: `{ success: true, user: {...} }`

### Task Routes (All Protected)

#### Get All Tasks
- **Endpoint**: `GET /api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Users**: See only their own tasks
- **Admins**: See all tasks
- **Returns**: `{ success: true, count: 5, data: [...] }`

#### Get Single Task
- **Endpoint**: `GET /api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Users**: Can only access their own tasks
- **Admins**: Can access any task
- **Returns**: `{ success: true, data: {...} }`

#### Create Task
- **Endpoint**: `POST /api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Task Title", // Required
    "description": "Task description", // Optional
    "status": "pending", // Optional: "pending", "in-progress", "completed"
    "userId": "user_id_here" // Required for admins, auto-set for users
  }
  ```
- **Users**: Can only create tasks for themselves
- **Admins**: Can create tasks for any user (use `userId` field)
- **Returns**: `{ success: true, data: {...} }`

#### Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Same as create (all fields optional)
- **Users**: Can only update their own tasks
- **Admins**: Can update any task and reassign (use `userId` field)
- **Returns**: `{ success: true, data: {...} }`

#### Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Users**: Can only delete their own tasks
- **Admins**: Can delete any task
- **Returns**: `{ success: true, message: "Task deleted" }`

#### Get All Users (Admin Only)
- **Endpoint**: `GET /api/tasks/users/all`
- **Headers**: `Authorization: Bearer <token>`
- **Returns**: `{ success: true, count: 10, data: [...] }`

## 🔐 Authorization Rules

### User Role
- ✅ Can create, read, update, and delete only their own tasks
- ✅ Cannot access admin-only routes
- ✅ Cannot see or manage other users' tasks
- ✅ Title is required when creating tasks
- ✅ User ID is automatically assigned

### Admin Role
- ✅ Can create, read, update, and delete all tasks
- ✅ Can assign tasks to any user
- ✅ Can view all users
- ✅ Can access admin-only routes
- ✅ Title is required when creating tasks
- ✅ **Assign to User is required** when creating tasks

## 💻 Usage

### 1. Register a New Account
- Navigate to `/register`
- Fill in name, email, password, and select role
- Click "Sign Up"
- You'll be automatically logged in and redirected to the dashboard

### 2. Login
- Navigate to `/login`
- Enter email and password
- Click "Sign In"
- You'll be redirected to the dashboard

### 3. Dashboard Features
- **View Tasks**: See all your tasks (or all tasks if admin) in an animated grid
- **Statistics**: View real-time task statistics (Total, Pending, In Progress, Completed)
- **Create Task**: Click "Create New Task" button
  - Fill in required fields (Title, and Assign to User if admin)
  - Add optional description and status
  - Click "Create Task"
- **Edit Task**: Click "Edit" button on any task card
- **Delete Task**: Click "Delete" button on any task card
- **Logout**: Click "Logout" button in the navbar

### 4. Admin Features
- See all users' tasks in the dashboard
- Assign tasks to any user (required field)
- View all users list in the task creation modal
- Full access to all task management features

## 🎯 Form Validation

### Task Creation Requirements
- **Title**: Required for all users
- **Assign to User**: Required for admin users when creating tasks
- **Description**: Optional
- **Status**: Optional (defaults to "pending")

### User Registration Requirements
- **Name**: Required
- **Email**: Required (must be valid email format)
- **Password**: Required (minimum 6 characters)
- **Role**: Optional (defaults to "user")

## 🧪 Testing with Postman

Import the `Task_Management_API.postman_collection.json` file into Postman to test all API endpoints. Make sure to:

1. Set the base URL: `http://localhost:5000/api`
2. Register a user first to get a token
3. Use the token in the Authorization header for protected routes:
   - Type: Bearer Token
   - Token: `<your_jwt_token>`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000                          # Server port
MONGODB_URI=mongodb://...          # MongoDB connection string
JWT_SECRET=your_secret_key          # JWT signing secret
JWT_EXPIRE=7d                       # Token expiration time
```

### Frontend
The frontend uses a proxy configuration in `package.json`:
```json
"proxy": "http://localhost:5000"
```

For production, update the API base URL in `src/services/api.js`.

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT token-based authentication
- ✅ Protected API routes with middleware
- ✅ Role-based authorization
- ✅ CORS enabled for cross-origin requests
- ✅ Input validation on both frontend and backend
- ✅ Secure token storage in LocalStorage
- ✅ Token expiration (7 days default)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env` file
- For MongoDB Atlas: Check network access settings and IP whitelist

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

### CORS Errors
- Ensure backend is running on port 5000
- Check CORS configuration in `server.js`
- Verify frontend proxy settings in `package.json`

### Token Expired
- Login again to get a new token
- Tokens expire after 7 days (configurable in `.env`)

### React Bootstrap Not Styling
- Ensure Bootstrap CSS is imported in `index.css`
- Check that `react-bootstrap` and `bootstrap` are installed
- Clear browser cache and restart dev server

### Animations Not Working
- Ensure `framer-motion` is installed
- Check browser console for errors
- Verify React version compatibility (React 18+)

## 🚀 Deployment

### Backend Deployment

1. **Set environment variables** on your hosting platform (Heroku, Railway, Render, etc.)
2. **Ensure MongoDB is accessible** (use MongoDB Atlas for cloud)
3. **Update CORS settings** to allow your frontend domain:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }))
   ```

### Frontend Deployment

1. **Build the React app:**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Deploy the `build` folder** to hosting service:
   - **Netlify**: Drag and drop the build folder
   - **Vercel**: Connect your GitHub repo
   - **AWS S3**: Upload build folder contents

3. **Update API URL** in `src/services/api.js`:
   ```javascript
   baseURL: process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api'
   ```

4. **Set environment variable** (if using):
   ```env
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

## 📦 Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "react-bootstrap": "^2.10.10",
  "bootstrap": "^5.3.8",
  "framer-motion": "^12.35.0",
  "axios": "^1.6.2"
}
```

## 🎨 UI Components

### Pages
- **Login**: Animated login form with gradient styling
- **Register**: Registration form with rotating icon animation
- **Dashboard**: Main dashboard with statistics and task grid

### Components
- **Glass-morphism Cards**: Modern card design with backdrop blur
- **Gradient Buttons**: Animated buttons with hover effects
- **Status Badges**: Color-coded task status indicators
- **Animated Modals**: Smooth modal transitions
- **Statistics Cards**: Real-time task count displays
- **Loading Spinners**: Custom animated loading indicators

## 🔮 Future Enhancements

- [ ] Task filtering and search functionality
- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Task sharing between users
- [ ] Email notifications
- [ ] File attachments
- [ ] Task comments and collaboration
- [ ] Dark mode toggle
- [ ] Task priority levels
- [ ] Calendar view
- [ ] Drag and drop task reordering
- [ ] Export tasks to PDF/CSV

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as part of MERN Full Stack Assignment

---

## 🎉 Key Highlights

- ✨ **Modern UI/UX** with React Bootstrap and custom animations
- 🎨 **Unique Color Scheme** with gradient designs
- 🚀 **Smooth Animations** powered by Framer Motion
- 📱 **Fully Responsive** design for all devices
- 🔒 **Secure Authentication** with JWT tokens
- 👥 **Role-Based Access** control system
- ✅ **Form Validation** for required fields
- 📊 **Real-Time Statistics** dashboard

**Note**: This is a portfolio-level project demonstrating full-stack development skills with modern UI/UX, authentication, authorization, and CRUD operations.

---

**Happy Coding! 🚀**
