import { createRouter, createWebHistory } from 'vue-router';
import UnauthenticatedLayout from '../layouts/UnauthenticatedLayout.vue';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue';
import LoginPage from '../views/auth/LoginPage.vue';
import DashboardPage from '../views/dashboard/DashboardPage.vue';
import RegisterPage from '../views/auth/RegisterPage.vue';
import TeacherIndexPage from '../views/teacher/TeacherIndexPage.vue';
import TeacherCreatePage from '../views/teacher/TeacherCreatePage.vue';
import TeacherShowPage from '../views/teacher/TeacherShowPage.vue';
import TeacherEditPage from '../views/teacher/TeacherEditPage.vue';
import StudentIndexPage from '../views/student/StudentIndexPage.vue';
import StudentShowPage from '../views/student/StudentShowPage.vue';
import StudentEditPage from '../views/student/StudentEditPage.vue';
import StudentCreatePage from '../views/student/StudentCreatePage.vue';
// import StudentCreatePage from '../components/StudentCreatePage.vue';
// import StudentShowPage from '../components/StudentShowPage.vue';
// import StudentEditPage from '../components/StudentEditPage.vue';

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
    path: '/auth',
    component: UnauthenticatedLayout,
    children: [
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage }
    ]
  },
  // { path: '/register', component: UnauthenticatedLayout, 
  //   children: [
  //     { path: 'register', component: RegisterPage }
  //   ] 
  // },
  {
    path: '/teachers',
    component: AuthenticatedLayout,
    children: [
      { path: '', component: TeacherIndexPage },
      { path: 'create', component: TeacherCreatePage },
      { path: '/teachers/:id', component: TeacherShowPage },
      { path: ':id/edit', component: TeacherEditPage },
    ]
  }
  ,
  {
    path: '/students',
    component: AuthenticatedLayout,
    children: [
      { path: '', component: StudentIndexPage },
      { path: 'create', component: StudentCreatePage },
      { path: '/students/:id', component: StudentShowPage },
      { path: ':id/edit', component: StudentEditPage },
    ]
  }
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