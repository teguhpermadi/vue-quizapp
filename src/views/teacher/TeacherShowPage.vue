<template>
  <div class="card">
    <div class="card-body">
    <h2>Detail Guru</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="teacher">
      <router-link :to="`/teachers/${teacher.id}/edit`">Edit Guru</router-link>
      <p><strong>ID:</strong> {{ teacher.id }}</p>
      <p><strong>Nama:</strong> {{ teacher.name }}</p>
      <p><strong>Gender:</strong> {{ teacher.gender }}</p>
      <p><strong>NIP:</strong> {{ teacher.nip || '-' }}</p>
      <p><strong>Jumlah Mapel:</strong> {{ teacher.subject_count }}</p>
      <h3>Subjects</h3>
      <ul>
        <li v-for="subject in teacher.subjects" :key="subject.id">
          {{ subject.subject.name }} ({{ subject.subject.code }}) - {{ subject.grade.name }}
        </li>
      </ul>
    </div>
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
    console.log('Teacher detail response:', response);
    teacher.value = response.data;
  } catch (err) {
    error.value = 'Gagal memuat data guru.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>

</style>
