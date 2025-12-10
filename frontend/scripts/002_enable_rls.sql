-- Enable Row Level Security on all tables

-- Users table RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Courses table RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view courses they own"
  ON courses FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Allow users to insert their own courses"
  ON courses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Allow users to update their own courses"
  ON courses FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Allow users to delete their own courses"
  ON courses FOR DELETE
  USING (auth.uid() = owner_id);

-- Tasks table RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view tasks in their courses"
  ON tasks FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM courses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to insert tasks in their courses"
  ON tasks FOR INSERT
  WITH CHECK (
    course_id IN (
      SELECT id FROM courses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to update tasks in their courses"
  ON tasks FOR UPDATE
  USING (
    course_id IN (
      SELECT id FROM courses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to delete tasks in their courses"
  ON tasks FOR DELETE
  USING (
    course_id IN (
      SELECT id FROM courses WHERE owner_id = auth.uid()
    )
  );

-- Reminders table RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view reminders for their tasks"
  ON reminders FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks WHERE course_id IN (
        SELECT id FROM courses WHERE owner_id = auth.uid()
      )
    )
  );

-- Audit logs table RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Login logs table RLS
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own login logs"
  ON login_logs FOR SELECT
  USING (auth.uid() = user_id);
