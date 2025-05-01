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
        $user = Bidang::findOrFail($id);
        $bidang = Bidang::where('kode', $user->kode)->first();
        $match_soal = $bidang->match_soal()->get();
        $match_soal = $match_soal->map(function ($item) {
            return [
                'id' => $item->id,
                'soal_id' => $item->soal_id,
                'bidang_id' => $item->bidang_id,
            ];
        });
        $bidang->match_soal = $match_soal;
        $bidang->match_soal = $bidang->match_soal->map(function ($item) {
            return [
                'id' => $item['id'],
                'soal_id' => $item['soal_id'],
                'bidang_id' => $item['bidang_id'],
            ];
        });

        return Inertia::render('user-management/form.kategori-ujian', [
            'user' => $bidang,
            'match_soal' => $bidang->match_soal,
            'allRoles' => Role::all(),
            'bidang' => Bidang::all(),
        ]);
    }


    public function update(Request $request, $id)
    {
        $bidang = Bidang::findOrFail($id);

        $data = $request->validate([
            'kategori_soal' => 'required|string',
            'paket' => 'required|string',
            'match_soal' => 'required|array',
            'match_soal.*.soal_id' => 'required|integer|exists:m_soal,ids',
        ]);

        $bidang->update([
            'kategori_soal' => $data['kategori_soal'],
            'paket' => $data['paket'],
        ]);

        $match_soal = MatchSoal::findOrFail($data['match_soal'][0]['id']);
        $match_soal->update([
            'soal_id' => $data['match_soal'][0]['soal_id'],
            'bidang_id' => $bidang->kode,
        ]);

        return redirect()->route('user-management.user.manager')->with('success', 'User updated successfully');
    }

    public function create()
    {
        $allRoles = Role::all();

        return Inertia::render('user-management/form.-manager', [
            'user' => null,
            'allRoles' => $allRoles
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'roles' => 'nullable|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        $user = Bidang::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return redirect()->route('user-management.user.manager')->with('success', 'User created successfully');
    }
}
