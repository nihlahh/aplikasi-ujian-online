<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankSoalControllerCheckbox extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('pages', 10);
        $order = $request->get('order', 'asc');
    
        $query = DB::connection('data_db')->table('m_soal')
            ->select('ids', 'suara', 'header_soal', 'body_soal', 'footer_soal', 'jw_1', 'jw_2', 'jw_3', 'jw_4', 'jw_fix')
            ->orderBy('ids', $order);
    
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kategori_soal', 'like', "%{$search}%")
                    ->orWhere('header_soal', 'like', "%{$search}%")
                    ->orWhere('body_soal', 'like', "%{$search}%")
                    ->orWhere('footer_soal', 'like', "%{$search}%");
            });
        }
    
        $data = $query->paginate($perPage)->withQueryString();
    
        return Inertia::render('banksoalcheckbox', [
            'dataSoal' => $data,
            'filters' => [
                'search' => $search,
                'pages' => $perPage,
            ],
        ]);
    }    
}
