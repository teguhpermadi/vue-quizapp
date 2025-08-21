<template>
  <div class="card">
    <div class="card-body">
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
      <ol>
        <li v-for="studentGrade in grade.students" :key="studentGrade.id">
          {{ studentGrade.student ? studentGrade.student.name : '-' }} (NISN: {{ studentGrade.student ? studentGrade.student.nisn : '-' }})
        </li>
      </ol>
    </div>
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

</style>
