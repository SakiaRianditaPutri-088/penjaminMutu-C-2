<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CoursesController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $courses = Course::where('owner_id', $user->id)
            ->withCount('tasks')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($courses);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $course = Course::create([
            'id' => Str::uuid()->toString(),
            'title' => $request->title,
            'description' => $request->description,
            'color' => $request->color,
            'owner_id' => $user->id,
        ]);

        // Log audit
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'create',
            'object_type' => 'course',
            'object_id' => $course->id,
            'ip_address' => $request->ip(),
        ]);

        return response()->json($course, 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $course = Course::where('id', $id)
            ->where('owner_id', $user->id)
            ->with(['tasks' => function ($query) {
                $query->with(['priority', 'status'])->orderBy('deadline');
            }])
            ->firstOrFail();

        return response()->json($course);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $course = Course::where('id', $id)
            ->where('owner_id', $user->id)
            ->firstOrFail();

        $course->update($request->only(['title', 'description', 'color']));

        // Log audit
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'update',
            'object_type' => 'course',
            'object_id' => $course->id,
            'ip_address' => $request->ip(),
        ]);

        return response()->json($course);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $course = Course::where('id', $id)
            ->where('owner_id', $user->id)
            ->firstOrFail();

        // Log audit
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'delete',
            'object_type' => 'course',
            'object_id' => $course->id,
            'ip_address' => $request->ip(),
        ]);

        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }
}

