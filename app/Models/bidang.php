<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bidang extends Model
{
    protected $connection = 'data_db';
    protected $table = 'm_bidang';
    public $timestamps = false;

    protected $primaryKey = 'kode';

    protected $fillable = [
        'kode',
        'nama',
        'type', // Tambahkan type di sini
    ];

    public function match_soal()
    {
        return $this->hasMany(MatchSoal::class, 'bidang_id', 'kode');
    }

    public function jenis_ujian()
    {
        return $this->hasMany(JenisUjian::class, 'id_ujian', 'kode');
    }
}
