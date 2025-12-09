si-tugas-dashboard - dual DB package (MySQL & PostgreSQL)
==========================================================

This bundle contains database schemas and seed data for the "si-tugas-dashboard" task-management app.

Included files:
- schema-mysql.sql
- schema-postgresql.sql
- seed.sql
- diagram-ERD.png

Quick start (MySQL)
-------------------
1. Run:
   mysql -u root -p < schema-mysql.sql
2. Seed:
   mysql -u root -p si_tugas_dashboard < seed.sql

Quick start (PostgreSQL)
------------------------
1. Create extension (if not exists):
   psql -U postgres -c "CREATE EXTENSION IF NOT EXISTS "uuid-ossp";"
2. Create a database (if you prefer to create manually) and then run schema file:
   psql -U postgres -f schema-postgresql.sql
3. Seed:
   psql -U postgres -d si_tugas_dashboard -f seed.sql

Notes
-----
- seed.sql uses explicit UUIDs and PostgreSQL-style INTERVAL expressions. If your MySQL import doesn't accept INTERVAL with quotes, adjust the seed file by replacing NOW() + INTERVAL '7 days' with DATE_ADD(NOW(), INTERVAL 7 DAY), etc.
- Password hashes in seed are placeholders — replace with real bcrypt hashes before production.
- Audit logs capture actions: LOGIN_SUCCESS, CREATE_COURSE, ADD_TASK, UPDATE_STATUS, DELETE_TASK, etc.

If you want, I can produce:
- A Postgres-adapted seed file (seed-postgres.sql) with pure Postgres syntax.
- Prisma schema and sample API routes wired to this schema.

