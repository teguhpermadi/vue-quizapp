<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Name:</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input v-model="passwordConfirmation" type="password" required />
      </div>
      <button type="submit" :disabled="loading">Register</button>
    </form>
    <div>
      <router-link to="/auth/login">Already have an account? Login here</router-link>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register, RegisterResponse } from '../services/authService';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const router = useRouter();

const handleRegister = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const response: RegisterResponse = await register({
      name: name.value,
      email: email.value,
      password: password.value,
      device_name: navigator.userAgent,
      password_confirmation: passwordConfirmation.value,
    });
    success.value = response.message;
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Register gagal';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
</style>
