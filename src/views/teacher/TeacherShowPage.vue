<template>
  <div class="teacher-show-container">
    <h2>Detail Guru</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="teacher">
      <p><strong>ID:</strong> {{ teacher.id }}</p>
      <p><strong>Nama:</strong> {{ teacher.name }}</p>
      <p><strong>Gender:</strong> {{ teacher.gender }}</p>
      <p><strong>NIP:</strong> {{ teacher.nip || '-' }}</p>
      <p><strong>Jumlah Mapel:</strong> {{ teacher.subject_count }}</p>
      <p><strong>Created At:</strong> {{ teacher.created_at }}</p>
      <p><strong>Updated At:</strong> {{ teacher.updated_at }}</p>
      <h3>Subjects</h3>
      <ul>
        <li v-for="subject in teacher.subjects" :key="subject.id">
          {{ subject.name }} ({{ subject.code }})
        </li>
      </ul>
      <h3>User</h3>
      <p><strong>Nama User:</strong> {{ teacher.user?.name }}</p>
      <p><strong>Email User:</strong> {{ teacher.user?.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getTeacherDetail, Teacher } from '../../services/teacherService';

const route = useRoute();
const teacher = ref<Teacher | null>(null);
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
    const teacherId = route.params.id as string;
    const response = await getTeacherDetail(teacherId, token);
    teacher.value = response.data;
  } catch (err) {
    error.value = 'Gagal memuat data guru.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.teacher-show-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.teacher-show-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.teacher-show-container h3 {
  margin-top: 24px;
  color: #42b983;
}
.teacher-show-container p {
  margin: 8px 0;
}
.teacher-show-container ul {
  margin: 0;
  padding-left: 20px;
}
</style>
