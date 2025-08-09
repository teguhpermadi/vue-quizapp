<template>
  <div class="dashboard-container">
    <h2>Dashboard</h2>
    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Roles:</strong> {{ user.roles }}</p>
      <p><strong>Permissions:</strong> {{ user.permissions }}</p>
      <p><strong>Created At:</strong> {{ user.created_at }}</p>
      <p><strong>Updated At:</strong> {{ user.updated_at }}</p>
    </div>
    <div v-else>
      <p>User data not found. Please login again.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '../services/authService';

const user = ref<User | null>(null);

onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
});
</script>

<style scoped>
</style>
