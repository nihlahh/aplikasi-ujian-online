<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MatkulController extends Controller
{
    public function index()
    {
        return Inertia::render('matakuliah', [
            'title' => 'Master Matakuliah',
            'description' => 'Ini Pesan Dari Controller',
        ]);
    }
}
