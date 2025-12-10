# API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

All protected endpoints require a Supabase JWT token in the Authorization header:
```
Authorization: Bearer <supabase_access_token>
```

## Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "access_token": "supabase_jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "provider": "email",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Courses

#### List Courses
```http
GET /api/courses
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Mathematics",
    "description": "Math course",
    "color": "#FF5733",
    "owner_id": "uuid",
    "tasks_count": 5,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
]
```

#### Create Course
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mathematics",
  "description": "Math course",
  "color": "#FF5733"
}
```

#### Get Course
```http
GET /api/courses/{id}
Authorization: Bearer <token>
```

**Response includes tasks:**
```json
{
  "id": "uuid",
  "title": "Mathematics",
  "description": "Math course",
  "color": "#FF5733",
  "owner_id": "uuid",
  "tasks": [
    {
      "id": "uuid",
      "title": "Assignment 1",
      "description": "Complete chapter 1",
      "deadline": "2024-01-15T00:00:00.000000Z",
      "priority": {
        "id": 1,
        "code": "high",
        "label": "Tinggi"
      },
      "status": {
        "id": 1,
        "code": "belum",
        "label": "Belum"
      }
    }
  ],
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

#### Update Course
```http
PUT /api/courses/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "color": "#33FF57"
}
```

#### Delete Course
```http
DELETE /api/courses/{id}
Authorization: Bearer <token>
```

### Tasks

#### List Tasks by Course
```http
GET /api/courses/{courseId}/tasks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "course_id": "uuid",
    "creator_id": "uuid",
    "title": "Assignment 1",
    "description": "Complete chapter 1",
    "deadline": "2024-01-15T00:00:00.000000Z",
    "priority_id": 3,
    "status_id": 1,
    "priority": {
      "id": 3,
      "code": "high",
      "label": "Tinggi"
    },
    "status": {
      "id": 1,
      "code": "belum",
      "label": "Belum"
    },
    "reminders": [],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
]
```

#### Create Task
```http
POST /api/courses/{courseId}/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Assignment 1",
  "description": "Complete chapter 1",
  "deadline": "2024-01-15T00:00:00Z",
  "priority_code": "high",
  "status_code": "belum"
}
```

**Priority codes:** `low`, `medium`, `high`  
**Status codes:** `belum`, `proses`, `selesai`

#### Get Task
```http
GET /api/tasks/{id}
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/tasks/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "deadline": "2024-01-20T00:00:00Z",
  "priority_code": "medium",
  "status_code": "proses"
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
Authorization: Bearer <token>
```

### Reminders

#### List Reminders by Task
```http
GET /api/tasks/{taskId}/reminders
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "task_id": "uuid",
    "remind_at": "2024-01-14T10:00:00.000000Z",
    "sent": false,
    "created_at": "2024-01-01T00:00:00.000000Z"
  }
]
```

#### Create Reminder
```http
POST /api/tasks/{taskId}/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "remind_at": "2024-01-14T10:00:00Z"
}
```

#### Update Reminder
```http
PUT /api/reminders/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "remind_at": "2024-01-14T11:00:00Z",
  "sent": true
}
```

#### Delete Reminder
```http
DELETE /api/reminders/{id}
Authorization: Bearer <token>
```

### Lookups

#### Get Task Statuses
```http
GET /api/lookups/task-statuses
```

**Response:**
```json
[
  {
    "id": 1,
    "code": "belum",
    "label": "Belum"
  },
  {
    "id": 2,
    "code": "proses",
    "label": "Sedang Diproses"
  },
  {
    "id": 3,
    "code": "selesai",
    "label": "Selesai"
  }
]
```

#### Get Task Priorities
```http
GET /api/lookups/task-priorities
```

**Response:**
```json
[
  {
    "id": 1,
    "code": "low",
    "label": "Rendah"
  },
  {
    "id": 2,
    "code": "medium",
    "label": "Sedang"
  },
  {
    "id": 3,
    "code": "high",
    "label": "Tinggi"
  }
]
```

## Error Responses

All errors follow this format:

```json
{
  "message": "Error message",
  "error": "Detailed error (only in debug mode)",
  "trace": "Stack trace (only in debug mode)"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

