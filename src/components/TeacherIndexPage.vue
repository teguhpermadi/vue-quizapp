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
          <th>Pilihan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="teacher in teachers" :key="teacher.id">
          <td>{{ teacher.id }}</td>
          <td>{{ teacher.name }}</td>
          <td>{{ teacher.gender }}</td>
          <td>{{ teacher.subject_count }}</td>
      <td>
        <router-link :to="`/teachers/${teacher.id}`">Detail</router-link>
        <router-link :to="`/teachers/${teacher.id}/edit`">Edit</router-link>
        <button @click="handleDelete(teacher.id)">Delete</button>
      </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>

    <div v-if="meta">
      <nav style="margin-top:24px; text-align:center;">
        <button :disabled="meta.current_page == 1 || loading" @click="goToPage(meta.current_page - 1)">Prev</button>
        <span style="margin:0 12px;">Halaman {{ meta.current_page }} dari {{ meta.last_page }}</span>
        <button :disabled="meta.current_page == meta.last_page || loading" @click="goToPage(meta.current_page + 1)">Next</button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTeachers, Teacher, deleteTeacher } from '../services/teacherService';

const teachers = ref<Teacher[]>([]);
const loading = ref(false);
const error = ref('');
const meta = ref<any>(null);

const loadTeachers = async (page = 1) => {
  loading.value = true;
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Token tidak ditemukan.';
      return;
    }
    // Kirim parameter page jika backend mendukung
    const response = await getTeachers(token, page);
    teachers.value = response.data;
    meta.value = response.meta;
  } catch (err) {
    error.value = 'Gagal memuat data guru.';
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (loading.value) return;
  loadTeachers(page);
};

const handleDelete = async (id: string) => {
  if (!confirm('Yakin ingin menghapus guru ini?')) return;
  loading.value = true;
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Token tidak ditemukan.';
      return;
    }
  await deleteTeacher(id, token);
  // reload data sesuai page aktif
  const currentPage = meta.value?.current_page ? Number(meta.value.current_page) : 1;
  await loadTeachers(currentPage);
  } catch (err) {
    error.value = 'Gagal menghapus guru.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadTeachers);
</script>
