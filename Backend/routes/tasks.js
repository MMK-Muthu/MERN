const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// @route   GET /api/tasks
// @desc    Get all tasks (user sees own, admin sees all)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let tasks;

    // Admin can see all tasks, users see only their own
    if (req.user.role === 'admin') {
      tasks = await Task.find().populate('user', 'name email');
    } else {
      tasks = await Task.find({ user: req.user.id });
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    let task;

    if (req.user.role === 'admin') {
      task = await Task.findById(req.params.id).populate('user', 'name email');
    } else {
      task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id,
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Admin can create tasks for any user, users create for themselves
    const userId = req.user.role === 'admin' && req.body.userId 
      ? req.body.userId 
      : req.user.id;

    // Verify user exists if admin is assigning to another user
    if (req.user.role === 'admin' && req.body.userId) {
      const userExists = await User.findById(req.body.userId);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      user: userId,
    });

    const populatedTask = await Task.findById(task._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let task;

    // Find task - admin can update any, users only their own
    if (req.user.role === 'admin') {
      task = await Task.findById(req.params.id);
    } else {
      task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id,
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update fields
    const { title, description, status, userId } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;

    // Admin can reassign task to another user
    if (req.user.role === 'admin' && userId) {
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      task.user = userId;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id).populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    let task;

    // Find task - admin can delete any, users only their own
    if (req.user.role === 'admin') {
      task = await Task.findById(req.params.id);
    } else {
      task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id,
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/tasks/users/all
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users/all', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

