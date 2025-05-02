<?php

use App\Http\Controllers\Admin\EnemyController as AdminEnemyController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home and Auth Routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Routes that require authentication
Route::middleware(['auth', 'verified'])->group(function () {
    // Default Laravel Breeze Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Player Routes
    Route::redirect('/dashboard', '/player/dashboard')->name('dashboard');
    
    Route::prefix('player')->name('player.')->group(function () {
        Route::get('/dashboard', [PlayerController::class, 'dashboard'])->name('dashboard');
        Route::post('/update-profile', [PlayerController::class, 'updateProfile'])->name('update-profile');
        Route::get('/start-game', [PlayerController::class, 'startGame'])->name('start-game');
        Route::post('/exit-game', [PlayerController::class, 'exitGame'])->name('exit-game');
        Route::post('/upgrade-stats', [PlayerController::class, 'upgradeStats'])->name('upgrade-stats');
        Route::post('/complete-level', [PlayerController::class, 'completeLevel'])->name('complete-level');
    });

    // Game API Routes
    Route::prefix('game')->name('game.')->group(function () {
        Route::get('/enemy', [GameController::class, 'getEnemy'])->name('enemy');
    });

    // Leaderboard Routes
    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');

    // Admin Routes (with admin middleware)
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::resource('enemies', AdminEnemyController::class);
    });
});

require __DIR__.'/auth.php';