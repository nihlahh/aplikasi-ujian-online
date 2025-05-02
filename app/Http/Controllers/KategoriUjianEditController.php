<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bidang;
use App\Models\MatchSoal;
use App\Models\Soal;
use Inertia\Inertia;
use App\Models\JenisUjian;

class KategoriUjianEditController extends Controller
{
    public function edit($id)
    {
        $bidang = Bidang::with(['match_soal', 'jenis_ujian'])->findOrFail($id);

        return Inertia::render('master-data/kategori-ujian/form.kategori-ujian', [
            'bidang' => $bidang,
            'soalList' => Soal::all(),
            'selectedSoal' => $bidang->match_soal->pluck('soal_id'),
            'allCategories' => Soal::select('ids as id', 'kategori_soal as name')->get(),
            'typeOptions' => Bidang::select('type')->distinct()->pluck('type'),
            'jenisUjianOptions' => JenisUjian::select('jenis_ujian')->distinct()->pluck('jenis_ujian'), // Ambil jenis ujian unik
        ]);
    }

    public function update(Request $request, $id)
    {
        $bidang = Bidang::findOrFail($id); 

        if ($bidang->kode != $id) {
            return redirect()->back()->with('error', 'Bidang tidak ditemukan.');
        }

        $data = $request->validate([
            'nama' => 'required|string',
            'type' => 'nullable|string',
            'paket' => 'nullable|string',
            'jenis_ujian' => 'nullable|string',
            'match_soal' => 'nullable|array',
            'match_soal.*.soal_id' => 'nullable|integer|exists:m_soal,ids',
        ]);

        // Update Bidang
        $bidang->update([
            'nama' => $data['nama'],
            'type' => $data['type'] ?? $bidang->type,
        ]);

        // Hapus match_soal lama
        $bidang->match_soal()->delete();

        // Tambahkan ulang match_soal baru
        if (!empty($data['match_soal'])) {
            foreach ($data['match_soal'] as $item) {
                MatchSoal::create([
                    'soal_id' => $item['soal_id'],
                    'bidang_id' => $bidang->kode,
                ]);
            }
        }

        // Update atau buat data JenisUjian
        if (!empty($data['jenis_ujian'])) {
            JenisUjian::updateOrCreate(
                ['id_ujian' => $bidang->kode],
                ['jenis_ujian' => $data['jenis_ujian']]
            );
        }

        return redirect()->route('master-data.kategori-ujian.manager')->with('success', 'Kategori ujian berhasil diperbarui.');
    }


    public function create()
    {
        return Inertia::render('master-data/kategori-ujian/form.kategori-ujian', [
            'bidang' => null,
            'allCategories' => Soal::select('ids as id', 'kategori_soal as name')->get(),
            'typeOptions' => Bidang::select('type')->distinct()->pluck('type'),
            'jenisUjianOptions' => JenisUjian::select('jenis_ujian')->distinct()->pluck('jenis_ujian'), // Ambil jenis ujian unik
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            'paket' => 'nullable|string',
            'type' => 'nullable|string',
            'jenis_ujian' => 'nullable|string',
            'match_soal' => 'nullable|array',
            'match_soal.*.soal_id' => 'nullable|integer|exists:m_soal,ids',
        ]);

        // Hitung kode baru
        $newKode = Bidang::max('kode') + 1;

        // Simpan ke tabel bidang
        $bidang = Bidang::create([
            'kode' => $newKode,
            'nama' => $data['nama'],
            'type' => $data['type'] ?? null,
        ]);

        // Simpan jenis ujian (jika ada)
        if (!empty($data['jenis_ujian'])) {
            JenisUjian::create([
                'id_ujian' => $newKode,
                'jenis_ujian' => $data['jenis_ujian'],
            ]);
        }

        // Simpan relasi soal (jika ada)
        if (!empty($data['match_soal'])) {
            foreach ($data['match_soal'] as $item) {
                MatchSoal::create([
                    'soal_id' => $item['soal_id'],
                    'bidang_id' => $newKode,
                ]);
            }
        }

        return redirect()->route('master-data.kategori-ujian.manager')->with('success', 'Kategori ujian berhasil ditambahkan.');
    }
}
