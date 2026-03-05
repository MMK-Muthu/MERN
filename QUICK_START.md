# Quick Start Guide

## Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] npm or yarn installed

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Create .env file (copy the content below)
# Create a file named .env in the Backend folder with:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Start MongoDB (if using local MongoDB)
# Windows: net start MongoDB
# Mac/Linux: mongod

# Start backend server
npm start
# or for development: npm run dev
```

Backend should be running on `http://localhost:5000`

### 2. Frontend Setup (3 minutes)

```bash
# Open a new terminal
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend should open automatically on `http://localhost:3000`

### 3. Test the Application

1. **Register a new user:**
   - Go to `http://localhost:3000/register`
   - Fill in the form (try creating both a user and admin account)
   - Click Register

2. **Login:**
   - Go to `http://localhost:3000/login`
   - Enter your credentials
   - You'll be redirected to the dashboard

3. **Create Tasks:**
   - Click "Create New Task"
   - Fill in the form
   - Save the task

4. **Test Admin Features:**
   - Register/login as admin
   - You should see all users' tasks
   - You can assign tasks to any user

## Testing with Postman

1. Import `Task_Management_API.postman_collection.json` into Postman
2. Set environment variable:
   - `base_url`: `http://localhost:5000/api`
3. Register a user (copy the token from response)
4. Set `token` variable in Postman
5. Test all endpoints

## Common Issues

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check connection string in .env
- For MongoDB Atlas: Check network access

**Port Already in Use:**
- Change PORT in .env file
- Or kill the process using the port

**CORS Errors:**
- Ensure backend is running on port 5000
- Check that frontend proxy is set correctly

**Module Not Found:**
- Run `npm install` in both Backend and Frontend folders
- Delete node_modules and package-lock.json, then reinstall

## Next Steps

- Read the full README.md for detailed documentation
- Explore the code structure
- Customize the application
- Deploy to production

Happy Coding! 🚀

