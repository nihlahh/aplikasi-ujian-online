<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

    Route::get('jadwal-ujian', function () {
        return Inertia::render('peserta');
    })->name('peserta');

    Route::get('monitoring-ujian', function () {
        return Inertia::render('peserta');
    })->name('monitoring.ujian');

    Route::get('rekap-nilai', function () {
        return Inertia::render('peserta');
    })->name('peserta');

    Route::get('master-matakuliah', function () {
        return Inertia::render('master-matakuliah');
    })->name('master.matakuliah');

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

        Route::get('soal', function () {
            return Inertia::render('peserta');
        })->name('peserta');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
