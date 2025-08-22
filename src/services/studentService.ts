// src/services/studentService.ts
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
  user: StudentUser;
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

export interface Grade {
  id: string;
  name: string;
  level: number;
  students: any[];
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
  grade: Grade;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  name: string;
  gender: string;
  nisn: string;
  nis: string;
  grades: StudentGrade[];
  user: StudentUser;
  created_at: string;
  updated_at: string;
}

export interface StudentsResponse {
  status: string;
  data: Student[];
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
export interface AddStudentPayload {
  name: string;
  gender: string;
  nisn: string;
  nis: string;
}

export interface AddStudentResponse {
  status: string;
  message: string;
  data: Student;
}

export interface UpdateStudentPayload {
  name: string;
  gender: string;
  nisn: string;
  nis: string;
}

export interface UpdateStudentResponse {
  status: string;
  message: string;
  data: Student;
}

export interface DeleteStudentResponse {
  status: string;
  message: string;
}

export async function getStudents(token: string, queryParams: string = ''): Promise<StudentsResponse> {
  const response = await axios.get(`${API_BASE_URL}/students${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getStudentDetail(token: string, studentId: string): Promise<Student> {
  const response = await axios.get(`${API_BASE_URL}/students/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

export async function addStudent(token: string, payload: AddStudentPayload): Promise<AddStudentResponse> {
  const response = await axios.post(`${API_BASE_URL}/students`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateStudent(token: string, studentId: string, payload: UpdateStudentPayload): Promise<UpdateStudentResponse> {
  const response = await axios.put(`${API_BASE_URL}/students/${studentId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

export async function deleteStudent(token: string, studentId: string): Promise<DeleteStudentResponse> {
  const response = await axios.delete(`${API_BASE_URL}/students/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getStudentWithoutGrades(token: string): Promise<StudentsResponse> {
  const response = await axios.get(`${API_BASE_URL}/students/without-grades`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}