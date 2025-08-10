// src/services/academicYearService.ts
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
  nip: string;
  subject_count: string;
  subjects: Subject[];
  user: TeacherUser;
  is_linked_to_user: string;
  active_link_token: ActiveLinkToken;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: string;
  year: string;
  semester: string;
  teacher_id: string;
  teacher: Teacher;
  created_at: string;
  updated_at: string;
}

export interface AcademicYearsResponse {
  status: string;
  data: AcademicYear[];
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

export interface AddAcademicYearPayload {
  year: string;
  semester: string;
  teacher_id: string;
}

export interface AddAcademicYearResponse {
  status: string;
  message: string;
  data: AcademicYear;
}

export interface AcademicYearDetailResponse {
  status: string;
  data: AcademicYear;
}

export interface UpdateAcademicYearPayload {
  year: string;
  semester: string;
  teacher_id: string;
}

export interface UpdateAcademicYearResponse {
  status: string;
  message: string;
  data: AcademicYear;
}

export interface DeleteAcademicYearResponse {
  status: string;
  message: string;
}

export async function getAcademicYears(token: string, queryParams: string = ''): Promise<AcademicYearsResponse> {
  const response = await axios.get(`${API_BASE_URL}/academic-years${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function addAcademicYear(token: string, payload: AddAcademicYearPayload): Promise<AddAcademicYearResponse> {
  const response = await axios.post(`${API_BASE_URL}/academic-years`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getAcademicYearDetail(token: string, academicYearId: string): Promise<AcademicYearDetailResponse> {
  const response = await axios.get(`${API_BASE_URL}/academic-years/${academicYearId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateAcademicYear(token: string, academicYearId: string, payload: UpdateAcademicYearPayload): Promise<UpdateAcademicYearResponse> {
  const response = await axios.put(`${API_BASE_URL}/academic-years/${academicYearId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteAcademicYear(token: string, academicYearId: string): Promise<DeleteAcademicYearResponse> {
  const response = await axios.delete(`${API_BASE_URL}/academic-years/${academicYearId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}