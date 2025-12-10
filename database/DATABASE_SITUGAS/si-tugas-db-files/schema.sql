-- schema.sql for si_tugas_dashboard (MySQL)
CREATE DATABASE IF NOT EXISTS si_tugas_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE si_tugas_dashboard;

-- roles (if you want role-based access)
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users (accounts)
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(150),
  provider ENUM('email','facebook','google') DEFAULT 'email',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  role_id INT DEFAULT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- courses (projects or course groups that contain tasks)
CREATE TABLE courses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(20),
  owner_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- tasks
CREATE TABLE tasks (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36),
  creator_id VARCHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deadline DATETIME NOT NULL,
  priority ENUM('low','medium','high') DEFAULT 'medium',
  status ENUM('belum','proses','selesai') DEFAULT 'belum',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- reminders (for notifying about approaching deadlines)
CREATE TABLE reminders (
  id VARCHAR(36) PRIMARY KEY,
  task_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36),
  task_title VARCHAR(255),
  deadline DATETIME,
  notified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- optionally store local "accounts" (legacy from app storage)
CREATE TABLE accounts (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(150),
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- audit logs (for activity tracking)
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(255),
  object_type VARCHAR(100),
  object_id VARCHAR(100),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_course ON tasks(course_id);
CREATE INDEX idx_reminders_task ON reminders(task_id);
