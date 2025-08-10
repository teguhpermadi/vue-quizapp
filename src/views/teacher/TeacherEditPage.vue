<template>
  <div class="teacher-edit-container">
    <h2>Edit Guru</h2>
    <form v-if="teacher" @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Gender:</label>
        <select v-model="gender" required>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>
      <div>
        <label>NIP:</label>
        <input v-model="nip" type="text" required />
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
import { getTeacherDetail, updateTeacher } from '../../services/teacherService';

const route = useRoute();
const router = useRouter();
const teacher = ref<any>(null);
const name = ref('');
const gender = ref('');
const nip = ref('');
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
    const teacherId = route.params.id as string;
    const response = await getTeacherDetail(teacherId, token);
    teacher.value = response.data;
    name.value = teacher.value.name;
    gender.value = teacher.value.gender;
    nip.value = teacher.value.nip || '';
  } catch (err) {
    error.value = 'Gagal memuat data guru.';
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
    const teacherId = route.params.id as string;
    const response = await updateTeacher(teacherId, {
      name: name.value,
      gender: gender.value,
      nip: nip.value,
    }, token);
    success.value = response.message;
    router.push('/teachers'); // redirect
  } catch (err) {
    error.value = 'Gagal mengupdate data guru.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.teacher-edit-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.teacher-edit-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.teacher-edit-container form > div {
  margin-bottom: 16px;
}
.teacher-edit-container label {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.teacher-edit-container input,
.teacher-edit-container select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.teacher-edit-container button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.teacher-edit-container button:disabled {
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
