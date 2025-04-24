<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matakuliah extends Model
{
    use HasFactory;
    
    // Gunakan koneksi ke database hitam
    protected $connection = 'data_db';
    
    // Nama tabel di database
    protected $table = 'tblmatkul';
    
    // Kunci utama tabel
    protected $primaryKey = 'id_mk';
    
    // Nonaktifkan timestamps karena tabel tidak memiliki kolom created_at/updated_at
    public $timestamps = false;
    
    // Kolom yang bisa diisi secara massal
    protected $fillable = [
        'kode_mk',
        'nama_mk',
        'sks',
        'semester',
        'prodi',
        'id_dosen',
        'prasyarat'
    ];
}