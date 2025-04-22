<?php

use App\Http\Controllers\MatkulController;
use App\Http\Controllers\UserManagerController;
use App\Http\Controllers\UserManagerEditController;
use App\Http\Controllers\LecturerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('jadwal-ujian', function () {
        return Inertia::render('peserta');
    })->name('peserta');

    Route::get('monitoring-ujian', function () {
        return Inertia::render('peserta');
    })->name('monitoring.ujian');

    Route::get('rekap-nilai', function () {
        return Inertia::render('peserta');
    })->name('peserta');

    // ======================
    // MASTER DATA
    // ======================
    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::get('/', function () {
            return redirect()->route('dashboard');
        })->name('index');

        Route::get('peserta', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        // ✅ Route tampil dosen
        Route::get('dosen', [LecturerController::class, 'index'])->name('dosen');

        Route::get('kategori-ujian', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('jenis-ujian', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('soal', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('matakuliah', [MatkulController::class, 'index'])->name('matakuliah');
    });

    // ======================
    // USER MANAGEMENT + DOSEN (ADMIN)
    // ======================
    Route::middleware(['role:super_admin'])->prefix('user-management')->name('user-management.')->group(function () {
        Route::get('/', function () {
            return redirect()->route('dashboard');
        })->name('index');

        // User
        Route::get('user', [UserManagerController::class, 'index'])->name('user.manager');
        Route::get('/user/{id}/edit', [UserManagerEditController::class, 'edit'])->name('user.edit');
        Route::put('/user/{id}', [UserManagerEditController::class, 'update'])->name('user.update');
        Route::delete('user/{user}', [UserManagerController::class, 'delete'])->name('user.destroy');

        Route::get('roles', function () {
            return Inertia::render('user-management/role-manager');
        })->name('roles');

        // ✅ Route edit/update/delete dosen
        Route::get('lecturer/{id}/edit', [LecturerController::class, 'edit'])->name('lecturer.edit');
        Route::put('lecturer/{id}', [LecturerController::class, 'update'])->name('lecturer.update');
        Route::delete('lecturer/{lecturer}', [LecturerController::class, 'destroy'])->name('lecturer.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
