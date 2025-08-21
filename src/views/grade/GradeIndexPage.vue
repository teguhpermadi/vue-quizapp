<template>
  <div class="card">
    <div class="card-body">
    <h2>Daftar Grade</h2>
    <router-link to="/grades/create" class="btn btn-primary">Tambah Grade</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Level</th>
          <th>Jumlah Siswa</th>
          <th>Pilihan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grade in grades" :key="grade.id">
          <td>{{ grade.name }}</td>
          <td>{{ grade.level }}</td>
          <td>{{ grade.student_count }}</td>
          <td>
            <router-link :to="`/grades/${grade.id}`" class="btn btn-secondary">Detail</router-link>
            <router-link :to="`/grades/${grade.id}/edit`" class="btn btn-primary">Edit</router-link>
            <button @click="handleDelete(grade.id)" class="btn btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="meta">
      <nav style="margin-top:24px; text-align:center;">
        <button :disabled="meta.current_page == 1 || loading" @click="goToPage(meta.current_page - 1)" class="btn btn-secondary">Prev</button>
        <span style="margin:0 12px;">Halaman {{ meta.current_page }} dari {{ meta.last_page }}</span>
        <button :disabled="meta.current_page == meta.last_page || loading" @click="goToPage(meta.current_page + 1)" class="btn btn-secondary">Next</button>
      </nav>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getGrades, deleteGrade, Grade, GradesResponse } from '../../services/gradeService';

const grades = ref<Grade[]>([]);
const loading = ref(false);
const error = ref('');
const meta = ref<any>(null);

const loadGrades = async (page = 1) => {
  loading.value = true;
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Token tidak ditemukan.';
      return;
    }
    const urlParams = `?page=${page}`;
    const response: GradesResponse = await getGrades(token, urlParams);
    grades.value = response.data;
    meta.value = response.meta;
  } catch (err) {
    error.value = 'Gagal memuat data grade.';
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (loading.value) return;
  loadGrades(page);
};

const handleDelete = async (id: string) => {
  if (!confirm('Yakin ingin menghapus grade ini?')) return;
  loading.value = true;
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Token tidak ditemukan.';
      return;
    }
    await deleteGrade(token, id);
    const currentPage = meta.value?.current_page ? Number(meta.value.current_page) : 1;
    await loadGrades(currentPage);
  } catch (err) {
    error.value = 'Gagal menghapus grade.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadGrades());
</script>

<style scoped>

</style>
