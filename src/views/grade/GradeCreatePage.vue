<template>
  <div class="card">
    <div class="card-body">
    <h2>Tambah Grade Baru</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required class="form-control"/>
      </div>
      <div>
        <label>Level:</label>
        <input v-model.number="level" type="number" min="1" required class="form-control"/>
      </div>
      <StudentSelect v-model="studentSelected"/>
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
import { addGrade } from '../../services/gradeService';
import StudentSelect from '../../components/grade/StudentSelect.vue';

const name = ref('');
const level = ref(1);
const loading = ref(false);
const error = ref('');
const success = ref('');
const router = useRouter();
const studentSelected = ref<string[]>([]);

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
    // console.log('Adding grade:', {
    //   name: name.value,
    //   level: level.value,
    //   students: studentSelected.value,
    // });
    const response = await addGrade(token, {
      name: name.value,
      level: level.value,
      student_ids: studentSelected.value,
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

</style>
