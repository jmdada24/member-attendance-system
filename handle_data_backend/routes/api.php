<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MemberController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::post("register", [AuthController::class, "register"]);
Route::post("login", [AuthController::class], "login");

Route::middleware("auth:sanctum")->group(function(){
    
    Route::get("profile", [AuthController::class, "profile"]);
    Route::get("logout", [AuthController::class, "logout"]);

    Route::apiResource("member", MemberController::class);

    Route::post("attendance/record", [AttendanceController::class, "record"]);
    Route::get("attendance/list", [AttendanceController::class, "list"]);

});

