import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { loginUser, clearError } from '../store/slices/authSlice';
import { LoginCredentials } from '../types';

const LoginModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: ''
  });

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('openLoginModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openLoginModal', handleOpenModal);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setIsOpen(false);
      setFormData({ username: '', password: '' });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser(formData));
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ username: '', password: '' });
    dispatch(clearError());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Admin Login</h2>
        </div>
        
        {error && (
          <div className="alert alert-error">
            {error}
            <button 
              type="button" 
              onClick={handleClearError}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'inherit', 
                cursor: 'pointer',
                float: 'right',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
          Default admin credentials: username "admin", password "123"
        </div>
      </div>
    </div>
  );
};

export default LoginModal;