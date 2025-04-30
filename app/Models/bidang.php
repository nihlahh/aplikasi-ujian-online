<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class bidang extends Model
{
    protected $connection = 'data_db';
    protected $table = 'm_bidang';
    protected $primaryKey = 'kode';
    public $timestamps = false;
    protected $fillable = [
        'nama',
        'type',
        
    ];
    public function match_soal()
    {
        return $this->hasMany(MatchSoal::class, 'bidang_id', 'kode');
    }
}
