<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\DosenImport;

class DosenImportController extends Controller
{
    public function importView()
    {
        return view('dosen.import');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new DosenImport, $request->file('file'));

        return redirect()->back()->with('success', 'Data dosen berhasil diimpor!');
    }
}
