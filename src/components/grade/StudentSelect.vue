<template>
  <div>
    <h4>Pilih Siswa</h4>
    <p v-if="isLoading">Loading daftar siswa...</p>
    <p v-else-if="error">Gagal memuat siswa: {{ error }}</p>
      <div v-for="student in students" :key="student.id">
        <label>
          <input
            type="checkbox"
            :value="student.id"
            v-model="selectedStudentIds"
          />
          {{ student.name }} ({{ student.gender }})
        </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getStudentWithoutGrades, Student } from '../../services/studentService';

// State internal komponen
const students = ref<Student[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// State untuk menyimpan ID siswa yang dipilih
const selectedStudentIds = ref<string[]>([]);

// Deklarasi emits untuk v-model
// Nama event harus 'update:modelValue' agar v-model berfungsi
const emit = defineEmits(['update:modelValue']);

// Tonton perubahan pada `selectedStudentIds` dan kirimkan ke parent
watch(selectedStudentIds, (newVal) => {
  emit('update:modelValue', newVal);
});

onMounted(async () => {
const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'Token tidak ditemukan. Harap login terlebih dahulu.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await getStudentWithoutGrades(token);
    students.value = response.data;
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
});
</script>
