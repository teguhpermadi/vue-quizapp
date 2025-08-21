<template>
  <div class="card">
    <div class="card-header">
    <h2>Edit Siswa</h2>
    </div>
    <div class="card-body">
    <form v-if="student" @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required class="form-control"/>
      </div>
      <div>
        <label>Gender:</label>
        <select v-model="gender" required class="form-control">
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>
      <div>
        <label>NISN:</label>
        <input v-model="nisn" type="text" required class="form-control"/>
      </div>
      <div>
        <label>NIS:</label>
        <input v-model="nis" type="text" required class="form-control"/>
      </div>
      <button type="submit" :disabled="loading" class="btn btn-primary">Simpan Perubahan</button>
    </form>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getStudentDetail, updateStudent } from '../../services/studentService';

const route = useRoute();
const router = useRouter();
const student = ref<any>(null);
const name = ref('');
const gender = ref('');
const nisn = ref('');
const nis = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

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
    name.value = student.value.name;
    gender.value = student.value.gender;
    nisn.value = student.value.nisn;
    nis.value = student.value.nis;
  } catch (err) {
    error.value = 'Gagal memuat data siswa.';
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Token tidak ditemukan.';
      return;
    }
    const studentId = route.params.id as string;
    const response = await updateStudent(token, studentId, {
      name: name.value,
      gender: gender.value,
      nisn: nisn.value,
      nis: nis.value,
    });
    success.value = response.message;
    router.push('/students'); // redirect
  } catch (err) {
    if (err.response && err.response.data) {
      // Tampilkan pesan utama
      error.value = err.response.data.message || "Gagal mengupdate data siswa.";
      // Jika ada detail errors, gabungkan semua pesan error
      if (err.response.data.errors) {
        const errorList = Object.values(err.response.data.errors)
          .flat()
          .join(" ");
        error.value += " " + errorList;
      }
    } else {
      error.value = "Gagal mengupdate data siswa.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
</style>