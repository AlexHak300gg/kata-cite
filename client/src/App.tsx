import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { getCurrentUser } from './store/slices/authSlice';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoginModal from './components/LoginModal';
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  return (
    <div className="App">
      <Header />
      <main className="container">
        <div className="content">
          <TaskForm />
          <TaskList />
        </div>
      </main>
      <LoginModal />
    </div>
  );
};

export default App;