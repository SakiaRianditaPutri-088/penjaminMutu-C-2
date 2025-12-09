-- schema-mysql.sql
-- MySQL schema for si_tugas_dashboard (includes audit logs, login logs, sessions)
CREATE DATABASE IF NOT EXISTS si_tugas_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE si_tugas_dashboard;

-- users
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  provider ENUM('email','facebook','google') DEFAULT 'email',
  provider_id VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL
);

-- courses
CREATE TABLE courses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(20),
  owner_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- task_statuses
CREATE TABLE task_statuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);
INSERT INTO task_statuses (code,label) VALUES ('belum','Belum'),('proses','Sedang Diproses'),('selesai','Selesai');

-- task_priorities
CREATE TABLE task_priorities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);
INSERT INTO task_priorities (code,label) VALUES ('low','Rendah'),('medium','Sedang'),('high','Tinggi');

-- tasks
CREATE TABLE tasks (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  creator_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deadline DATETIME NOT NULL,
  priority_id INT DEFAULT NULL,
  status_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (priority_id) REFERENCES task_priorities(id),
  FOREIGN KEY (status_id) REFERENCES task_statuses(id)
);

-- reminders
CREATE TABLE reminders (
  id VARCHAR(36) PRIMARY KEY,
  task_id VARCHAR(36) NOT NULL,
  remind_at DATETIME NOT NULL,
  sent TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- audit_logs
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(255),
  object_type VARCHAR(100),
  object_id VARCHAR(100),
  meta JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- login_logs
CREATE TABLE login_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  provider VARCHAR(50),
  success TINYINT(1),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- sessions (short-lived session records, optional)
CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_course ON tasks(course_id);
CREATE INDEX idx_tasks_status ON tasks(status_id);
CREATE INDEX idx_users_email ON users(email);
