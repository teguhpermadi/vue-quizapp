<template>
  <div class="card">
    <div class="card-body">
    <h2>Edit Grade</h2>
    <form v-if="grade" @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required class="form-control"/>
      </div>
      <div>
        <label>Level:</label>
        <input v-model.number="level" type="number" min="1" max="6" required class="form-control"/>
      </div>
      <div>
        <h4>Pilih Siswa</h4>
        <StudentSelectEdit v-model="studentSelected" :current-students="currentStudent"/>
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
import { getGradeDetail, updateGrade } from '../../services/gradeService';
import StudentSelectEdit from '../../components/grade/StudentSelectEdit.vue';

const route = useRoute();
const router = useRouter();
const grade = ref<any>(null);
const name = ref('');
const level = ref(1);
const studentSelected = ref([]);
const currentStudent = ref([]);
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
    currentStudent.value = grade.value.students
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
    
    console.log('Submitting with students:', studentSelected.value);

    const response = await updateGrade(token, gradeId, {
      name: name.value,
      level: level.value,
      student_ids: studentSelected.value,
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
</style>
