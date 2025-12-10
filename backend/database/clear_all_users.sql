-- ============================================
-- HAPUS SEMUA USER DAN DATA
-- ============================================
-- PERINGATAN: Script ini akan menghapus SEMUA data!
-- Pastikan Anda sudah backup data penting sebelum menjalankan script ini
-- ============================================

-- Hapus semua reminders
DELETE FROM public.reminders;

-- Hapus semua tasks
DELETE FROM public.tasks;

-- Hapus semua courses
DELETE FROM public.courses;

-- Hapus semua audit logs
DELETE FROM public.audit_logs;

-- Hapus semua login logs
DELETE FROM public.login_logs;

-- Hapus semua users dari public.users
DELETE FROM public.users;

-- Hapus semua users dari auth.users (Supabase Auth)
-- PERINGATAN: Ini akan menghapus semua user authentication!
DELETE FROM auth.users;

-- Reset sequences (jika ada)
-- Task priorities dan statuses tidak dihapus karena itu lookup data
-- Tapi bisa di-reset jika perlu:
-- TRUNCATE TABLE public.task_priorities RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE public.task_statuses RESTART IDENTITY CASCADE;

-- Re-insert default data (jika sudah terhapus)
INSERT INTO public.task_statuses (code, label) VALUES 
  ('belum', 'Belum'),
  ('proses', 'Sedang Diproses'),
  ('selesai', 'Selesai')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.task_priorities (code, label) VALUES 
  ('low', 'Rendah'),
  ('medium', 'Sedang'),
  ('high', 'Tinggi')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- SELESAI
-- ============================================
-- Semua user dan data sudah dihapus
-- Database siap untuk data baru
-- ============================================

