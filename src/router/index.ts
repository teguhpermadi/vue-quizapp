import { createRouter, createWebHistory } from 'vue-router';
import UnauthenticatedLayout from '../layouts/UnauthenticatedLayout.vue';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue';
import LoginPage from '../components/LoginPage.vue';
import DashboardPage from '../components/DashboardPage.vue';
import RegisterPage from '../components/RegisterPage.vue';

const routes = [
  {
    path: '/',
    component: AuthenticatedLayout,
    children: [
      { path: '', component: DashboardPage }, // contoh halaman utama setelah login
      // Tambahkan halaman lain di sini
    ],
    // Bisa tambahkan meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: UnauthenticatedLayout,
    children: [
      { path: '', component: LoginPage },
    ]
  },
  { path: '/register', component: UnauthenticatedLayout, 
    children: [
      { path: '', component: RegisterPage }
    ] 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard untuk proteksi halaman yang membutuhkan login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  // Cek jika route menggunakan AuthenticatedLayout (halaman yang butuh login)
  if (to.matched.some(record => record.components?.default === AuthenticatedLayout)) {
    if (!token) {
      next('/login');
      return;
    }
  }
  next();
});

export default router;