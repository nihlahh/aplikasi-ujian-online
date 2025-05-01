<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bidang;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Models\MatchSoal;
use App\Models\Soal;

class KategoriUjianEditController extends Controller
{
    public function edit($id)
    {
        $bidang = Bidang::with('match_soal')->findOrFail($id);

        return Inertia::render('master-data/kategori-ujian/form.kategori-ujian', [
            'bidang' => $bidang,
            'soalList' => Soal::all(), // Ambil semua soal untuk dropdown
            'selectedSoal' => $bidang->match_soal->pluck('soal_id'), // Soal yang sudah dipilih
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            'type' => 'required|string',
            'match_soal' => 'required|array',
            'match_soal.*' => 'required|integer|exists:m_soal,ids',
        ]);

        $bidang = Bidang::findOrFail($id);
        $bidang->update([
            'nama' => $data['nama'],
            'type' => $data['type'],
        ]);

        // Hapus match soal lama
        $bidang->match_soal()->delete();

        // Tambahkan match soal baru
        foreach ($data['match_soal'] as $soalId) {
            MatchSoal::create([
                'soal_id' => $soalId,
                'bidang_id' => $bidang->kode,
            ]);
        }

        return redirect()->route('master-data.kategori-ujian.index')->with('success', 'Bidang updated successfully');
    }

    public function create()
    {
        $allRoles = Role::all();

        return Inertia::render('master-data/kategori-ujian/form.kategori-ujian', [
            'user' => null,
            'allRoles' => $allRoles
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            'type' => 'required|string',
            'match_soal' => 'required|array',
            'match_soal.*' => 'required|integer|exists:m_soal,ids',
        ]);

        $bidang = Bidang::create([
            'nama' => $data['nama'],
            'type' => $data['type'],
        ]);

        foreach ($data['match_soal'] as $soalId) {
            MatchSoal::create([
                'soal_id' => $soalId,
                'bidang_id' => $bidang->kode,
            ]);
        }

        return redirect()->route('master-data.kategori-ujian.index')->with('success', 'Bidang created successfully');
    }
}
