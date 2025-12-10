# Si Tugas Backend API

Laravel 11 API backend untuk aplikasi Si Tugas dengan integrasi Supabase untuk authentication.

## Requirements

- PHP >= 8.2
- Composer
- Supabase Project (PostgreSQL database)
- PostgreSQL extension untuk PHP (pgsql)

## Installation

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Configure `.env` file dengan Supabase database credentials:

**PENTING:** Semua data disimpan di Supabase PostgreSQL, bukan MySQL lokal!

Lihat file `GET_SUPABASE_DB_CREDENTIALS.md` untuk cara mendapatkan credentials.

```env
# Database Connection (Supabase PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.ipszvuhzvaslgrggydno
DB_PASSWORD=your-database-password-here

# Atau gunakan connection string langsung:
# DATABASE_URL=postgresql://postgres.ipszvuhzvaslgrggydno:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Catatan:** 
- Supabase configuration sudah otomatis dikonfigurasi di `config/supabase.php`
- Anon key sudah di-set default
- **Service Role Key TIDAK diperlukan** - backend menggunakan public signup endpoint
- **Password database BUKAN anon key!** Ini adalah password database PostgreSQL Anda

5. **Jalankan SQL Script di Supabase:**
   - Buka Supabase Dashboard → SQL Editor
   - Copy isi file `database/supabase_setup.sql`
   - Paste dan Run di SQL Editor
   - Script ini akan membuat semua tabel di Supabase

6. **Hapus User Lama (Opsional):**
   - Jika ingin menghapus semua user yang ada, jalankan `database/clear_all_users.sql` di Supabase SQL Editor
   - Atau `database/clear_users_only.sql` jika hanya ingin hapus user saja

7. **Test Connection:**
```bash
php artisan migrate:status
# Harusnya tidak ada error jika connection berhasil
```

7. Start server:
```bash
php artisan serve
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### Courses
- `GET /api/courses` - Get all courses (requires auth)
- `POST /api/courses` - Create course (requires auth)
- `GET /api/courses/{id}` - Get course (requires auth)
- `PUT /api/courses/{id}` - Update course (requires auth)
- `DELETE /api/courses/{id}` - Delete course (requires auth)

### Tasks
- `GET /api/courses/{courseId}/tasks` - Get tasks by course (requires auth)
- `POST /api/courses/{courseId}/tasks` - Create task (requires auth)
- `GET /api/tasks/{id}` - Get task (requires auth)
- `PUT /api/tasks/{id}` - Update task (requires auth)
- `DELETE /api/tasks/{id}` - Delete task (requires auth)

### Reminders
- `GET /api/tasks/{taskId}/reminders` - Get reminders by task (requires auth)
- `POST /api/tasks/{taskId}/reminders` - Create reminder (requires auth)
- `PUT /api/reminders/{id}` - Update reminder (requires auth)
- `DELETE /api/reminders/{id}` - Delete reminder (requires auth)

### Lookups
- `GET /api/lookups/task-statuses` - Get task statuses
- `GET /api/lookups/task-priorities` - Get task priorities

## Authentication

API menggunakan Supabase JWT tokens. Setiap request yang memerlukan authentication harus menyertakan header:
```
Authorization: Bearer <supabase_access_token>
```

## License

MIT

