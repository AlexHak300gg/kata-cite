import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createTask } from '../store/slices/tasksSlice';
import { clearError } from '../store/slices/authSlice';

const TaskForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.tasks);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    text: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.email.trim() || !formData.text.trim()) {
      return;
    }

    await dispatch(createTask(formData));
    
    if (!error) {
      setFormData({
        username: '',
        email: '',
        text: ''
      });
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="task-form">
      <h2>Create New Task</h2>
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
          <label htmlFor="username">Username *</label>
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
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Task Text *</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;