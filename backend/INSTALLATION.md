# Installation Guide

## Prerequisites

- PHP >= 8.2
- Composer
- MySQL >= 8.0
- Supabase Account & Project

## Step-by-Step Installation

### 1. Install Dependencies

```bash
cd backend
composer install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=si_tugas
DB_USERNAME=root
DB_PASSWORD=your_password

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/jwks
SUPABASE_ANON_KEY=your-anon-key

# CORS (adjust for your frontend URL)
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Create Database

Create a MySQL database:

```sql
CREATE DATABASE si_tugas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Run Migrations

```bash
php artisan migrate
```

### 6. Seed Database

```bash
php artisan db:seed
```

This will populate:
- Task Statuses (belum, proses, selesai)
- Task Priorities (low, medium, high)

### 7. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## Testing the API

### Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `access_token` from the response.

### Get Current User

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Supabase Issues

- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Ensure service role key has admin permissions

### CORS Issues

- Add your frontend URL to `CORS_ALLOWED_ORIGINS` in `.env`
- Clear config cache: `php artisan config:clear`

## Production Deployment

1. Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`
2. Run `php artisan config:cache`
3. Run `php artisan route:cache`
4. Configure web server (Nginx/Apache) to point to `public/` directory
5. Set up SSL/HTTPS
6. Configure queue workers if using background jobs

