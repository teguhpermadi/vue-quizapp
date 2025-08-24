<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Student } from '../../services/gradeService';
import { getStudentWithoutGrades } from '../../services/studentService';

const model = defineModel<string[]>()
const students = ref<Student[]>([]);
const loading = ref(false);
const props = defineProps<{
  currentStudents: Student[];
}>();


const fetchStudents = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token tidak ditemukan.');
      return;
    }
    const response = await getStudentWithoutGrades(token);
    students.value = [...props.currentStudents, ...response.data];
  } catch (err) {
    console.error('Gagal memuat data siswa.', err);
  } finally {
    loading.value = false;
  }
};

fetchStudents();

onMounted(() => {
  model.value = props.currentStudents.map(s => s.id);
});

</script>

<template>
  <div>
    <div v-if="loading" class="mb-2">Loading...</div>
    <div v-else>
      <select multiple v-model="model" class="form-control" >
        <option v-for="student in students" :key="student.id" :value="student.id">
          {{ student.name }}
        </option>
      </select>
    </div>
  </div>
</template>