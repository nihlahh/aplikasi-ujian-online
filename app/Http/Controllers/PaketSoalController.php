<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MatchSoal;
use App\Models\bidang;
use App\Models\PaketSoal;

class PaketSoalController extends Controller
{
    public function index(Request $request)
    {
        $pages = $request->query('pages', 10);
        $search = $request->query('search', null);

        $usersQuery = PaketSoal::withCount('match_soal'); 
        if ($search) {
            $usersQuery->where('nama_paket', 'like', '%' . $search . '%');
        }

        return Inertia::render(
            'master-data/paket-soal/paket-soal',
            [
                'data' => $usersQuery->paginate((int)$pages)->withQueryString(),
                'filters' => [
                    'search' => $search,
                    'pages' => $pages,
                ],
            ]
        );
    }

    public function delete(PaketSoal $paketSoal)
    {
        PaketSoal::destroy($paketSoal->id);
        MatchSoal::where('paket_id', $paketSoal->id)->delete();
        
        return redirect()->back()->with('success', 'Bidang deleted successfully');
    }

    public function update(Request $request, PaketSoal $paket_soal)
    {
        $paket_soal->update($request->all());

        return redirect()->back()->with('success', 'User updated successfully');
    }
}
