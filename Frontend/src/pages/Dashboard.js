import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Spinner,
  Navbar,
  Nav,
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { getUser, removeToken, isAdmin } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    userId: '',
  });
  const user = getUser();
  const admin = isAdmin();

  useEffect(() => {
    fetchTasks();
    if (admin) {
      fetchUsers();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/tasks/users/all');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      userId: admin ? '' : user.id,
    });
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      userId: task.user._id || task.user,
    });
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: Title is required
    if (!formData.title || formData.title.trim() === '') {
      setError('Title is required');
      return;
    }

    // Validation: Assign to User is required when creating task (for admin)
    if (!editingTask && admin && (!formData.userId || formData.userId === '')) {
      setError('Please assign the task to a user');
      return;
    }

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { variant: 'warning', class: 'badge-pending', label: 'Pending' },
      'in-progress': { variant: 'info', class: 'badge-in-progress', label: 'In Progress' },
      completed: { variant: 'success', class: 'badge-completed', label: 'Completed' },
    };
    return badges[status] || badges.pending;
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (loading) {
    return (
      <div className="bg-pattern" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <div className="spinner-custom mx-auto mb-3"></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', fontWeight: '600' }}>Loading your tasks...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-pattern" style={{ minHeight: '100vh', paddingBottom: '50px' }}>
      <Navbar expand="lg" className="bg-white shadow-sm" style={{ padding: '15px 0' }}>
        <Container>
          <Navbar.Brand style={{ fontWeight: '700', fontSize: '1.5rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            TaskFlow
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Item className="me-3">
                <span style={{ color: 'var(--text-secondary)' }}>
                  Welcome, <strong style={{ color: 'var(--primary-color)' }}>{user?.name}</strong>
                  {admin && (
                    <Badge bg="primary" className="ms-2" style={{ background: 'var(--primary-gradient)', border: 'none' }}>
                      Admin
                    </Badge>
                  )}
                </span>
              </Nav.Item>
              <Nav.Item>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline-danger"
                    onClick={handleLogout}
                    style={{
                      borderRadius: '50px',
                      padding: '8px 20px',
                      borderColor: 'var(--danger-color)',
                      color: 'var(--danger-color)',
                      fontWeight: '600',
                    }}
                  >
                    Logout
                  </Button>
                </motion.div>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="danger" className="rounded-pill border-0" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
              <strong>Error!</strong> {error}
            </Alert>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row className="mb-4">
            <Col xs={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-0 text-center h-100" style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {taskStats.total}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>Total Tasks</div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col xs={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-0 text-center h-100" style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--warning-color)' }}>
                      {taskStats.pending}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>Pending</div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col xs={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-0 text-center h-100" style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent-color)' }}>
                      {taskStats.inProgress}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>In Progress</div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col xs={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-0 text-center h-100" style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--success-color)' }}>
                      {taskStats.completed}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>Completed</div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Create Task Button */}
          <motion.div
            variants={itemVariants}
            className="mb-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCreateTask}
                className="btn-gradient-primary"
                style={{ fontSize: '16px', padding: '12px 30px', borderRadius: '50px' }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create New Task
              </Button>
            </motion.div>
          </motion.div>

          {/* Tasks Grid */}
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card border-0 text-center" style={{ padding: '60px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>No tasks yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                  Create your first task to get started!
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleCreateTask} className="btn-gradient-primary">
                    Create Task
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          ) : (
            <Row>
              <AnimatePresence>
                {tasks.map((task, index) => {
                  const statusBadge = getStatusBadge(task.status);
                  return (
                    <Col key={task._id} xs={12} sm={6} lg={4} className="mb-4">
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="glass-card border-0 h-100">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 style={{ color: 'var(--text-primary)', fontWeight: '700', flex: 1, marginRight: '10px' }}>
                                {task.title}
                              </h5>
                              <Badge className={`badge-custom ${statusBadge.class}`}>
                                {statusBadge.label}
                              </Badge>
                            </div>
                            {task.description && (
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px', minHeight: '40px' }}>
                                {task.description}
                              </p>
                            )}
                            {admin && task.user && (
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                <strong>Assigned to:</strong> {task.user.name || task.user.email}
                              </p>
                            )}
                            <div className="d-flex gap-2 mt-3">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1 }}>
                                <Button
                                  onClick={() => handleEditTask(task)}
                                  className="btn-gradient-success w-100"
                                  style={{ fontSize: '14px', padding: '8px' }}
                                >
                                  Edit
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1 }}>
                                <Button
                                  onClick={() => handleDeleteTask(task._id)}
                                  variant="danger"
                                  className="w-100"
                                  style={{ fontSize: '14px', padding: '8px', borderRadius: '50px', border: 'none' }}
                                >
                                  Delete
                                </Button>
                              </motion.div>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </AnimatePresence>
            </Row>
          )}
        </motion.div>
      </Container>

      {/* Task Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Modal.Header closeButton style={{ borderBottom: 'none', padding: '25px' }}>
            <Modal.Title style={{ fontWeight: '700', fontSize: '1.5rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '25px' }}>
            {error && (
              <Alert variant="danger" className="rounded-pill border-0 mb-3" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              {admin && (
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    Assign to User <span style={{ color: 'var(--danger-color)' }}>*</span>
                  </Form.Label>
                  <Form.Select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="form-control-custom"
                    required={!editingTask}
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  Title <span style={{ color: 'var(--danger-color)' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-control-custom"
                  required
                  placeholder="Enter task title"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control-custom"
                  placeholder="Enter task description"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  Status
                </Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-control-custom"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
              <div className="d-flex gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
                  <Button
                    type="submit"
                    className="btn-gradient-primary w-100"
                    style={{ padding: '12px' }}
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowModal(false)}
                    className="w-100"
                    style={{ padding: '12px', borderRadius: '50px' }}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </div>
            </Form>
          </Modal.Body>
        </motion.div>
      </Modal>
    </div>
  );
};

export default Dashboard;
