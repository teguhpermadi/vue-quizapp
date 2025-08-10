<template>
  <div class="teacher-create-container">
    <h2>Tambah Guru Baru</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nama:</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Gender:</label>
        <select v-model="gender" required>
          <option value="">Pilih Gender</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>
      <div>
        <label>NIP:</label>
        <input v-model="nip" type="text" required />
      </div>
      <button type="submit" :disabled="loading">Simpan</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { addTeacher } from "../../services/teacherService";

const name = ref("");
const gender = ref("");
const nip = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
const router = useRouter();

const handleSubmit = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      error.value = "Token tidak ditemukan.";
      return;
    }
    const response = await addTeacher(
      { name: name.value, gender: gender.value, nip: nip.value },
      token
    );
    success.value = response.message;
    name.value = "";
    gender.value = "";
    nip.value = "";
    router.push("/teachers"); // redirect
  } catch (err) {
    if (err.response && err.response.data) {
      // Tampilkan pesan utama
      error.value = err.response.data.message || "Gagal menambah guru.";
      // Jika ada detail errors, gabungkan semua pesan error
      if (err.response.data.errors) {
        const errorList = Object.values(err.response.data.errors)
          .flat()
          .join(" ");
        error.value += " " + errorList;
      }
    } else {
      error.value = "Gagal menambah guru.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.teacher-create-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.08);
}
.teacher-create-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #42b983;
}
.teacher-create-container form > div {
  margin-bottom: 16px;
}
.teacher-create-container label {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.teacher-create-container input,
.teacher-create-container select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.teacher-create-container button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.teacher-create-container button:disabled {
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
