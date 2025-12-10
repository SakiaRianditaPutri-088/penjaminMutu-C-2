# Backend Integration Guide

## Perubahan yang Dilakukan

### 1. Backend (Laravel)
- ✅ Register endpoint sekarang return `access_token`
- ✅ Semua data disimpan ke Supabase PostgreSQL
- ✅ User sync otomatis ke database setelah register/login

### 2. Frontend (Next.js)
- ✅ Menggunakan API client untuk call backend Laravel
- ✅ Token disimpan di localStorage
- ✅ Register dan Login menggunakan backend API

## Setup

### 1. Pastikan Backend Running

```bash
cd backend
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`

### 2. Setup Frontend Environment

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Test Integration

1. **Register User:**
   - Buka aplikasi
   - Klik "Daftar"
   - Isi form dan submit
   - User akan terdaftar di Supabase dan database
   - Token akan disimpan otomatis
   - Redirect ke dashboard

2. **Login:**
   - Klik "Masuk"
   - Isi email dan password
   - Token akan disimpan
   - Redirect ke dashboard

3. **Verifikasi Data:**
   - Buka Supabase Dashboard → Table Editor
   - Cek tabel `users` - harus ada user baru
   - Cek tabel `login_logs` - harus ada log

## API Client

File `lib/api-client.ts` menyediakan semua method untuk call backend:

```typescript
import { apiClient } from '@/lib/api-client'

// Register
await apiClient.register(email, password, fullName)

// Login
await apiClient.login(email, password)

// Get current user
await apiClient.getCurrentUser()

// Courses
await apiClient.getCourses()
await apiClient.createCourse({ title, description, color })

// Tasks
await apiClient.getTasksByCourse(courseId)
await apiClient.createTask(courseId, taskData)
```

## Troubleshooting

### Error: "Failed to fetch"
- Pastikan backend running di `http://localhost:8000`
- Cek CORS configuration di backend
- Pastikan `NEXT_PUBLIC_API_URL` sudah di-set

### Error: "Invalid credentials"
- Pastikan user sudah terdaftar
- Cek Supabase Dashboard → Authentication → Users
- Pastikan password benar

### Data tidak tersimpan
- Cek database connection di backend `.env`
- Pastikan SQL script sudah dijalankan di Supabase
- Cek logs di backend: `storage/logs/laravel.log`

### Token tidak tersimpan
- Cek browser console untuk error
- Pastikan localStorage tidak di-block
- Cek response dari API apakah ada `access_token`

## Next Steps

1. Update semua service untuk menggunakan `apiClient`:
   - `courseService` → `apiClient.getCourses()`, dll
   - `taskService` → `apiClient.getTasksByCourse()`, dll

2. Remove old storage functions:
   - `lib/storage.ts` bisa dihapus atau dijadikan fallback

3. Update dashboard untuk fetch data dari API

