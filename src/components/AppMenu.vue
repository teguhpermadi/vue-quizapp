<template>
  <nav class="menu-nav">
    <ul>
      <li><router-link to="/">Dashboard</router-link></li>
      <li><router-link to="/teachers">Daftar Guru</router-link></li>
      <!-- Tambahkan menu lain di sini jika perlu -->
    </ul>
  </nav>
</template>

<script setup lang="ts">
// Komponen menu navigasi
</script>

<style scoped>
.menu-nav {
  padding: 0 32px;
  background: #f7f7f7;
}
.menu-nav ul {
  list-style: none;
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 12px 0;
}
.menu-nav li {
  font-weight: 500;
}
.menu-nav a {
  text-decoration: none;
  color: #42b983;
  transition: color 0.2s;
}
.menu-nav a.router-link-exact-active {
  color: #2c3e50;
  font-weight: bold;
}
</style>
