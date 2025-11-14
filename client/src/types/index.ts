export interface Task {
  id: number;
  username: string;
  email: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current: number;
  total: number;
  limit: number;
  totalItems: number;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface CreateTaskData {
  username: string;
  email: string;
  text: string;
}

export interface UpdateTaskData {
  text?: string;
  completed?: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}