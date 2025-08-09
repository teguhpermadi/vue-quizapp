<template>
  <div class="unauth-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Layout khusus untuk halaman yang tidak membutuhkan autentikasi
</script>

<style scoped>
.unauth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
</style>
