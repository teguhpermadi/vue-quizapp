<template>
  <div>
    <h4>Pilih Siswa</h4>
    <p v-if="isLoading">Memuat daftar siswa...</p>
    <p v-else-if="error">Gagal memuat siswa: {{ error }}</p>
    <div v-else-if="allAvailableStudents.length === 0">
      Tidak ada siswa yang tersedia untuk dipilih.
    </div>
    <div v-else>
      <div v-for="student in allAvailableStudents" :key="student.id">
        <label>
          <input
            type="checkbox"
            :value="student.id"
            v-model="selectedStudentIds"
          />
          {{ student.name }} ({{ student.gender === 'male' ? 'L' : 'P' }})
          <span v-if="isCurrentStudent(student)" class="text-muted">
            (Sudah terdaftar)
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { getStudentWithoutGrades, Student } from '../../services/studentService';
import { Grade } from '../../services/gradeService';

interface SimpleStudent {
  id: string;
  name: string;
  gender: string;
}

// Props
const props = defineProps<{
  modelValue: string[]; // For v-model from parent, contains the selected student IDs
  studentsInGrade: SimpleStudent[]; // Students currently in the grade
}>();

// Emits
const emit = defineEmits(['update:modelValue']);

// Internal state
const studentsWithoutGrade = ref<Student[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// This local ref is bound to the checkboxes.
// It's initialized from the prop and emits updates.
const selectedStudentIds = ref<string[]>(props.studentsInGrade.map(s => s.id) || []);

// Helper function to check if a student is already in the grade
const isCurrentStudent = (student: SimpleStudent | Student) => {
  return props.studentsInGrade.some(s => s.id === student.id);
};

// Watch for external changes to modelValue (e.g., parent resets the form)
// and update the internal state.
watch(() => props.modelValue, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(selectedStudentIds.value)) {
    selectedStudentIds.value = newVal || [];
  }
});

// Watch for internal changes and emit them to the parent.
watch(selectedStudentIds, (newVal) => {
  emit('update:modelValue', newVal);
});

// Computed property to create the full list of students to display.
const allAvailableStudents = computed(() => {
  // Start with current students
  const currentStudents = props.studentsInGrade || [];
  
  // Map students to a consistent format
  const mappedCurrentStudents: SimpleStudent[] = currentStudents.map(student => ({
    id: student.id,
    name: student.name,
    gender: student.gender
  }));
  
  // Map students without grade to the same format
  const mappedStudentsWithoutGrade: SimpleStudent[] = studentsWithoutGrade.value.map(student => ({
    id: student.id,
    name: student.name,
    gender: student.gender
  }));
  
  // Combine both lists
  const combined = [...mappedCurrentStudents, ...mappedStudentsWithoutGrade];
  
  // Use a Map to filter out duplicates based on student ID
  const uniqueStudents = Array.from(
    new Map(combined.map(student => [student.id, student])).values()
  );
  
  // Sort alphabetically by name
  // return uniqueStudents.sort((a, b) => a.name.localeCompare(b.name));
  return uniqueStudents;
});

// Fetch students without a grade on mount.
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'Token tidak ditemukan. Harap login terlebih dahulu.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await getStudentWithoutGrades(token);
    studentsWithoutGrade.value = response.data;
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
});
</script>
