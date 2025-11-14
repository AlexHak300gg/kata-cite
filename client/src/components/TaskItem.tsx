import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, text?: string, completed?: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editCompleted, setEditCompleted] = useState(task.completed);

  const isAdmin = user?.role === 'admin';

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
    setEditCompleted(task.completed);
  };

  const handleSave = () => {
    onUpdate(task.id, editText, editCompleted);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(task.text);
    setEditCompleted(task.completed);
  };

  const handleToggleComplete = () => {
    if (isAdmin) {
      onUpdate(task.id, undefined, !task.completed);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-meta">
          <div className="task-username">{task.username}</div>
          <div className="task-email">{task.email}</div>
          <div className="task-date">Created: {formatDate(task.created_at)}</div>
        </div>
        <div className="task-actions">
          {task.completed && (
            <span className="completed-badge">Completed</span>
          )}
          {isAdmin && (
            <>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={handleToggleComplete}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleEdit}
                disabled={isEditing}
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className={`task-text ${task.completed ? 'completed' : ''}`}>
        {task.text}
      </div>

      {isEditing && (
        <div className="edit-form">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id={`completed-${task.id}`}
              checked={editCompleted}
              onChange={(e) => setEditCompleted(e.target.checked)}
            />
            <label htmlFor={`completed-${task.id}`}>Mark as completed</label>
          </div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Task text..."
          />
          <div className="edit-form-actions">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;