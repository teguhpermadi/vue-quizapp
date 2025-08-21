<template>
    <div class="academic-year-create-container">
      <h2>Tambah Tahun Akademik</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Tahun:</label>
          <input v-model.number="year" type="text" required />
        </div>
        <div>
          <label>Semester:</label>
            <select v-model="semester" required>
                <option value="odd">Gasal</option>
                <option value="even">Genap</option>
            </select>
        </div>
        <div>
          <select v-model="selectedTeacher" required>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
          </select>
        </div>
        <button type="submit" :disabled="loading">Simpan</button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
      <div v-if="loading" class="loading">Loading...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { addAcademicYear } from '../../services/academicYearService';
import { getTeachers, Teacher } from '../../services/teacherService';

const year = ref('');
const semester = ref('');
const selectedTeacher = ref('');

const loading = ref(false);
const error = ref('');
const success = ref('');
const router = useRouter();

const teachers = ref<Teacher[]>([]);

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
    
    const payload = {
      year: year.value,
      semester: semester.value,
      teacher_id: selectedTeacher.value
    };

    const response = await addAcademicYear(token, payload);
    success.value = response.message;
    year.value = '';
    semester.value = '';
    selectedTeacher.value = '';
    router.push('/academic-years'); // redirect
  } catch (err: any) {
    if (err.response && err.response.data) {
      error.value = err.response.data.message || 'Gagal menambah tahun akademik.';
      if (err.response.data.errors) {
        const errorList = Object.values(err.response.data.errors).flat().join(' ');
        error.value += ' ' + errorList;
      }
    } else {
      error.value = 'Gagal menambah tahun akademik.';
    }
  } finally {
    loading.value = false;
  }
};

// Load teachers on component mount
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak ditemukan.');
    return;
  }
  const response = await getTeachers(token);
  teachers.value = response.data;
});
</script>

<style scoped>
.academic-year-create-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
}
.academic-year-create-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.academic-year-create-container form > div {
  margin-bottom: 16px;
}
.academic-year-create-container label {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.academic-year-create-container input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.academic-year-create-container button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.academic-year-create-container button:disabled {
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
