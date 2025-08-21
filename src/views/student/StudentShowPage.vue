<template>
  <div class="card">
    <div class="card-header">
      <h2>Detail Siswa</h2>
    </div>
    <div class="card-body">
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="student">
      <router-link :to="`/students/${student.id}/edit`">Edit Siswa</router-link>
      <p><strong>ID:</strong> {{ student.id }}</p>
      <p><strong>Nama:</strong> {{ student.name }}</p>
      <p><strong>Gender:</strong> {{ student.gender }}</p>
      <p><strong>NISN:</strong> {{ student.nisn }}</p>
      <p><strong>NIS:</strong> {{ student.nis }}</p>
      <h3>User</h3>
  <p><strong>Nama User:</strong> {{ student.user ? student.user.name : '-' }}</p>
  <p><strong>Email User:</strong> {{ student.user ? student.user.email : '-' }}</p>
      <h3>Grades</h3>
      <ul>
        <li v-for="grade in student.studentGrades" :key="grade.id">
          {{ grade.grade.name }}
        </li>
      </ul>
    </div>
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

</style>
