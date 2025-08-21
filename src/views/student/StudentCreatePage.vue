<template>
  <div class="card">
    <div class="card-header">
    <h2>Tambah Siswa Baru</h2>
    </div>
    <div class="card-body">
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required class="form-control"/>
      </div>
      <div>
        <label>Gender:</label>
        <select v-model="gender" required class="form-control">
          <option value="">Pilih Gender</option>
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
      <button type="submit" :disabled="loading" class="btn btn-primary">Simpan</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
    <div v-if="loading" class="loading">Loading...</div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { addStudent } from '../../services/studentService';

const name = ref('');
const gender = ref('');
const nisn = ref('');
const nis = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const router = useRouter();

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
    const response = await addStudent(token, {
      name: name.value,
      gender: gender.value,
      nisn: nisn.value,
      nis: nis.value,
    });
    success.value = response.message;
    name.value = '';
    gender.value = '';
    nisn.value = '';
    nis.value = '';
    router.push('/students'); // redirect
  } catch (err) {
    if (err.response && err.response.data) {
      // Tampilkan pesan utama
      error.value = err.response.data.message || "Gagal menambah siswa.";
      // Jika ada detail errors, gabungkan semua pesan error
      if (err.response.data.errors) {
        const errorList = Object.values(err.response.data.errors)
          .flat()
          .join(" ");
        error.value += " " + errorList;
      }
    } else {
      error.value = "Gagal menambah siswa.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
</style>
