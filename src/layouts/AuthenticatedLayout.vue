<template>
  <div class="auth-layout">
    <header class="auth-header">
      <span>Welcome, {{ user && user.name ? user.name : 'User' }}</span>
      <button @click="handleLogout">Logout</button>
    </header>
    <div>
      <AppMenu />
    </div>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { logout } from '../services/authService';
import AppMenu from './AppMenu.vue';

const user = ref<{ name?: string } | null>(null);

onMounted(() => {
  // Ambil data user dari localStorage atau state management
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
});

const handleLogout = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  await logout(token);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth/login'; // Redirect to login page
};
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: #fff;
}
.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: #42b983;
  color: #fff;
}
.auth-header button {
  background: #fff;
  color: #42b983;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
}
main {
  padding: 32px;
}
</style>
