Database integration guide for si-tugas-dashboard
--------------------------------------------------

Project notes:
- The provided web app stores data in browser localStorage (see lib/storage.ts).
- There is no server-side database included in the ZIP.
- Below are recommended database schema and integration steps to add a persistent backend.

Recommended schema:
- users: application users/accounts (matches lib/types.User)
- courses: groups containing tasks (matches lib/types.Course)
- tasks: tasks with deadlines, priority, status (matches lib/types.Task)
- reminders: generated reminders for upcoming deadlines (matches lib/types.Reminder)
- accounts: optional legacy table for imported local accounts
- audit_logs: optional for tracking actions

Integration steps (quick):
1. Choose DBMS (MySQL / PostgreSQL recommended).
2. Create the database and run schema.sql (provided here).
   MySQL example:
     mysql -u root -p < schema.sql
3. Add server backend:
   - Create a simple Node/Express or Next.js API route that exposes CRUD endpoints for users, courses, tasks, reminders.
   - Use an ORM (Prisma recommended) or query builder.
4. Update front-end:
   - Replace localStorage calls in lib/storage.ts with API calls.
   - Keep a client cache or use SWR/react-query to fetch data.
5. Authentication:
   - Implement JWT or session-based auth. Store JWT in secure httpOnly cookie.
6. Reminders:
   - Use a background job (cron or serverless scheduler) to create & send reminders before deadlines.

Backup & Restore:
- MySQL dump:
  mysqldump -u [user] -p --databases si_tugas_dashboard > backup.sql
- Restore:
  mysql -u [user] -p < backup.sql
- Automate backups to remote storage and encrypt backups.

Security checklist:
- Do not commit DB credentials to git. Use .env and secret manager.
- Use prepared statements / ORM to avoid SQL injection.
- Use TLS for DB connections and migrate DB to private network.
- Hash passwords (bcrypt/argon2).
- Enforce least privilege for DB accounts.

If you want, I can:
- Generate a Prisma schema and sample Next.js API routes.
- Modify project files to add server-side API routes and replace localStorage with API calls.
- Create migration files or seed data.

What I already created:
- schema.sql (MySQL-ready)
- README (this file)

Next actions I can perform now without waiting:
- Add Prisma schema and example API (TypeScript).
- Create a ZIP with schema.sql and README for download.

Tell me which of the next actions you want me to do now (I will produce files immediately): 
A) Create Prisma schema + example Next.js API endpoints.
B) Create a downloadable ZIP with schema.sql and README (already created).
C) Modify project to add server API and update storage.ts to use API calls (I will generate the patch files).
D) Any combination of the above.
