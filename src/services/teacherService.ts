// src/services/teacherService.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface Subject {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Userable {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  userable_id: string;
  userable_type: string;
}

export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  userable_id: string;
  userable_type: string;
  userable: Userable;
  roles: string;
  permissions: string;
}

export interface ActiveLinkToken {
  token: string;
  expires_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  gender: string;
  subject_count: string;
  subjects: Subject[];
  user: TeacherUser;
  is_linked_to_user: string;
  active_link_token: ActiveLinkToken;
  created_at: string;
  updated_at: string;
}

export interface TeachersResponse {
  status: string;
  data: Teacher[];
  meta: {
    current_page: string;
    from: string;
    last_page: string;
    per_page: string;
    to: string;
    total: string;
  };
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  };
}

export interface AddTeacherPayload {
  name: string;
  gender: string;
  nip: string;
}

export interface AddTeacherResponse {
  status: string;
  message: string;
  data: Teacher;
}

export interface TeacherDetailResponse {
  status: string;
  data: Teacher;
}


export interface UpdateTeacherPayload {
  name: string;
  gender: string;
  nip: string;
}

export interface UpdateTeacherResponse {
  status: string;
  message: string;
  data: Teacher;
}

export interface DeleteTeacherResponse {
  status: string;
  message: string;
}

export async function getTeachers(token: string): Promise<TeachersResponse> {
  const response = await axios.get(`${API_BASE_URL}/teachers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function addTeacher(payload: AddTeacherPayload, token: string): Promise<AddTeacherResponse> {
  const response = await axios.post(`${API_BASE_URL}/teachers`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getTeacherDetail(teacherId: string, token: string): Promise<TeacherDetailResponse> {
  const response = await axios.get(`${API_BASE_URL}/teachers/${teacherId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateTeacher(teacherId: string, payload: UpdateTeacherPayload, token: string): Promise<UpdateTeacherResponse> {
  const response = await axios.put(`${API_BASE_URL}/teachers/${teacherId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteTeacher(teacherId: string, token: string): Promise<DeleteTeacherResponse> {
  const response = await axios.delete(`${API_BASE_URL}/teachers/${teacherId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}