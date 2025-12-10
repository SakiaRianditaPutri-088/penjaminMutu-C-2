<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CoursesController;
use App\Http\Controllers\LookupsController;
use App\Http\Controllers\RemindersController;
use App\Http\Controllers\TasksController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Lookups (public)
Route::get('lookups/task-statuses', [LookupsController::class, 'taskStatuses']);
Route::get('lookups/task-priorities', [LookupsController::class, 'taskPriorities']);

// Protected routes (require Supabase JWT)
Route::middleware('supabase.jwt')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });

    // Courses
    Route::apiResource('courses', CoursesController::class);

    // Tasks
    Route::get('courses/{courseId}/tasks', [TasksController::class, 'indexByCourse']);
    Route::post('courses/{courseId}/tasks', [TasksController::class, 'store']);
    Route::get('tasks/{id}', [TasksController::class, 'show']);
    Route::put('tasks/{id}', [TasksController::class, 'update']);
    Route::patch('tasks/{id}', [TasksController::class, 'update']);
    Route::delete('tasks/{id}', [TasksController::class, 'destroy']);

    // Reminders
    Route::get('tasks/{taskId}/reminders', [RemindersController::class, 'indexByTask']);
    Route::post('tasks/{taskId}/reminders', [RemindersController::class, 'store']);
    Route::put('reminders/{id}', [RemindersController::class, 'update']);
    Route::patch('reminders/{id}', [RemindersController::class, 'update']);
    Route::delete('reminders/{id}', [RemindersController::class, 'destroy']);
});

