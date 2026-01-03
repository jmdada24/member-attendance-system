<?php

use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\ScanController;
use App\Http\Controllers\Auth\ApiAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function() {
        Route::post('/scan', [ScanController::class, 'store']);

        Route::apiResource('members', MemberController::class);

    });


Route::prefix('auth')->group(function () {
    Route::post('/register', [ApiAuthController::class, 'register']);
    Route::post('/login', [ApiAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [ApiAuthController::class, 'me']);
        Route::post('/logout', [ApiAuthController::class, 'logout']);
    });
});
