<?php

namespace Database\Seeders;

use App\Models\TaskPriority;
use Illuminate\Database\Seeder;

class TaskPrioritySeeder extends Seeder
{
    public function run(): void
    {
        $priorities = [
            ['code' => 'low', 'label' => 'Rendah'],
            ['code' => 'medium', 'label' => 'Sedang'],
            ['code' => 'high', 'label' => 'Tinggi'],
        ];

        foreach ($priorities as $priority) {
            TaskPriority::updateOrCreate(
                ['code' => $priority['code']],
                ['label' => $priority['label']]
            );
        }
    }
}

