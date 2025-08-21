<template>
    <div>
        <h2>Daftar Tahun Pelajaran</h2>
        <router-link to="/academic-years/create">Tambah Tahun Pelajaran</router-link>
        <table>
            <thead>
                <tr>
                    <th>Tahun</th>
                    <th>Semester</th>
                    <th>Aktif</th>
                    <th>Pilihan</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="year in academicYears" :key="year.id">
                    <td>{{ year.year }}</td>
                    <td>{{ year.semester }}</td>
                    <td>
                        <!-- if year.is_active -->
                        <span v-if="year.is_active">Aktif</span>
                        <span v-else>Tidak Aktif</span>
                    </td>
                    <td>
                        <!-- <router-link :to="`/academic-years/${year.id}`">Detail</router-link> -->
                        <!-- <router-link :to="`/academic-years/${year.id}/edit`">Edit</router-link> -->
                        <button @click="handleDelete(year.id)">Delete</button>
                        <button @click="setActiveYear(year.id)" v-bind:hidden="year.is_active">Aktifkan</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="loading">Loading...</div>
        <div v-if="error">{{ error }}</div>
        <div v-if="meta">
            <nav style="margin-top:24px; text-align:center;">
                <button :disabled="meta.current_page == 1 || loading" @click="goToPage(meta.current_page - 1)">Prev</button>
                <span style="margin:0 12px;">Halaman {{ meta.current_page }} dari {{ meta.last_page }}</span>
                <button :disabled="meta.current_page == meta.last_page || loading" @click="goToPage(meta.current_page + 1)">Next</button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAcademicYears, deleteAcademicYear, AcademicYear, AcademicYearsResponse, setAcademicYearActive } from '../../services/academicYearService';

const academicYears = ref<AcademicYear[]>([]);
const loading = ref(false);
const error = ref('');
const meta = ref<any>(null);

const loadAcademicYears = async (page = 1) => {
    loading.value = true;
    error.value = '';
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            error.value = 'Token tidak ditemukan.';
            return;
        }
        const urlParams = `?page=${page}`;
        const response: AcademicYearsResponse = await getAcademicYears(token, urlParams);
        academicYears.value = response.data;
        meta.value = response.meta;
    } catch (err) {
        error.value = 'Gagal memuat data tahun pelajaran.';
    } finally {
        loading.value = false;
    }
};

const goToPage = (page: number) => {
    if (loading.value) return;
    loadAcademicYears(page);
};

const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus tahun pelajaran ini?')) return;
    loading.value = true;
    error.value = '';
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            error.value = 'Token tidak ditemukan.';
            return;
        }
        await deleteAcademicYear(token, id);
        // reload data sesuai page aktif dan filter
        const currentPage = meta.value?.current_page ? Number(meta.value.current_page) : 1;
        await loadAcademicYears(currentPage);
    } catch (err) {
        error.value = 'Gagal menghapus tahun pelajaran.';
    } finally {
        loading.value = false;
    }
};

const setActiveYear = async (id: string) => {
    loading.value = true;
    error.value = '';
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            error.value = 'Token tidak ditemukan.';
            return;
        }
        const payload = { academic_year_id: id };
        await setAcademicYearActive(token, payload);
        // reload data sesuai page aktif dan filter
        const currentPage = meta.value?.current_page ? Number(meta.value.current_page) : 1;
        await loadAcademicYears(currentPage);
    } catch (err) {
        error.value = 'Gagal mengatur tahun pelajaran aktif.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => loadAcademicYears());
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 24px;
}
th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
th {
    background: #f5f5f5;
}
button {
    margin-left: 8px;
    padding: 4px 12px;
    background: #d32f2f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:disabled {
    background: #aaa;
}
</style>