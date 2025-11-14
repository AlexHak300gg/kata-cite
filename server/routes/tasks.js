const express = require('express');
const db = require('../database/init');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get tasks with pagination and sorting
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;
  const sortBy = req.query.sortBy || 'created_at';
  const sortOrder = req.query.sortOrder || 'DESC';
  
  // Validate sortBy
  const allowedSortFields = ['username', 'email', 'created_at', 'completed'];
  const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

  // Get total count
  db.get('SELECT COUNT(*) as total FROM tasks', [], (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Get paginated and sorted tasks
    const query = `
      SELECT * FROM tasks 
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ? OFFSET ?
    `;

    db.all(query, [limit, offset], (err, tasks) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        tasks,
        pagination: {
          current: page,
          total: Math.ceil(countResult.total / limit),
          limit,
          totalItems: countResult.total
        }
      });
    });
  });
});

// Create new task
router.post('/', (req, res) => {
  const { username, email, text } = req.body;

  if (!username || !email || !text) {
    return res.status(400).json({ message: 'Username, email, and text are required' });
  }

  const query = `
    INSERT INTO tasks (username, email, text)
    VALUES (?, ?, ?)
  `;

  db.run(query, [username, email, text], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Return the created task
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json(task);
    });
  });
});

// Update task (admin only)
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  // Build update query dynamically
  const updates = [];
  const values = [];

  if (text !== undefined) {
    updates.push('text = ?');
    values.push(text);
  }

  if (completed !== undefined) {
    updates.push('completed = ?');
    values.push(completed);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return updated task
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(task);
    });
  });
});

module.exports = router;