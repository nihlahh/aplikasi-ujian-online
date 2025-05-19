<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('monitoring_ujians', function (Blueprint $table) {
            $table->id();
            $table->string('tipe_ujian');
            $table->string('paket_ujian');
            $table->string('kelas_prodi'); // Kelompok in the UI
            $table->date('tanggal_ujian');
            $table->time('mulai');
            $table->time('selesai');
            $table->integer('kuota');
            $table->enum('tipe', ['Regular', 'Remidi']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monitoring_ujians');
    }
};