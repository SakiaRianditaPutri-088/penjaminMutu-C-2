<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // API middleware - Sanctum
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // Custom middleware aliases
        $middleware->alias([
            'log.activity' => \App\Http\Middleware\LogActivityMiddleware::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule) {
        // Kirim push reminders setiap jam
        $schedule->command('reminders:push')
                 ->hourly()
                 ->withoutOverlapping()
                 ->onOneServer();
        
        // Cleanup old notifications setiap hari jam 2 pagi
        $schedule->command('notifications:cleanup')
                 ->daily()
                 ->at('02:00');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Custom API exception handling
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                return app(\App\Exceptions\Handler::class)->handleApiException($request, $e);
            }
        });
    })
    ->create();
