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
.register-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 32px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(66, 185, 131, 0.12);
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.register-container h2 {
  margin-bottom: 24px;
  color: #42b983;
  font-weight: 700;
  font-size: 2rem;
}
.register-container form {
  width: 100%;
}
.register-container label {
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
}
.register-container input {
  width: 100%;
  padding: 10px;
  margin-bottom: 18px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.register-container input:focus {
  border-color: #42b983;
  outline: none;
}
.register-container button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.register-container button[type="submit"]:hover {
  background: #36996b;
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
