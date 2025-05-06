<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DosenImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new User([
            'name' => $row['nama'],
            'nip' => $row['nip'],
            'email' => $row['email'],
            'password' => Hash::make('defaultpassword'), // Password default
            'status' => strtolower($row['status']) === 'active' ? 'active' : 'inactive',
        ]);
    }
}
