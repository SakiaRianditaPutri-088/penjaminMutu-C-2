# Migrasi ke Supabase Database

## Overview

Backend sekarang menggunakan **Supabase PostgreSQL** sebagai database utama. Semua data (users, courses, tasks, dll) disimpan langsung di Supabase, bukan MySQL lokal.

## Perubahan yang Dilakukan

### 1. Database Connection
- ✅ Dari MySQL → PostgreSQL (Supabase)
- ✅ Semua data langsung ke Supabase
- ✅ Tidak perlu MySQL lokal lagi

### 2. Konfigurasi
- ✅ `config/database.php` sudah diupdate untuk PostgreSQL
- ✅ Default connection: `pgsql`
- ✅ Connection pooling support

### 3. Models & Migrations
- ✅ Semua models sudah kompatibel dengan PostgreSQL
- ✅ UUID support (native di PostgreSQL)
- ✅ Migrations tetap bisa digunakan (tapi tabel sudah dibuat via SQL script)

## Setup Database

### Langkah 1: Dapatkan Database Credentials

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project: `ipszvuhzvaslgrggydno`
3. Settings → Database
4. Copy connection string atau individual credentials
5. Lihat `GET_SUPABASE_DB_CREDENTIALS.md` untuk detail

### Langkah 2: Update .env

```env
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.ipszvuhzvaslgrggydno
DB_PASSWORD=your-password-here
```

### Langkah 3: Jalankan SQL Script

1. Buka Supabase SQL Editor
2. Copy isi `database/supabase_setup.sql`
3. Paste dan Run
4. Verifikasi tabel sudah dibuat

### Langkah 4: Hapus User Lama (Jika Perlu)

Jika ingin menghapus semua user yang ada:

1. Buka Supabase SQL Editor
2. Copy isi `database/clear_all_users.sql` (hapus semua)
   - ATAU `database/clear_users_only.sql` (hapus user saja, data tetap)
3. Paste dan Run

## Testing

### Test Database Connection

```bash
cd backend
php artisan tinker
```

```php
DB::connection()->getPdo();
// Harusnya return PDO connection tanpa error

DB::table('users')->count();
// Test query
```

### Test API

```bash
# Register user baru
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Verifikasi Data di Supabase

1. Buka Supabase Dashboard → Table Editor
2. Cek tabel `users` - harus ada user baru yang register
3. Cek tabel `courses` - saat create course, harus muncul di sini
4. Cek tabel `tasks` - saat create task, harus muncul di sini

## Troubleshooting

### Error: "could not connect to server"
- Pastikan DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD benar
- Pastikan password database benar (bukan anon key!)
- Cek apakah Supabase project aktif

### Error: "relation does not exist"
- Pastikan SQL script `supabase_setup.sql` sudah dijalankan
- Pastikan tabel dibuat di schema `public`

### Error: "password authentication failed"
- Pastikan password database benar
- Bisa reset password di Supabase Dashboard → Settings → Database

## Keuntungan Menggunakan Supabase

✅ **Cloud Database** - Tidak perlu setup MySQL lokal
✅ **Automatic Backups** - Supabase otomatis backup
✅ **Row Level Security** - Security built-in
✅ **Real-time** - Bisa extend untuk real-time features
✅ **Scalable** - Auto-scaling
✅ **Free Tier** - Cukup untuk development

## Catatan Penting

⚠️ **Password Database ≠ Anon Key**
- Password database adalah password PostgreSQL
- Anon key adalah untuk API authentication
- Jangan tertukar!

⚠️ **Backup Data**
- Sebelum hapus user, pastikan backup data penting
- Supabase punya automatic backup, tapi lebih baik manual backup juga

⚠️ **RLS Policies**
- Row Level Security sudah aktif
- User hanya bisa akses data mereka sendiri
- Jangan disable RLS tanpa alasan yang jelas

