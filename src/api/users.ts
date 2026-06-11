import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

// --- Users (Customers) ---
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  return data;
};

export const getUser = async (id: string | number): Promise<User> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { data } = await api.post('/users', user);
  return data;
};

export const updateUser = async (id: string | number, user: Partial<User>): Promise<User> => {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
};

export const deleteUser = async (id: string | number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// --- Posts (Orders) ---
export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get('/posts?_limit=10');
  return data;
};

// --- Todos (used to derive payment/activity data) ---
export const getTodos = async (): Promise<Todo[]> => {
  const { data } = await api.get('/todos?_limit=20');
  return data;
};
