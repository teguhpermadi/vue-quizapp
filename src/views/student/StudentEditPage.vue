<template>
  <div class="student-edit-container">
    <h2>Edit Siswa</h2>
    <form v-if="student" @submit.prevent="handleSubmit">
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
        <label>NISN:</label>
        <input v-model="nisn" type="text" required />
      </div>
      <div>
        <label>NIS:</label>
        <input v-model="nis" type="text" required />
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
    error.value = 'Gagal mengupdate data siswa.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.student-edit-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.student-edit-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.student-edit-container form > div {
  margin-bottom: 16px;
}
.student-edit-container label {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.student-edit-container input,
.student-edit-container select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.student-edit-container button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.student-edit-container button:disabled {
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
