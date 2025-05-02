<?php

use App\Http\Controllers\KategoriUjianController;
use App\Http\Controllers\MatkulController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserManagerController;
use App\Http\Controllers\UserManagerEditController;
use App\Http\Controllers\BankSoalController;
use App\Http\Controllers\JenisUjianController;
use App\Http\Controllers\ExamScheduleController;
use App\Http\Controllers\KategoriUjianEditController;
use App\Http\Controllers\PaketSoalController;
use App\Http\Controllers\PaketSoalEditController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Matakuliah;
use App\Models\PaketSoal;

// Custom route binding untuk Matakuliah model
Route::bind('matakuliah', function ($value) {
    return Matakuliah::where('id_mk', $value)->firstOrFail();
});

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // yang perlu diinget, buat name yang punya nama lebih dari 1 kata, contohnya monitoring-ujian
    // itu harus diubah jadi pake titik, contoh monitoring.ujian
    // jadi nanti di route name-nya jadi monitoring.ujian

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('monitoring-ujian', function () {
        return Inertia::render('peserta');
    })->name('monitoring.ujian');

    Route::prefix('jadwal-ujian')->name('exam-schedule.')->group(function () {
        Route::get('/', [ExamScheduleController::class, 'index'])->name('index');
        Route::get('/create', [ExamScheduleController::class, 'create'])->name('create');
        Route::post('/', [ExamScheduleController::class, 'store'])->name('store');
        Route::get('/{examSchedule}/edit', [ExamScheduleController::class, 'edit'])->name('edit');
        Route::put('/{examSchedule}', [ExamScheduleController::class, 'update'])->name('update');
        Route::delete('/{examSchedule}', [ExamScheduleController::class, 'destroy'])->name('destroy');
    });

    Route::get('rekap-nilai', function () {
        return Inertia::render('peserta');
    })->name('peserta');

    // Buat route yang punya submenu, bisa dimasukkan ke dalam group
    // contohnya kek gini buat master-data
    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::get('/', function () {
            return redirect()->route('dashboard');
        })->name('index');

        Route::get('peserta', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('dosen', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('kategori-ujian', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('jenis-ujian', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('jenisujian', [JenisUjianController::class, 'index']);

        Route::get('paket-soal', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('matakuliah', [MatkulController::class, 'index'])->name('matakuliah');

        Route::prefix('kategori-ujian')->name('kategori-ujian.')->group(function () {
            Route::get('/', [PaketSoalController::class, 'index'])->name('manager');
            Route::get('{id}/edit', [PaketSoalEditController::class, 'edit'])->name('edit');
            Route::put('{id}', [PaketSoalEditController::class, 'update'])->name('update');
            Route::delete('/{bidang}', [PaketSoalController::class, 'delete'])->name('destroy');

            Route::get('create', [PaketSoalEditController::class, 'create'])->name('create');
            Route::post('/', [PaketSoalEditController::class, 'store'])->name('store');
        });

        Route::prefix('test')->name('user.')->group(function () {
            Route::get('/', [TestController::class, 'index'])->name('manager');
            Route::get('{id}/edit', [UserManagerEditController::class, 'edit'])->name('edit');
            Route::put('{id}', [UserManagerEditController::class, 'update'])->name('update');
            Route::delete('{user}', [UserManagerController::class, 'delete'])->name('destroy');
            Route::get('create', [UserManagerEditController::class, 'create'])->name('create');
            Route::post('/', [UserManagerEditController::class, 'store'])->name('store');
        });
    });

    Route::middleware(['role:super_admin'])->group(function () {
        Route::prefix('user-management')->name('user-management.')->group(function () {
            Route::get('/', function () {
                return redirect()->route('dashboard');
            })->name('index');

            Route::prefix('user')->name('user.')->group(function () {
                Route::get('/', [UserManagerController::class, 'index'])->name('manager');
                Route::get('{id}/edit', [UserManagerEditController::class, 'edit'])->name('edit');
                Route::put('{id}', [UserManagerEditController::class, 'update'])->name('update');
                Route::delete('{user}', [UserManagerController::class, 'delete'])->name('destroy');
                Route::get('create', [UserManagerEditController::class, 'create'])->name('create');
                Route::post('/', [UserManagerEditController::class, 'store'])->name('store');
            });

            Route::get('roles', function () {
                return Inertia::render('user-management/role-manager');
            })->name('roles');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
