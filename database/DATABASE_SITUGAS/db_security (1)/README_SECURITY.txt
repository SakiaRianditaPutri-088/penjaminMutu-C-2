
SI TUGAS DASHBOARD — DATABASE SECURITY GUIDE
============================================

File ini berisi konfigurasi keamanan database untuk MySQL dan PostgreSQL.

Langkah-langkah penggunaan:

1️⃣ Jalankan bagian MySQL atau PostgreSQL sesuai database kamu.
   mysql -u root -p < db_security.sql
   atau
   psql -U postgres -f db_security.sql

2️⃣ Setelah dijalankan:
   - Akan terbentuk user baru: admin_user, app_user, report_user
   - Setiap user punya hak akses berbeda (principle of least privilege)
   - Logging aktivitas diaktifkan untuk audit keamanan

3️⃣ Tambahkan SSL/TLS di konfigurasi DB agar koneksi terenkripsi.

4️⃣ Simpan file `.env` aplikasi secara aman, contoh:
   DATABASE_URL=mysql://app_user:AppPass_123!@localhost:3306/si_tugas_dashboard
   atau
   DATABASE_URL=postgresql://app_user:AppPass_123!@localhost:5432/si_tugas_dashboard

Dibuat oleh: Database Developer
Tanggal: 2025-11-04
