<template>
  <div>
    <h2>Daftar Siswa</h2>
    <router-link to="/students/create">Tambah Siswa</router-link>
    <div>
      <input
        v-model="searchName"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="Cari nama siswa..."
      />
      <button @click="handleSearch">Cari</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nama</th>
          <th>Gender</th>
          <th>NISN</th>
          <th>NIS</th>
          <th>Grade</th>
          <th>Pilihan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.name }}</td>
          <td>{{ student.gender }}</td>
          <td>{{ student.nisn }}</td>
          <td>{{ student.nis }}</td>
          <td>
            <span v-if="student.studentGrades && student.studentGrades.length">
              {{ student.studentGrades[0].grade.name }}
            </span>
            <span v-else>-</span>
          </td>
          <td>
            <router-link :to="`/students/${student.id}`">Detail</router-link>
            <router-link :to="`/students/${student.id}/edit`">Edit</router-link>
            <button @click="handleDelete(student.id)">Delete</button>
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
import { getStudents, deleteStudent, Student } from '../../services/studentService';

const students = ref<Student[]>([]);
const loading = ref(false);
const error = ref('');
const meta = ref<any>(null);
const searchName = ref('');

const loadStudents = async (page = 1, nameFilter = '') => {
  loading.value = true;
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Token tidak ditemukan.';
      return;
    }
    let urlParams = `?page=${page}`;
    if (nameFilter) {
      urlParams += `&filter[name]=${encodeURIComponent(nameFilter)}`;
    }
    const response = await getStudents(token, urlParams);
    students.value = response.data;
    meta.value = response.meta;
  } catch (err) {
    error.value = 'Gagal memuat data siswa.';
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  loadStudents(1, searchName.value);
};

const goToPage = (page: number) => {
  if (loading.value) return;
  loadStudents(page, searchName.value);
};

const handleDelete = async (id: string) => {
  if (!confirm('Yakin ingin menghapus siswa ini?')) return;
  loading.value = true;
  error.value = '';
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Token tidak ditemukan.';
      return;
    }
    await deleteStudent(token, id);
    // reload data sesuai page aktif dan filter
    const currentPage = meta.value?.current_page ? Number(meta.value.current_page) : 1;
    await loadStudents(currentPage, searchName.value);
  } catch (err) {
    error.value = 'Gagal menghapus siswa.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadStudents());
</script>
