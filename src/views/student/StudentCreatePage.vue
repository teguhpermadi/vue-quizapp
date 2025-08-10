<template>
  <div class="student-create-container">
    <h2>Tambah Siswa Baru</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Gender:</label>
        <select v-model="gender" required>
          <option value="">Pilih Gender</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>
      <div>
        <label>NISN:</label>
        <input v-model="nisn" type="text" required />
      </div>
      <div>
        <label>NIS:</label>
        <input v-model="nis" type="text" required />
      </div>
      <button type="submit" :disabled="loading">Simpan</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
    <div v-if="loading" class="loading">Loading...</div>
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
.student-create-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.student-create-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.student-create-container form > div {
  margin-bottom: 16px;
}
.student-create-container label {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.student-create-container input,
.student-create-container select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.student-create-container button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.student-create-container button:disabled {
  background: #aaa;
}
.error {
  color: #d32f2f;
  margin-top: 16px;
  text-align: center;
}
.success {
  color: #388e3c;
  margin-top: 16px;
  text-align: center;
}
.loading {
  margin-top: 16px;
  color: #42b983;
  text-align: center;
}
</style>
