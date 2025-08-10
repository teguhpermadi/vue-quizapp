<template>
  <div>
    <h2>Daftar Grade</h2>
    <router-link to="/grades/create">Tambah Grade</router-link>
    <table>
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
            <router-link :to="`/grades/${grade.id}`">Detail</router-link>
            <router-link :to="`/grades/${grade.id}/edit`">Edit</router-link>
            <button @click="handleDelete(grade.id)">Delete</button>
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
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background: #f5f5f5;
}
button {
  margin-left: 8px;
  padding: 4px 12px;
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #aaa;
}
</style>
