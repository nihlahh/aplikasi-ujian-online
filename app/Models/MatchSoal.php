<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchSoal extends Model
{
    
    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $fillable = [
        'soal_id',
        'bidang_id',
    ];

    public function soal()
    {
        return $this->belongsTo(soal::class, 'soal_id', 'ids');
    }

    public function bidang()
    {
        return $this->belongsTo(bidang::class, 'bidang_id', 'kode');
    }
}
