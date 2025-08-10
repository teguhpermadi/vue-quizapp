<template>
  <div class="grade-edit-container">
    <h2>Edit Grade</h2>
    <form v-if="grade" @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Level:</label>
        <input v-model.number="level" type="number" min="1" required />
      </div>
      <button type="submit" :disabled="loading">Simpan Perubahan</button>
    </form>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getGradeDetail, updateGrade } from '../../services/gradeService';

const route = useRoute();
const router = useRouter();
const grade = ref<any>(null);
const name = ref('');
const level = ref(1);
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
    const gradeId = route.params.id as string;
    const response = await getGradeDetail(token, gradeId);
    grade.value = response.data;
    name.value = grade.value.name;
    level.value = grade.value.level;
  } catch (err) {
    error.value = 'Gagal memuat data grade.';
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
    const gradeId = route.params.id as string;
    const response = await updateGrade(token, gradeId, {
      name: name.value,
      level: level.value,
    });
    success.value = response.message;
    router.push('/grades'); // redirect
  } catch (err: any) {
    if (err.response && err.response.data) {
      error.value = err.response.data.message || 'Gagal mengupdate grade.';
      if (err.response.data.errors) {
        const errorList = Object.values(err.response.data.errors).flat().join(' ');
        error.value += ' ' + errorList;
      }
    } else {
      error.value = 'Gagal mengupdate grade.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.grade-edit-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.grade-edit-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.grade-edit-container form > div {
  margin-bottom: 16px;
}
.grade-edit-container label {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.grade-edit-container input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.grade-edit-container button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.grade-edit-container button:disabled {
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
</style>
