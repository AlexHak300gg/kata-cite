import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Task {
  id: number;
  username: string;
  email: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  current: number;
  total: number;
  limit: number;
  totalItems: number;
}

interface TasksState {
  tasks: Task[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

const initialState: TasksState = {
  tasks: [],
  pagination: null,
  isLoading: false,
  error: null,
  sortBy: 'created_at',
  sortOrder: 'DESC',
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { page?: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: { username: string; email: string; text: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, task);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, text, completed }: { id: number; text?: string; completed?: boolean }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/tasks/${id}`, { text, completed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'ASC' | 'DESC' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<{ tasks: Task[]; pagination: Pagination }>) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSorting, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;