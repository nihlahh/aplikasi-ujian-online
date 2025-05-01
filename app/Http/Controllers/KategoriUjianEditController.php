<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bidang;
use App\Models\MatchSoal;
use App\Models\Soal;
use Inertia\Inertia;

class KategoriUjianEditController extends Controller
{
    public function edit($id)
    {
        $bidang = Bidang::with('match_soal')->findOrFail($id);

        return Inertia::render('master-data/kategori-ujian/form.kategori-ujian', [
            'bidang' => $bidang,
            'soalList' => Soal::all(),
            'selectedSoal' => $bidang->match_soal->pluck('soal_id'),
            'allCategories' => Soal::select('ids as id', 'kategori_soal as name')->get(),
            'typeOptions' => Bidang::select('type')->distinct()->pluck('type'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $bidang = Bidang::findOrFail($id);

        $data = $request->validate([
            'nama' => 'required|string',
            'paket' => 'required|string',
            'type' => 'nullable|string',
            'match_soal' => 'nullable|array',
            'match_soal.*.soal_id' => 'nullable|integer|exists:m_soal,ids',
        ]);

        $bidang->update([
            'kode' => $bidang->kode, // Kode tidak perlu diupdate
            'nama' => $data['nama'],
            // 'paket' => $data['paket'],
            'type' => $data['type'] ?? $bidang->type,
        ]);

        // Hapus match sebelumnya
        MatchSoal::where('bidang_id', $bidang->kode)->delete();

        // Simpan ulang semua soal terhubung
        foreach ($data['match_soal'] as $item) {
            MatchSoal::create([
                'soal_id' => $item['soal_id'],
                'bidang_id' => $bidang->kode,
            ]);
        }

        return redirect()->route('master-data.kategori-soal.manager')->with('success', 'Kategori ujian berhasil diperbarui.');
    }

    public function create()
    {
        return Inertia::render('master-data/kategori-ujian/form.kategori-ujian', [
            'bidang' => null,
            'allCategories' => Soal::select('ids as id', 'kategori_soal as name')->get(),
            'typeOptions' => Bidang::select('type')->distinct()->pluck('type'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            'paket' => 'nullable|string',
            'type' => 'nullable|string',
            'match_soal' => 'nullable|array',
            'match_soal.*.soal_id' => 'nullable|integer|exists:m_soal,ids',
        ]);

        $bidang = Bidang::create([
            'kode' => Bidang::max('kode') + 1,
            'nama' => $data['nama'],
            'type' => $data['type'] ?? null,
        ]);

        if (isset($data['match_soal'])) {
            foreach ($data['match_soal'] as $item) {
                MatchSoal::create([
                    'soal_id' => $item['soal_id'],
                    'bidang_id' => $bidang->kode,
                ]);
            }
        }

        return redirect()->route('master-data.kategori-ujian.manager')->with('success', 'Kategori ujian berhasil ditambahkan.');
    }
}
