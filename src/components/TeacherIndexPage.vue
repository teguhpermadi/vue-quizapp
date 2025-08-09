<template>
  <div>
    <h2>Daftar Guru</h2>
    <router-link to="/teachers/create">Tambah Guru</router-link>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Gender</th>
          <th>Jumlah Mapel</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="teacher in teachers" :key="teacher.id">
          <td>{{ teacher.id }}</td>
          <td>{{ teacher.name }}</td>
          <td>{{ teacher.gender }}</td>
          <td>{{ teacher.subject_count }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTeachers, Teacher } from '../services/teacherService';

const teachers = ref<Teacher[]>([]);
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
    const response = await getTeachers(token);
    teachers.value = response.data;
  } catch (err) {
    error.value = 'Gagal memuat data guru.';
  } finally {
    loading.value = false;
  }
});
</script>
