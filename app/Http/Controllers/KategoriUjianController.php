<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MatchSoal;
use App\Models\bidang;

class KategoriUjianController extends Controller
{
    public function index(Request $request)
    {
        $pages = $request->query('pages', 10);
        $search = $request->query('search', null);

        $usersQuery = bidang::withCount('match_soal'); 
        if ($search) {
            $usersQuery->where('nama', 'like', '%' . $search . '%');
        }

        return Inertia::render(
            'master-data/kategori-ujian/kategori-ujian',
            [
                'data' => $usersQuery->paginate((int)$pages)->withQueryString(),
                'filters' => [
                    'search' => $search,
                    'pages' => $pages,
                ],
            ]
        );
    }

    public function delete(Bidang $bidang)
    {
        $bidang=bidang::findOrFail($bidang->kode);
        $bidang->match_soal()->delete(); // Delete related match_soal records
        $bidang->delete();

        return redirect()->back()->with('success', 'Bidang deleted successfully');
    }

    public function update(Request $request, bidang $user)
    {
        $user->update($request->all());

        return redirect()->back()->with('success', 'User updated successfully');
    }
}
