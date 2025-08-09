<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">Login</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login, LoginResponse } from '../services/authService';

const email = ref('');
const password = ref('');
const deviceName = ref(navigator.userAgent);
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleLogin = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const response: LoginResponse = await login({
      email: email.value,
      password: password.value,
      device_name: deviceName.value,
    });
    success.value = response.message;
    // Simpan token ke localStorage atau state management jika perlu
    localStorage.setItem('token', response.token);
    // Redirect atau aksi lain setelah login sukses
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
</style>
