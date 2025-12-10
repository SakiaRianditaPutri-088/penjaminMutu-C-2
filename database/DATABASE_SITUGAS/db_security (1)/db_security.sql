
-- ============================================
-- 🔒 DATABASE SECURITY SCRIPT
-- Project: SI TUGAS DASHBOARD
-- Database: MySQL & PostgreSQL
-- ============================================

/* =====================
   MYSQL SECURITY SETUP
   ===================== */
-- 1. Buat user aman dan role access
CREATE USER 'admin_user'@'localhost' IDENTIFIED BY 'AdminPass_123!';
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'AppPass_123!';
CREATE USER 'report_user'@'localhost' IDENTIFIED BY 'ReportPass_123!';

-- 2. Beri hak akses sesuai role
GRANT ALL PRIVILEGES ON si_tugas_dashboard.* TO 'admin_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON si_tugas_dashboard.* TO 'app_user'@'localhost';
GRANT SELECT ON si_tugas_dashboard.* TO 'report_user'@'localhost';
FLUSH PRIVILEGES;

-- 3. Aktifkan general log untuk audit
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';

-- 4. Pastikan koneksi SSL aktif (tambahkan di my.cnf)
-- [mysqld]
-- require_secure_transport = ON

-- 5. Buat tabel log untuk aktivitas pengguna
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- POSTGRESQL SECURITY SETUP
-- =====================
-- 1. Buat role dan user
CREATE ROLE admin_user WITH LOGIN PASSWORD 'AdminPass_123!';
CREATE ROLE app_user WITH LOGIN PASSWORD 'AppPass_123!';
CREATE ROLE report_user WITH LOGIN PASSWORD 'ReportPass_123!';

-- 2. Grant hak akses
GRANT ALL PRIVILEGES ON DATABASE si_tugas_dashboard TO admin_user;
GRANT CONNECT ON DATABASE si_tugas_dashboard TO app_user;
GRANT CONNECT ON DATABASE si_tugas_dashboard TO report_user;

-- Beri izin sesuai schema public
\c si_tugas_dashboard;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO report_user;

-- 3. Audit log (aktifkan di postgresql.conf)
-- logging_collector = on
-- log_statement = 'all'

-- 4. SSL (aktifkan di pg_hba.conf)
-- hostssl all all 0.0.0.0/0 md5

-- 5. Tabel log untuk mencatat aktivitas
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- END OF SECURITY SCRIPT
-- ============================================
