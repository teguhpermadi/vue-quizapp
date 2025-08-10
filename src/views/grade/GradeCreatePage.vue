<template>
  <div class="grade-create-container">
    <h2>Tambah Grade Baru</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Level:</label>
        <input v-model.number="level" type="number" min="1" required />
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
import { addGrade } from '../../services/gradeService';

const name = ref('');
const level = ref(1);
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
    const response = await addGrade(token, {
      name: name.value,
      level: level.value,
    });
    success.value = response.message;
    name.value = '';
    level.value = 1;
    router.push('/grades'); // redirect
  } catch (err: any) {
    if (err.response && err.response.data) {
      error.value = err.response.data.message || 'Gagal menambah grade.';
      if (err.response.data.errors) {
        const errorList = Object.values(err.response.data.errors).flat().join(' ');
        error.value += ' ' + errorList;
      }
    } else {
      error.value = 'Gagal menambah grade.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.grade-create-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.grade-create-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.grade-create-container form > div {
  margin-bottom: 16px;
}
.grade-create-container label {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.grade-create-container input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.grade-create-container button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.grade-create-container button:disabled {
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
