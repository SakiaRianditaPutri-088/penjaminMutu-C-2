<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Course;
use App\Models\Task;
use App\Models\TaskPriority;
use App\Models\TaskStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TasksController extends Controller
{
    public function indexByCourse(Request $request, string $courseId): JsonResponse
    {
        $user = $request->user();

        // Verify course ownership
        $course = Course::where('id', $courseId)
            ->where('owner_id', $user->id)
            ->firstOrFail();

        $tasks = Task::where('course_id', $courseId)
            ->with(['priority', 'status', 'reminders'])
            ->orderBy('deadline', 'asc')
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request, string $courseId): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'required|date',
            'priority_code' => 'nullable|string|in:low,medium,high',
            'status_code' => 'required|string|in:belum,proses,selesai',
        ]);

        $user = $request->user();

        // Verify course ownership
        $course = Course::where('id', $courseId)
            ->where('owner_id', $user->id)
            ->firstOrFail();

        // Get status
        $status = TaskStatus::where('code', $request->status_code)->firstOrFail();

        // Get priority if provided
        $priority = null;
        if ($request->priority_code) {
            $priority = TaskPriority::where('code', $request->priority_code)->first();
        }

        $task = Task::create([
            'id' => Str::uuid()->toString(),
            'course_id' => $courseId,
            'creator_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'priority_id' => $priority?->id,
            'status_id' => $status->id,
        ]);

        $task->load(['priority', 'status']);

        // Log audit
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'create',
            'object_type' => 'task',
            'object_id' => $task->id,
            'ip_address' => $request->ip(),
        ]);

        return response()->json($task, 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $task = Task::where('id', $id)
            ->whereHas('course', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->with(['priority', 'status', 'reminders', 'course'])
            ->firstOrFail();

        return response()->json($task);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'sometimes|required|date',
            'priority_code' => 'nullable|string|in:low,medium,high',
            'status_code' => 'sometimes|required|string|in:belum,proses,selesai',
        ]);

        $user = $request->user();

        $task = Task::where('id', $id)
            ->whereHas('course', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->firstOrFail();

        $updateData = $request->only(['title', 'description', 'deadline']);

        // Handle status update
        if ($request->has('status_code')) {
            $status = TaskStatus::where('code', $request->status_code)->firstOrFail();
            $updateData['status_id'] = $status->id;
        }

        // Handle priority update
        if ($request->has('priority_code')) {
            if ($request->priority_code) {
                $priority = TaskPriority::where('code', $request->priority_code)->first();
                $updateData['priority_id'] = $priority?->id;
            } else {
                $updateData['priority_id'] = null;
            }
        }

        $task->update($updateData);
        $task->load(['priority', 'status']);

        // Log audit
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'update',
            'object_type' => 'task',
            'object_id' => $task->id,
            'ip_address' => $request->ip(),
        ]);

        return response()->json($task);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $task = Task::where('id', $id)
            ->whereHas('course', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->firstOrFail();

        // Log audit
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'delete',
            'object_type' => 'task',
            'object_id' => $task->id,
            'ip_address' => $request->ip(),
        ]);

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}

