-- seed.sql
-- Sample seed data for si_tugas_dashboard (explicit UUIDs used for portability)
-- NOTE: For PostgreSQL, consider replacing DATE_ADD(...) with NOW() + INTERVAL 'X'.

-- Users (explicit UUIDs)
INSERT INTO users (id, full_name, email, password_hash, provider, provider_id, is_active, created_at)
VALUES
('11111111-1111-1111-1111-111111111111', 'Arya Yudhistira', 'arya@example.com', '$2b$12$EXAMPLEHASHFORBCRYPT1234567890abcdef', 'email', NULL, 1, NOW()),
('22222222-2222-2222-2222-222222222222', 'Budi Mahasiswa', 'budi@example.com', NULL, 'facebook', 'fb_22222222', 1, NOW());

-- Courses
INSERT INTO courses (id, title, description, color, owner_id, created_at)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Basis Data', 'Mata kuliah Basis Data - normalisasi, SQL, database design', '#FF6B6B', '11111111-1111-1111-1111-111111111111', NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Pemrograman Web', 'Mata kuliah Pemrograman Web - Next.js dan React', '#4D96FF', '11111111-1111-1111-1111-111111111111', NOW());

-- Tasks (use portable date insert: for Postgres you might need to adjust)
-- We'll use NOW() + INTERVAL where appropriate; for MySQL loaders, DATE_ADD may be accepted.
-- Task 1: 7 days ahead
INSERT INTO tasks (id, course_id, creator_id, title, description, deadline, priority_id, status_id, created_at)
VALUES
('t1-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Tugas Normalisasi', 'Normalisasi database sampai 3NF', NOW() + INTERVAL '7 days', 2, 1, NOW())
ON CONFLICT DO NOTHING;

-- Task 2: 3 days ahead
INSERT INTO tasks (id, course_id, creator_id, title, description, deadline, priority_id, status_id, created_at)
VALUES
('t1-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'CRUD App', 'Buat CRUD untuk tugas dan mata kuliah', NOW() + INTERVAL '3 days', 3, 2, NOW())
ON CONFLICT DO NOTHING;

-- Task 3: 1 day ahead
INSERT INTO tasks (id, course_id, creator_id, title, description, deadline, priority_id, status_id, created_at)
VALUES
('t1-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Deadline Reminder', 'Setting pengingat untuk deadline', NOW() + INTERVAL '1 days', 1, 1, NOW())
ON CONFLICT DO NOTHING;

-- Reminders
INSERT INTO reminders (id, task_id, remind_at, sent, created_at)
VALUES
('r1-0000-0000-0000-000000000001', 't1-0000-0000-0000-000000000003', NOW() + INTERVAL '12 hours', FALSE, NOW())
ON CONFLICT DO NOTHING;

-- Audit logs (sample)
INSERT INTO audit_logs (user_id, action, object_type, object_id, meta, ip_address, created_at)
VALUES
('11111111-1111-1111-1111-111111111111', 'LOGIN_SUCCESS', 'user', '11111111-1111-1111-1111-111111111111', '{"note":"login via email"}', '192.0.2.1', NOW()),
('11111111-1111-1111-1111-111111111111', 'CREATE_COURSE', 'course', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{"title":"Basis Data"}', '192.0.2.1', NOW()),
('11111111-1111-1111-1111-111111111111', 'ADD_TASK', 'task', 't1-0000-0000-0000-000000000001', '{"title":"Tugas Normalisasi"}', '192.0.2.1', NOW());

-- Login logs
INSERT INTO login_logs (user_id, provider, success, ip_address, user_agent, created_at)
VALUES
('11111111-1111-1111-1111-111111111111', 'email', TRUE, '192.0.2.1', 'Seeder/1.0', NOW())
ON CONFLICT DO NOTHING;
