# Supabase Setup Guide

## Quick Setup

### 1. Copy SQL Script

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda: `ipszvuhzvaslgrggydno`
3. Buka **SQL Editor** di sidebar kiri
4. Buka file `database/supabase_setup.sql` di folder backend
5. **Copy seluruh isi file** dan paste ke SQL Editor
6. Klik **Run** untuk menjalankan script

### 2. Configure Environment (Optional)

**Service Role Key TIDAK diperlukan lagi!** 

Backend sekarang menggunakan public signup endpoint yang hanya memerlukan anon key. Anon key sudah dikonfigurasi di `config/supabase.php`.

Jika Anda ingin menggunakan service_role key untuk operasi admin (opsional), Anda bisa menambahkannya di `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Tapi untuk operasi normal (register, login, verify token), **anon key sudah cukup**.

### 3. Verify Setup

Setelah menjalankan SQL script, verifikasi dengan:

1. Buka **Table Editor** di Supabase Dashboard
2. Pastikan tabel-tabel berikut sudah ada:
   - ✅ `users`
   - ✅ `courses`
   - ✅ `tasks`
   - ✅ `task_priorities`
   - ✅ `task_statuses`
   - ✅ `reminders`
   - ✅ `audit_logs`
   - ✅ `login_logs`

3. Buka tabel `task_statuses` dan `task_priorities`, pastikan sudah ada data:
   - Task Statuses: belum, proses, selesai
   - Task Priorities: low, medium, high

## Database Structure

### Tables Created

1. **users** - User profiles (extends auth.users)
2. **courses** - Course/mata kuliah data
3. **tasks** - Task/assignment data
4. **task_priorities** - Priority lookup (low, medium, high)
5. **task_statuses** - Status lookup (belum, proses, selesai)
6. **reminders** - Reminder notifications
7. **audit_logs** - Activity logging
8. **login_logs** - Login attempt logging

### Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies ensure users can only access their own data
- ✅ Automatic user profile creation on signup
- ✅ Automatic updated_at timestamp updates

## Testing Connection

Setelah setup selesai, test koneksi dengan:

```bash
cd backend
php artisan tinker
```

Lalu test:
```php
config('supabase.url')
// Should return: https://ipszvuhzvaslgrggydno.supabase.co
```

## Troubleshooting

### Error: "relation does not exist"
- Pastikan script dijalankan di schema `public`
- Pastikan semua tabel dibuat dengan prefix `public.`

### Error: "permission denied"
- Pastikan anon key sudah benar di config
- Anon key sudah dikonfigurasi otomatis, tidak perlu service_role key

### RLS Policies Not Working
- Pastikan user sudah login melalui Supabase Auth
- Pastikan token JWT valid
- Check di Supabase Dashboard → Authentication → Users

## Next Steps

1. ✅ Database setup (sudah selesai)
2. ✅ Supabase config (sudah otomatis - tidak perlu service_role key)
3. ⏭️ Test API endpoints
4. ⏭️ Integrate dengan frontend

