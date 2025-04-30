<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\soal;
use App\Models\bidang;

class KategoriUjianController extends Controller
{
    function index(Request $request)
    {
        $pages = $request->query('pages', 10);
        $search = $request->query('search', null);

        $usersQuery = bidang::query();
        if ($search) {
            $usersQuery->where('nama', 'like', '%' . $search . '%')
                ->orWhere('email', 'like', '%' . $search . '%');
        }

        return Inertia::render(
            'user-management/kategori-ujian',
            [
                'data' => $usersQuery->paginate((int)$pages)->withQueryString(),
                'filters' => [
                    'search' => $search,
                    'pages' => $pages,
                ],
            ]
        );
    }

    public function delete(Request $request, soal $user)
    {
        if ($request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function update(Request $request, soal $user)
    {
        $user->update($request->all());

        return redirect()->back()->with('success', 'User updated successfully');
    }
}
