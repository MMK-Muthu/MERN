import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../services/api';
import { setToken, setUser } from '../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', formData);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="bg-pattern" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '20px 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-0 shadow-lg">
                  <Card.Body className="p-5">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="text-center mb-4"
                    >
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          margin: '0 auto 20px',
                          background: 'var(--secondary-gradient)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(245, 87, 108, 0.3)',
                        }}
                        className="animate-float"
                      >
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                      </div>
                      <h2
                        style={{
                          background: 'var(--secondary-gradient)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontWeight: '700',
                          fontSize: '2rem',
                          marginBottom: '10px',
                        }}
                      >
                        Create Account
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        Join us and start managing your tasks
                      </p>
                    </motion.div>

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

                    <motion.form onSubmit={onSubmit} variants={itemVariants}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={name}
                          onChange={onChange}
                          className="form-control-custom"
                          placeholder="Enter your full name"
                          required
                          style={{ fontSize: '16px' }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={email}
                          onChange={onChange}
                          className="form-control-custom"
                          placeholder="Enter your email"
                          required
                          style={{ fontSize: '16px' }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={password}
                          onChange={onChange}
                          className="form-control-custom"
                          placeholder="Enter your password (min 6 characters)"
                          required
                          minLength="6"
                          style={{ fontSize: '16px' }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                          Role
                        </Form.Label>
                        <Form.Select
                          name="role"
                          value={role}
                          onChange={onChange}
                          className="form-control-custom"
                          style={{ fontSize: '16px' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </Form.Select>
                      </Form.Group>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="btn-gradient-secondary w-100"
                          disabled={loading}
                          style={{ fontSize: '16px', padding: '14px', marginTop: '10px' }}
                        >
                          {loading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                                style={{ borderWidth: '2px' }}
                              />
                              Creating Account...
                            </>
                          ) : (
                            'Sign Up'
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>

                    <motion.div
                      variants={itemVariants}
                      className="text-center mt-4"
                    >
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        Already have an account?{' '}
                        <Link
                          to="/login"
                          style={{
                            color: 'var(--secondary-color)',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#e63946';
                            e.target.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = 'var(--secondary-color)';
                            e.target.style.textDecoration = 'none';
                          }}
                        >
                          Sign In
                        </Link>
                      </p>
                    </motion.div>
                  </Card.Body>
                </Card>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
