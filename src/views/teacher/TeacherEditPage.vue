<template>
  <div class="card">
    <div class="card-body">
    <h2>Edit Guru</h2>
    <form v-if="teacher" @submit.prevent="handleSubmit">
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
        <label>NIP:</label>
        <input v-model="nip" type="text" required class="form-control"/>
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
    if (err.response && err.response.data) {
      // Tampilkan pesan utama
      error.value = err.response.data.message || "Gagal mengupdate guru.";
      // Jika ada detail errors, gabungkan semua pesan error
      if (err.response.data.errors) {
        const errorList = Object.values(err.response.data.errors)
          .flat()
          .join(" ");
        error.value += " " + errorList;
      }
    } else {
      error.value = "Gagal mengupdate guru.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

</style>
