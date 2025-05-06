<?php

namespace App\Imports;

use App\Models\Dosen;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DosenImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Dosen([
            'nip'    => $row['nip'],
            'name'   => $row['name'],
            'email'  => $row['email'],
            'aktif'  => $row['aktif'], // Sesuaikan dengan kolom pada Excel
            'roles'  => $row['roles'],
        ]);
    }
}

