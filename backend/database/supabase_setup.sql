-- ============================================
-- SI TUGAS - SUPABASE DATABASE SETUP
-- ============================================
-- Copy and paste this entire script into Supabase SQL Editor
-- Make sure you're in the correct database/schema
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CREATE USERS TABLE
-- ============================================
-- This table extends Supabase auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  provider TEXT DEFAULT 'email',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT users_email_unique UNIQUE(email)
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================
-- 2. CREATE TASK PRIORITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.task_priorities (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);

-- ============================================
-- 3. CREATE TASK STATUSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.task_statuses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);

-- ============================================
-- 4. CREATE COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  color VARCHAR(20),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index on owner_id for faster queries
CREATE INDEX IF NOT EXISTS idx_courses_owner ON public.courses(owner_id);

-- ============================================
-- 5. CREATE TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  priority_id INT DEFAULT NULL REFERENCES public.task_priorities(id) ON DELETE SET NULL,
  status_id INT NOT NULL REFERENCES public.task_statuses(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON public.tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_course ON public.tasks(course_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status_id);
CREATE INDEX IF NOT EXISTS idx_tasks_creator ON public.tasks(creator_id);

-- ============================================
-- 6. CREATE REMINDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on task_id and remind_at for faster queries
CREATE INDEX IF NOT EXISTS idx_reminders_task ON public.reminders(task_id);
CREATE INDEX IF NOT EXISTS idx_reminders_remind_at ON public.reminders(remind_at);
CREATE INDEX IF NOT EXISTS idx_reminders_sent ON public.reminders(sent) WHERE sent = FALSE;

-- ============================================
-- 7. CREATE AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  object_type TEXT,
  object_id TEXT,
  meta JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id and created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_object ON public.audit_logs(object_type, object_id);

-- ============================================
-- 8. CREATE LOGIN LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.login_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  provider TEXT,
  success BOOLEAN,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id and created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_login_logs_user ON public.login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON public.login_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_login_logs_success ON public.login_logs(success);

-- ============================================
-- 9. INSERT DEFAULT DATA
-- ============================================

-- Insert default task statuses
INSERT INTO public.task_statuses (code, label) VALUES 
  ('belum', 'Belum'),
  ('proses', 'Sedang Diproses'),
  ('selesai', 'Selesai')
ON CONFLICT (code) DO NOTHING;

-- Insert default task priorities
INSERT INTO public.task_priorities (code, label) VALUES 
  ('low', 'Rendah'),
  ('medium', 'Sedang'),
  ('high', 'Tinggi')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 10. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 11. CREATE RLS POLICIES
-- ============================================

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Courses table policies
DROP POLICY IF EXISTS "Users can view their own courses" ON public.courses;
CREATE POLICY "Users can view their own courses"
  ON public.courses FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert their own courses" ON public.courses;
CREATE POLICY "Users can insert their own courses"
  ON public.courses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update their own courses" ON public.courses;
CREATE POLICY "Users can update their own courses"
  ON public.courses FOR UPDATE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete their own courses" ON public.courses;
CREATE POLICY "Users can delete their own courses"
  ON public.courses FOR DELETE
  USING (auth.uid() = owner_id);

-- Tasks table policies
DROP POLICY IF EXISTS "Users can view tasks in their courses" ON public.tasks;
CREATE POLICY "Users can view tasks in their courses"
  ON public.tasks FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM public.courses WHERE owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert tasks in their courses" ON public.tasks;
CREATE POLICY "Users can insert tasks in their courses"
  ON public.tasks FOR INSERT
  WITH CHECK (
    course_id IN (
      SELECT id FROM public.courses WHERE owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tasks in their courses" ON public.tasks;
CREATE POLICY "Users can update tasks in their courses"
  ON public.tasks FOR UPDATE
  USING (
    course_id IN (
      SELECT id FROM public.courses WHERE owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete tasks in their courses" ON public.tasks;
CREATE POLICY "Users can delete tasks in their courses"
  ON public.tasks FOR DELETE
  USING (
    course_id IN (
      SELECT id FROM public.courses WHERE owner_id = auth.uid()
    )
  );

-- Reminders table policies
DROP POLICY IF EXISTS "Users can view reminders for their tasks" ON public.reminders;
CREATE POLICY "Users can view reminders for their tasks"
  ON public.reminders FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM public.tasks WHERE course_id IN (
        SELECT id FROM public.courses WHERE owner_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can insert reminders for their tasks" ON public.reminders;
CREATE POLICY "Users can insert reminders for their tasks"
  ON public.reminders FOR INSERT
  WITH CHECK (
    task_id IN (
      SELECT id FROM public.tasks WHERE course_id IN (
        SELECT id FROM public.courses WHERE owner_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can update reminders for their tasks" ON public.reminders;
CREATE POLICY "Users can update reminders for their tasks"
  ON public.reminders FOR UPDATE
  USING (
    task_id IN (
      SELECT id FROM public.tasks WHERE course_id IN (
        SELECT id FROM public.courses WHERE owner_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can delete reminders for their tasks" ON public.reminders;
CREATE POLICY "Users can delete reminders for their tasks"
  ON public.reminders FOR DELETE
  USING (
    task_id IN (
      SELECT id FROM public.tasks WHERE course_id IN (
        SELECT id FROM public.courses WHERE owner_id = auth.uid()
      )
    )
  );

-- Audit logs table policies
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Login logs table policies
DROP POLICY IF EXISTS "Users can view their own login logs" ON public.login_logs;
CREATE POLICY "Users can view their own login logs"
  ON public.login_logs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 12. CREATE TRIGGER FOR AUTO-CREATE USER PROFILE
-- ============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name);
  RETURN new;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 13. CREATE FUNCTION FOR UPDATED_AT TIMESTAMP
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on tables that need it
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready to use.
-- 
-- Next steps:
-- 1. Update your Laravel .env file with Supabase credentials
-- 2. Test the connection
-- 3. Start using the API
-- ============================================

