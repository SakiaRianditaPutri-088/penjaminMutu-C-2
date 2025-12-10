-- ============================================
-- HAPUS SEMUA USER SAJA (Data tetap ada)
-- ============================================
-- Script ini hanya menghapus user, tapi data courses/tasks tetap ada
-- Gunakan jika Anda ingin menghapus user tapi tetap data
-- ============================================

-- Hapus semua reminders (karena terkait dengan tasks)
DELETE FROM public.reminders;

-- Hapus semua tasks (karena terkait dengan courses)
DELETE FROM public.tasks;

-- Hapus semua courses (karena terkait dengan users)
DELETE FROM public.courses;

-- Hapus semua audit logs
DELETE FROM public.audit_logs;

-- Hapus semua login logs
DELETE FROM public.login_logs;

-- Hapus semua users dari public.users
DELETE FROM public.users;

-- Hapus semua users dari auth.users (Supabase Auth)
DELETE FROM auth.users;

-- ============================================
-- SELESAI
-- ============================================
-- Semua user sudah dihapus
-- Data lookup (task_statuses, task_priorities) tetap ada
-- ============================================

