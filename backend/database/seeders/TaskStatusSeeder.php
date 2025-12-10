<?php

namespace Database\Seeders;

use App\Models\TaskStatus;
use Illuminate\Database\Seeder;

class TaskStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['code' => 'belum', 'label' => 'Belum'],
            ['code' => 'proses', 'label' => 'Sedang Diproses'],
            ['code' => 'selesai', 'label' => 'Selesai'],
        ];

        foreach ($statuses as $status) {
            TaskStatus::updateOrCreate(
                ['code' => $status['code']],
                ['label' => $status['label']]
            );
        }
    }
}

