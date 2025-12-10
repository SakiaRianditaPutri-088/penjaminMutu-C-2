<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [
        //
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    protected function handleApiException($request, Throwable $exception)
    {
        $statusCode = 500;
        $message = 'Internal Server Error';

        if ($exception instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
            $statusCode = 404;
            $message = 'Resource not found';
        } elseif ($exception instanceof \Illuminate\Validation\ValidationException) {
            $statusCode = 422;
            $message = $exception->getMessage();
        } elseif ($exception instanceof \Illuminate\Auth\AuthenticationException) {
            $statusCode = 401;
            $message = 'Unauthenticated';
        } elseif ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
            $statusCode = 404;
            $message = 'Route not found';
        } elseif ($exception instanceof \Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException) {
            $statusCode = 405;
            $message = 'Method not allowed';
        } elseif (method_exists($exception, 'getStatusCode')) {
            $statusCode = $exception->getStatusCode();
            $message = $exception->getMessage() ?: 'Error';
        }

        return response()->json([
            'message' => $message,
            'error' => config('app.debug') ? $exception->getMessage() : null,
            'trace' => config('app.debug') ? $exception->getTraceAsString() : null,
        ], $statusCode);
    }
}

