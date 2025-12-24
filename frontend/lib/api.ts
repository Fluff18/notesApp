const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Note {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthHeaders = (): HeadersInit => {
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }
  
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new ApiError(response.status, error.detail || 'An error occurred');
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// Auth API
export const signup = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

// Notes API
export const getNotes = async (): Promise<Note[]> => {
  const response = await fetch(`${API_URL}/notes`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createNote = async (title: string, content: string): Promise<Note> => {
  const response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(response);
};

export const updateNote = async (id: number, title?: string, content?: string): Promise<Note> => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...(title !== undefined && { title }), ...(content !== undefined && { content }) }),
  });
  return handleResponse(response);
};

export const deleteNote = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Auth helpers
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const clearToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};
