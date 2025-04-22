<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerController extends Controller
{
    // Tampilkan data dosen
    public function index(Request $request)
    {
        $lecturers = Lecturer::query()
            ->when($request->search, fn($q) => $q->where('name', 'like', '%' . $request->search . '%'))
            ->paginate(10);

        return Inertia::render('MasterData/Dosen', [
            'lecturers' => $lecturers,
            'filters' => [
                'search' => $request->search ?? '',
            ],
        ]);
    }

    // Hapus dosen
    public function destroy(Lecturer $lecturer)
    {
        $lecturer->delete();

        return redirect()->back()->with('success', 'Dosen berhasil dihapus.');
    }

    // Tampilkan halaman edit dosen (kalau dibutuhkan)
    public function edit($id)
    {
        $lecturer = Lecturer::findOrFail($id);

        return Inertia::render('MasterData/EditDosen', [
            'lecturer' => $lecturer
        ]);
    }

    // Update dosen (kalau dibutuhkan)
    public function update(Request $request, $id)
    {
        $lecturer = Lecturer::findOrFail($id);
        $lecturer->update($request->only('name', 'email'));

        return redirect()->route('master-data.dosen')->with('success', 'Dosen berhasil diperbarui.');
    }
}
