// src/services/gradeService.ts
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

export interface StudentUser {
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

export interface Student {
  id: string;
  name: string;
  gender: string;
  nisn: string;
  nis: string;
  grades: any[];
  user: StudentUser;
  created_at: string;
  updated_at: string;
}

export interface StudentGrade {
  id: string;
  academic_year_id: string;
  student_id: string;
  grade_id: string;
  academic_year: AcademicYear;
  student: Student;
  grade: any;
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  student_count: string;
  students: StudentGrade[];
  created_at: string;
  updated_at: string;
}

export interface GradesResponse {
  status: string;
  data: Grade[];
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

export interface AddGradePayload {
  name: string;
  level: number;
  student_ids?: string[]; // Optional: array of student IDs to assign to the grade
}

export interface AddGradeResponse {
  status: string;
  message: string;
  data: Grade;
}

export interface GradeDetailResponse {
  status: string;
  data: Grade;
}

export interface UpdateGradePayload {
  name: string;
  level: number;
  student_ids?: string[];
}

export interface UpdateGradeResponse {
  status: string;
  message: string;
  data: Grade;
}

export interface DeleteGradeResponse {
  status: string;
  message: string;
}

export async function getGrades(token: string, queryParams: string = ''): Promise<GradesResponse> {
  const response = await axios.get(`${API_BASE_URL}/grades${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function addGrade(token: string, payload: AddGradePayload): Promise<AddGradeResponse> {
  const response = await axios.post(`${API_BASE_URL}/grades`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getGradeDetail(token: string, gradeId: string): Promise<GradeDetailResponse> {
  const response = await axios.get(`${API_BASE_URL}/grades/${gradeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateGrade(token: string, gradeId: string, payload: UpdateGradePayload): Promise<UpdateGradeResponse> {
  const response = await axios.put(`${API_BASE_URL}/grades/${gradeId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteGrade(token: string, gradeId: string): Promise<DeleteGradeResponse> {
  const response = await axios.delete(`${API_BASE_URL}/grades/${gradeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}