<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Si Tugas Backend API',
        'version' => '1.0.0',
    ]);
});

