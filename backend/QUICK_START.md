# Quick Start Guide

## Setup Cepat untuk Supabase Database

### 1. Install Dependencies

```bash
cd backend
composer install
```

### 2. Pastikan PostgreSQL Extension Terinstall

```bash
# Check apakah pgsql extension sudah terinstall
php -m | grep pgsql

# Jika belum, install:
# macOS:
brew install php-pgsql

# Ubuntu/Debian:
sudo apt-get install php-pgsql

# Atau via PECL:
pecl install pgsql
```

### 3. Setup Environment

File `.env` sudah dibuat. Update database credentials:

```bash
# Edit .env dan update:
DB_PASSWORD=your-supabase-database-password
```

**Cara dapatkan password:**
1. Buka Supabase Dashboard → Settings → Database
2. Copy password database (bukan anon key!)
3. Atau reset password jika lupa

### 4. Setup Database di Supabase

1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `database/supabase_setup.sql`
3. Paste dan Run
4. Verifikasi tabel sudah dibuat

### 5. Hapus User Lama (Opsional)

Jika ingin hapus semua user yang ada:

1. Buka Supabase SQL Editor
2. Copy isi `database/clear_all_users.sql`
3. Paste dan Run

### 6. Generate App Key

```bash
php artisan key:generate
```

### 7. Test Connection

```bash
php artisan tinker
```

```php
DB::connection()->getPdo();
// Harusnya return PDO tanpa error
```

### 8. Start Server

```bash
php artisan serve
```

### 9. Test API

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

## Verifikasi Data di Supabase

1. Buka Supabase Dashboard → Table Editor
2. Cek tabel `users` - harus ada user baru
3. Create course via API, cek tabel `courses`
4. Create task via API, cek tabel `tasks`

## Troubleshooting

### Error: "could not find driver"
- Install PostgreSQL extension: `pecl install pgsql`
- Enable di php.ini: `extension=pgsql`

### Error: "password authentication failed"
- Pastikan password database benar (bukan anon key!)
- Reset password di Supabase Dashboard jika perlu

### Error: "relation does not exist"
- Pastikan SQL script `supabase_setup.sql` sudah dijalankan
- Cek di Supabase Table Editor apakah tabel sudah ada

