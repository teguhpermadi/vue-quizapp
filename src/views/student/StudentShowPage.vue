<template>
  <div class="student-show-container">
    <h2>Detail Siswa</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="student">
      <router-link :to="`/students/${student.id}/edit`">Edit Siswa</router-link>
      <p><strong>ID:</strong> {{ student.id }}</p>
      <p><strong>Nama:</strong> {{ student.name }}</p>
      <p><strong>Gender:</strong> {{ student.gender }}</p>
      <p><strong>NISN:</strong> {{ student.nisn }}</p>
      <p><strong>NIS:</strong> {{ student.nis }}</p>
      <p><strong>Created At:</strong> {{ student.created_at }}</p>
      <p><strong>Updated At:</strong> {{ student.updated_at }}</p>
      <h3>User</h3>
  <p><strong>Nama User:</strong> {{ student.user ? student.user.name : '-' }}</p>
  <p><strong>Email User:</strong> {{ student.user ? student.user.email : '-' }}</p>
      <h3>Grades</h3>
      <ul>
        <li v-for="grade in student.grades" :key="grade.id">
          {{ grade.grade ? grade.grade.name : '-' }} (Tahun: {{ grade.academic_year ? grade.academic_year.year : '-' }}, Semester: {{ grade.academic_year ? grade.academic_year.semester : '-' }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getStudentDetail, Student } from '../../services/studentService';

const route = useRoute();
const student = ref<Student | null>(null);
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Token tidak ditemukan.';
      return;
    }
    const studentId = route.params.id as string;
    const response = await getStudentDetail(token, studentId);
    student.value = response;
  } catch (err) {
    error.value = 'Gagal memuat data siswa.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.student-show-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.student-show-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.student-show-container h3 {
  margin-top: 24px;
  color: #42b983;
}
.student-show-container p {
  margin: 8px 0;
}
.student-show-container ul {
  margin: 0;
  padding-left: 20px;
}
</style>
