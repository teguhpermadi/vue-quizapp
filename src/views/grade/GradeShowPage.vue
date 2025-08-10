<template>
  <div class="grade-show-container">
    <h2>Detail Grade</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="grade">
      <p><strong>ID:</strong> {{ grade.id }}</p>
      <p><strong>Nama:</strong> {{ grade.name }}</p>
      <p><strong>Level:</strong> {{ grade.level }}</p>
      <p><strong>Jumlah Siswa:</strong> {{ grade.student_count }}</p>
      <p><strong>Dibuat:</strong> {{ grade.created_at }}</p>
      <p><strong>Diupdate:</strong> {{ grade.updated_at }}</p>
      <h3>Daftar Siswa</h3>
      <ul>
        <li v-for="studentGrade in grade.students" :key="studentGrade.id">
          {{ studentGrade.student ? studentGrade.student.name : '-' }} (NISN: {{ studentGrade.student ? studentGrade.student.nisn : '-' }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getGradeDetail } from '../../services/gradeService';

const route = useRoute();
const grade = ref<any>(null);
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
    const gradeId = route.params.id as string;
    const response = await getGradeDetail(token, gradeId);
    grade.value = response.data;
  } catch (err) {
    error.value = 'Gagal memuat data grade.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.grade-show-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.grade-show-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.grade-show-container h3 {
  margin-top: 24px;
  color: #42b983;
}
.grade-show-container p {
  margin: 8px 0;
}
.grade-show-container ul {
  margin: 0;
  padding-left: 20px;
}
</style>
