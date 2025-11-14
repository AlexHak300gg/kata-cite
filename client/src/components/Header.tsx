import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>ToDo List</h1>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              {user.username} ({user.role})
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              const event = new CustomEvent('openLoginModal');
              window.dispatchEvent(event);
            }}
          >
            Admin Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;