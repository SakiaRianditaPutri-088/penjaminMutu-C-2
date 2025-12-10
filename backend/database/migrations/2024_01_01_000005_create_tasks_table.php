<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('course_id');
            $table->uuid('creator_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('deadline');
            $table->unsignedBigInteger('priority_id')->nullable();
            $table->unsignedBigInteger('status_id');
            $table->timestamps();

            $table->foreign('course_id')
                ->references('id')
                ->on('courses')
                ->onDelete('cascade');

            $table->foreign('creator_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->foreign('priority_id')
                ->references('id')
                ->on('task_priorities')
                ->onDelete('set null');

            $table->foreign('status_id')
                ->references('id')
                ->on('task_statuses')
                ->onDelete('restrict');

            $table->index('deadline');
            $table->index('course_id');
            $table->index('status_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

