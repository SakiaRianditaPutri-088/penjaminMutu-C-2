# Cara Mendapatkan Supabase Database Credentials

## Langkah-langkah:

1. **Buka Supabase Dashboard**
   - https://supabase.com/dashboard
   - Login dan pilih project: `ipszvuhzvaslgrggydno`

2. **Buka Settings → Database**
   - Di sidebar kiri, klik **Settings**
   - Pilih **Database**

3. **Copy Connection String**
   - Scroll ke bagian **Connection string**
   - Pilih tab **URI** atau **Connection pooling**
   - Copy connection string yang terlihat seperti:
     ```
     postgresql://postgres.ipszvuhzvaslgrggydno:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
     ```

4. **Atau Ambil Individual Credentials:**
   - **Host:** `aws-0-ap-southeast-1.pooler.supabase.com` (atau host yang tertera)
   - **Port:** `6543` (untuk connection pooling) atau `5432` (direct)
   - **Database:** `postgres`
   - **User:** `postgres.ipszvuhzvaslgrggydno` (atau user yang tertera)
   - **Password:** Password database Anda (bukan anon key!)

5. **Update .env file:**
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
   DB_PORT=6543
   DB_DATABASE=postgres
   DB_USERNAME=postgres.ipszvuhzvaslgrggydno
   DB_PASSWORD=your-database-password-here
   ```

## Catatan Penting:

- **Password database BUKAN anon key atau service_role key!**
- Password database adalah password yang Anda set saat membuat project Supabase
- Jika lupa password, bisa reset di Settings → Database → Reset database password
- Gunakan **Connection pooling** (port 6543) untuk production
- Gunakan **Direct connection** (port 5432) untuk development

## Alternatif: Gunakan Connection String

Jika lebih mudah, bisa langsung pakai connection string:

```env
DATABASE_URL=postgresql://postgres.ipszvuhzvaslgrggydno:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

Laravel akan otomatis parse connection string ini.

