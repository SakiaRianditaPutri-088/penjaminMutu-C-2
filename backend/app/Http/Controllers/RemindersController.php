<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RemindersController extends Controller
{
    public function indexByTask(Request $request, string $taskId): JsonResponse
    {
        $user = $request->user();

        // Verify task ownership through course
        $task = Task::where('id', $taskId)
            ->whereHas('course', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->firstOrFail();

        $reminders = Reminder::where('task_id', $taskId)
            ->orderBy('remind_at', 'asc')
            ->get();

        return response()->json($reminders);
    }

    public function store(Request $request, string $taskId): JsonResponse
    {
        $request->validate([
            'remind_at' => 'required|date',
        ]);

        $user = $request->user();

        // Verify task ownership through course
        $task = Task::where('id', $taskId)
            ->whereHas('course', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->firstOrFail();

        $reminder = Reminder::create([
            'id' => Str::uuid()->toString(),
            'task_id' => $taskId,
            'remind_at' => $request->remind_at,
            'sent' => false,
        ]);

        return response()->json($reminder, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'remind_at' => 'sometimes|required|date',
            'sent' => 'sometimes|boolean',
        ]);

        $user = $request->user();

        $reminder = Reminder::where('id', $id)
            ->whereHas('task.course', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->firstOrFail();

        $reminder->update($request->only(['remind_at', 'sent']));

        return response()->json($reminder);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $reminder = Reminder::where('id', $id)
            ->whereHas('task.course', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->firstOrFail();

        $reminder->delete();

        return response()->json(['message' => 'Reminder deleted successfully']);
    }
}

