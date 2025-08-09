// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface LoginPayload {
  email: string;
  password: string;
  device_name: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  roles: string;
  permissions: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/login`, payload);
  return response.data;
}

export async function logout(token: string): Promise<void> {
  await axios.post(
    `${API_BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}