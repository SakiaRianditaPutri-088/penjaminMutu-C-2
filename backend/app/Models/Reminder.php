<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    public $timestamps = false;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'task_id',
        'remind_at',
        'sent',
    ];

    protected $casts = [
        'remind_at' => 'datetime',
        'sent' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}

