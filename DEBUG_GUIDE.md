# Debug Guide - "Load failed" Error

## Langkah Debugging

### 1. Cek Browser Console

Buka browser DevTools (F12) → **Console** tab, lalu coba register lagi. Lihat:
- Error message yang muncul
- Log dari `api-client.ts` (harusnya ada "API Request", "API Response", dll)

### 2. Cek Network Tab

Buka browser DevTools → **Network** tab:
1. Filter: XHR atau Fetch
2. Coba register lagi
3. Klik request ke `/api/auth/register`
4. Lihat:
   - **Status Code** (harusnya 200 atau 400/500 jika error)
   - **Response** tab - lihat response body
   - **Headers** tab - cek CORS headers

### 3. Test API Manual

```bash
cd backend
./test-api.sh
```

Atau manual:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "full_name": "New User"
  }'
```

### 4. Cek Backend Logs

```bash
cd backend
tail -f storage/logs/laravel.log
```

Lalu coba register lagi, lihat error yang muncul.

### 5. Cek Environment Variables

**Frontend:**
```bash
cat .env.local
# Harus ada: NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend:**
```bash
cd backend
cat .env | grep DB_
# Cek database credentials
```

### 6. Common Issues & Solutions

#### Issue: "Load failed" tanpa error detail
**Solution:** 
- Buka browser console, lihat error detail
- Cek Network tab untuk response actual
- Pastikan backend running

#### Issue: CORS error
**Solution:**
- Pastikan `CORS_ALLOWED_ORIGINS` di backend `.env` include `http://localhost:3000`
- Restart backend setelah update `.env`

#### Issue: "Email address is invalid"
**Solution:**
- Email mungkin sudah terdaftar di Supabase
- Cek Supabase Dashboard → Authentication → Users
- Gunakan email yang berbeda atau login dengan email yang sudah ada

#### Issue: Database connection error
**Solution:**
- Update `DB_PASSWORD` di backend `.env`
- Test connection: `php artisan tinker` lalu `DB::connection()->getPdo()`

#### Issue: Network error / Failed to fetch
**Solution:**
- Pastikan backend running: `php artisan serve`
- Cek URL di `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
- Restart Next.js dev server setelah update `.env.local`

## Quick Test

1. **Test Backend:**
   ```bash
   curl http://localhost:8000/api/lookups/task-statuses
   # Harusnya return JSON dengan task statuses
   ```

2. **Test Frontend Connection:**
   - Buka browser console
   - Ketik: `fetch('http://localhost:8000/api/lookups/task-statuses').then(r => r.json()).then(console.log)`
   - Harusnya return data tanpa error

3. **Test Register:**
   - Gunakan email yang BELUM pernah terdaftar
   - Pastikan password minimal 6 karakter
   - Lihat error message di form (bukan "Load failed")

## Expected Behavior

Setelah perbaikan:
- ✅ Error message jelas (bukan "Load failed")
- ✅ Console log menunjukkan request/response detail
- ✅ Network tab menunjukkan status code dan response
- ✅ Data tersimpan di Supabase jika berhasil

