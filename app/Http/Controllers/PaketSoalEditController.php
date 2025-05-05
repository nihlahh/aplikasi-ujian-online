<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bidang;
use App\Models\MatchSoal;
use App\Models\Soal;
use Inertia\Inertia;
use App\Models\JenisUjian;
use App\Models\PaketSoal;
use Illuminate\Validation\Rule;


class PaketSoalEditController extends Controller
{
    public function edit($id)
    {
        $paket_soal = PaketSoal::with(['match_soal', 'bidang'])->findOrFail($id);
        $bidang = Bidang::where('kode', $paket_soal->kode_bidang)->first();
        if (!$bidang) {
            return redirect()->back()->with('error', 'Bidang tidak ditemukan.');
        }
        $options = Bidang::select('kode', 'type', 'nama')->get();

        return Inertia::render('master-data/paket-soal/form.paket-soal', [
            'paket' => [
                'id' => $paket_soal->id,
                'kode_bidang' => $paket_soal->kode_bidang,
                'options' => $options,
                'jenis_ujian' => $bidang->nama,
                'nama_paket_ujian' => $paket_soal->nama_paket,
                'kategori_ujian' => $bidang->type,
                'match_soal' => $paket_soal->match_soal,
            ],
            'kategori_option' => $bidang->type,
            'jenis_option' => $bidang->nama,
        ]);        
    }

    public function update(Request $request, $id)
    {
        $paket_soal = PaketSoal::findOrFail($id); 
        $kode = $paket_soal->kode_bidang; 

        $bidang = Bidang::where('kode', $kode)->first();
        $data = $request->validate([
            'nama_paket_ujian' => 'required|string',
            'kode_bidang' => [
                'required',
                'integer',
                Rule::exists('data_db.m_bidang', 'kode'),
            ],

            'kategori_ujian' => 'nullable|string',
            'match_soal' => 'nullable|array',
            'match_soal.*.soal_id' => 'nullable|integer|exists:m_soal,ids',
        ]);

        $paket_soal->update([
            'nama_paket' => $data['nama_paket_ujian'],
            'kode_bidang' => $data['kode_bidang'],
        ]);

        $matchSoal = $data['match_soal'] ?? [];
        if (!empty($matchSoal)) {
            // Hapus semua relasi soal yang ada
            MatchSoal::where('paket_id', $paket_soal->id)->delete();

            // Simpan relasi soal baru
            foreach ($matchSoal as $item) {
                MatchSoal::create([
                    'soal_id' => $item['soal_id'],
                    'paket_id' => $paket_soal->id,
                ]);
            }
        }

        return redirect()->route('master-data.paket-soal.manager')->with('success', 'Kategori ujian berhasil diperbarui.');
    }


    public function create()
    {
        $typeOptions = Bidang::select('type')->distinct()->pluck('type');
        $jenisUjianOptions = Bidang::select('nama')->distinct()->pluck('nama');
        $options = Bidang::select('kode', 'type', 'nama')->get();

        return Inertia::render('master-data/paket-soal/form.paket-soal', [
            'paket' => null, // agar props 'paket' tetap konsisten antara edit dan create
            'allCategories' => Soal::select('ids as id', 'kategori_soal as name')->get(),
            'options' => $options,
            'typeOptions' => $typeOptions,
            'jenisUjianOptions' => $jenisUjianOptions,
            'kategori_option' => $typeOptions,
            'jenis_option' => $jenisUjianOptions,
        ]);
    }


    public function store(Request $request)
    {
        $options = Bidang::select('kode', 'type', 'nama')->get();
        $data = $request->validate([
            'nama_paket_ujian' => 'required|string',
            'kode_bidang' => [
                'required',
                'integer',
                Rule::exists('data_db.m_bidang', 'kode'),
            ],

            'kategori_ujian' => 'required|string',
            'match_soal' => 'nullable|array',
            'match_soal.*.soal_id' => 'nullable|integer|exists:m_soal,ids',
        ]);

        $paket_soal = PaketSoal::create([
            'nama_paket' => $data['nama_paket_ujian'],
            'kode_bidang' => $data['kode_bidang'],
        ]);

        $matchSoal = $data['match_soal'] ?? [];

        if (!empty($matchSoal)) {
            foreach ($matchSoal as $item) {
                MatchSoal::create([
                    'soal_id' => $item['soal_id'],
                    'paket_id' => $paket_soal->id,
                ]);
            }
        }

        return redirect()->route('master-data.paket-soal.manager')->with('success', 'Kategori ujian berhasil ditambahkan.');
    }
}
