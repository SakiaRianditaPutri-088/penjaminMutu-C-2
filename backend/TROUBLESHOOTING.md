# Troubleshooting Guide

## Masalah: "Load failed" atau Data Tidak Tersimpan

### 1. Cek Database Connection

**Error:** `Tenant or user not found` atau `connection failed`

**Solusi:**
1. Buka Supabase Dashboard → Settings → Database
2. Copy **Connection String** atau credentials:
   - Host
   - Port (6543 untuk connection pooling, 5432 untuk direct)
   - Database name
   - Username
   - **Password** (ini penting! Bukan anon key)

3. Update file `.env` di backend:
```env
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.ipszvuhzvaslgrggydno
DB_PASSWORD=YOUR_ACTUAL_DATABASE_PASSWORD_HERE
```

**PENTING:** Password database BUKAN anon key! Ini adalah password PostgreSQL yang Anda set saat membuat project.

### 2. Test Database Connection

```bash
cd backend
php artisan tinker
```

Lalu:
```php
DB::connection()->getPdo();
// Harusnya return PDO object tanpa error
```

### 3. Cek Supabase Tables

Pastikan semua tabel sudah dibuat:
1. Buka Supabase Dashboard → SQL Editor
2. Jalankan script `database/supabase_setup.sql`
3. Verifikasi di Table Editor bahwa tabel sudah ada

### 4. Cek Backend Logs

```bash
cd backend
tail -f storage/logs/laravel.log
```

Lalu coba register lagi, lihat error yang muncul.

### 5. Test API Manual

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

Lihat response dan error message.

### 6. Cek Browser Console

Buka browser DevTools (F12) → Console tab
Lihat error yang muncul saat register.

### 7. Cek Network Tab

Buka browser DevTools → Network tab
Cek request ke `/api/auth/register`:
- Status code
- Response body
- Error message

## Common Errors

### Error: "Failed to create user: Email address is invalid"
- Pastikan email format benar
- Cek apakah email sudah terdaftar di Supabase
- Buka Supabase Dashboard → Authentication → Users

### Error: "connection failed" atau "Tenant or user not found"
- Database credentials salah
- Password database tidak benar
- Host/port salah

### Error: "relation does not exist"
- Tabel belum dibuat
- Jalankan `database/supabase_setup.sql` di Supabase

### Error: "Load failed" di frontend
- Backend tidak running
- CORS error
- Network error
- Cek browser console untuk detail error

## Quick Fix Checklist

- [ ] Backend running di `http://localhost:8000`
- [ ] Database credentials benar di `.env`
- [ ] Tabel sudah dibuat di Supabase
- [ ] Browser console tidak ada error
- [ ] Network request berhasil (status 200)
- [ ] Response dari API valid

