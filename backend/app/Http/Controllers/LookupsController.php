<?php

namespace App\Http\Controllers;

use App\Models\TaskPriority;
use App\Models\TaskStatus;
use Illuminate\Http\JsonResponse;

class LookupsController extends Controller
{
    public function taskStatuses(): JsonResponse
    {
        $statuses = TaskStatus::all();

        return response()->json($statuses);
    }

    public function taskPriorities(): JsonResponse
    {
        $priorities = TaskPriority::all();

        return response()->json($priorities);
    }
}

