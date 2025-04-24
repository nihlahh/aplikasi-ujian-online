<?php

namespace App\Http\Controllers;

use App\Models\Matakuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatkulController extends Controller
{
    public function index(Request $request)
    {
        // Ambil parameter dari request
        $pages = $request->query('pages', 10);
        $search = $request->query('search', null);
        
        // Buat query dasar
        $query = Matakuliah::query();
        
        // Tambahkan pencarian jika parameter search ada
        if ($search) {
            $query->where('kode_mk', 'like', '%' . $search . '%')
                  ->orWhere('nama_mk', 'like', '%' . $search . '%');
        }
        
        // Ambil data dengan pagination
        $matakuliahs = $query->paginate((int)$pages)->withQueryString();
        
        // Format data untuk frontend
        $matakuliahs->through(function ($matakuliah) {
            return [
                'id' => $matakuliah->id_mk,
                'kode' => $matakuliah->kode_mk,
                'nama' => $matakuliah->nama_mk,
                'sks' => $matakuliah->sks,
                'semester' => $matakuliah->semester,
                'prodi' => $matakuliah->prodi,
            ];
        });
        
        // Render halaman dengan data
        return Inertia::render(
            'matakuliah/matakuliah',
            [
                'data' => $matakuliahs,
                'filters' => [
                    'search' => $search,
                    'pages' => $pages,
                ],
            ]
        );
    }
    
    public function create()
    {
        return Inertia::render('matakuliah/matakuliah-form', [
            'isEdit' => false,
        ]);
    }
    
    public function store(Request $request)
    {
        // Validasi data yang diinput
        $validated = $request->validate([
            'kode_mk' => 'required|unique:tblmatkul,kode_mk',
            'nama_mk' => 'required',
            'sks' => 'required|integer|min:1',
            'semester' => 'required|integer|min:1|max:8',
            'prodi' => 'required',
            'id_dosen' => 'nullable|integer',
            'prasyarat' => 'nullable|string',
        ]);
        
        // Buat data matakuliah baru
        Matakuliah::create($validated);
        
        // Redirect ke halaman daftar dengan pesan sukses
        return redirect()->route('master-data.matakuliah.index')
            ->with('success', 'Mata Kuliah berhasil ditambahkan');
    }
    
    public function edit(Matakuliah $matakuliah)
    {
        return Inertia::render('matakuliah/matakuliah-form', [
            'isEdit' => true,
            'matakuliah' => $matakuliah,
        ]);
    }
    
    public function update(Request $request, Matakuliah $matakuliah)
    {
        // Validasi data yang diinput
        $validated = $request->validate([
            'kode_mk' => 'required|unique:tblmatkul,kode_mk,'.$matakuliah->id_mk.',id_mk',
            'nama_mk' => 'required',
            'sks' => 'required|integer|min:1',
            'semester' => 'required|integer|min:1|max:8',
            'prodi' => 'required',
            'id_dosen' => 'nullable|integer',
            'prasyarat' => 'nullable|string',
        ]);
        
        // Update data matakuliah
        $matakuliah->update($validated);
        
        // Redirect dengan pesan sukses
        return redirect()->route('master-data.matakuliah.index')
            ->with('success', 'Mata Kuliah berhasil diperbarui');
    }
    
    public function destroy(Matakuliah $matakuliah)
    {
        // Hapus data matakuliah
        $matakuliah->delete();
        
        // Redirect dengan pesan sukses
        return redirect()->back()
            ->with('success', 'Mata Kuliah berhasil dihapus');
    }
}