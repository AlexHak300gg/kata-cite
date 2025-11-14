import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchTasks, setSorting, updateTask } from '../store/slices/tasksSlice';
import TaskItem from './TaskItem';
import Pagination from './Pagination';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, pagination, isLoading, sortBy, sortOrder } = useSelector((state: RootState) => state.tasks);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTasks({ page: currentPage, sortBy, sortOrder }));
  }, [dispatch, currentPage, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'ASC' | 'DESC') => {
    dispatch(setSorting({ sortBy: newSortBy, sortOrder: newSortOrder }));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleTaskUpdate = async (id: number, text?: string, completed?: boolean) => {
    await dispatch(updateTask({ id, text, completed }));
    // Refresh the current page after update
    dispatch(fetchTasks({ page: currentPage, sortBy, sortOrder }));
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <div className="sort-controls">
          <label style={{ fontSize: '14px', color: '#666' }}>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => handleSortChange(e.target.value, sortOrder)}
          >
            <option value="created_at">Date</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="completed">Status</option>
          </select>
          <select 
            value={sortOrder} 
            onChange={(e) => handleSortChange(sortBy, e.target.value as 'ASC' | 'DESC')}
          >
            <option value="DESC">Newest first</option>
            <option value="ASC">Oldest first</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No tasks found. Create your first task above!
        </div>
      ) : (
        <>
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={handleTaskUpdate}
            />
          ))}
          {pagination && (
            <Pagination 
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;