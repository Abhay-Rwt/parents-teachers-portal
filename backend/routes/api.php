<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/classrooms', [\App\Http\Controllers\LookupController::class, 'classrooms']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard/stats', [\App\Http\Controllers\DashboardController::class, 'index']);
    
    // Shared lookups
    Route::get('/lookups/classrooms', [\App\Http\Controllers\LookupController::class, 'classrooms']);
    Route::get('/lookups/subjects', [\App\Http\Controllers\LookupController::class, 'subjects']);
    Route::get('/lookups/parents', [\App\Http\Controllers\LookupController::class, 'parents']);
    Route::get('/lookups/teachers', [\App\Http\Controllers\LookupController::class, 'teachers']);

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::apiResource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::patch('users/{user}/toggle-status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus']);
        
        Route::apiResource('classrooms', \App\Http\Controllers\Admin\ClassroomController::class);
        Route::apiResource('subjects', \App\Http\Controllers\Admin\SubjectController::class);
        Route::apiResource('students', \App\Http\Controllers\Teacher\StudentController::class);
    });

    // Teacher routes
    Route::middleware('role:teacher')->prefix('teacher')->group(function () {
        Route::get('/students', [\App\Http\Controllers\Teacher\StudentController::class, 'index']);
        Route::get('/students/{student}', [\App\Http\Controllers\Teacher\StudentController::class, 'show']);
        Route::patch('/students/{student}', [\App\Http\Controllers\Teacher\StudentController::class, 'update']);

        Route::get('attendances', [\App\Http\Controllers\Teacher\AttendanceController::class, 'index']);
        Route::apiResource('attendances', \App\Http\Controllers\Teacher\AttendanceController::class)->only(['store', 'update']);
        Route::post('grades/bulk', [\App\Http\Controllers\Teacher\GradeController::class, 'bulkStore']);
        Route::apiResource('grades', \App\Http\Controllers\Teacher\GradeController::class)->except(['index', 'show']);
        Route::apiResource('assignments', \App\Http\Controllers\Teacher\AssignmentController::class);
    });

    // Parent routes
    Route::middleware('role:parent')->prefix('parent')->group(function () {
        Route::get('/progress', [\App\Http\Controllers\Parent\StudentProgressController::class, 'index']);
        Route::post('/progress', [\App\Http\Controllers\Parent\StudentProgressController::class, 'store']);
        Route::get('/progress/{student}', [\App\Http\Controllers\Parent\StudentProgressController::class, 'show']);
        Route::get('/assignments', [\App\Http\Controllers\Parent\AssignmentController::class, 'index']);
    });

    // Communication routes
    Route::apiResource('messages', MessageController::class)->only(['index', 'store']);
    Route::patch('messages/{message}/read', [MessageController::class, 'markAsRead']);
    
    Route::apiResource('meetings', MeetingController::class)->only(['index', 'store']);
    Route::patch('meetings/{meeting}/status', [MeetingController::class, 'updateStatus']);

    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
});
