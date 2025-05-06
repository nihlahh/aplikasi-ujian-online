<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Models\Dosen;

class DosenManagerEditController extends Controller
{
    public function edit($id)
    {
        $user = User::with('roles')->findOrFail($id)->with('dosen');
        $allRoles = Role::all();


        return Inertia::render('user-management/form.dosen-manager', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')
            ],
            'allRoles' => $allRoles
        ]);
    }


    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $dosen = Dosen::where('nip', $user->nip)->first();

        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'roles' => 'nullable|array',
            'roles.*' => 'string|exists:roles,name',
            'nip' => 'required|string|exists:dosen,nip',
            'aktif' => 'required|boolean',
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        $dosen->update([
            'nip' => $data['nip'],
            'aktif' => $data['aktif'],
        ]);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return redirect()->route('master-data.dosen.manager')->with('success', 'User updated successfully');
    }

    public function create()
    {
        $allRoles = Role::all();

        return Inertia::render('user-management/form.dosen-manager', [
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
            'nip' => 'required|string|unique:dosen,nip',
            'aktif' => 'required|boolean',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $dosen = Dosen::create([
            'nip' => $data['nip'],
            'aktif' => $data['aktif'],
        ]);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return redirect()->route('master-data.dosen.manager')->with('success', 'User created successfully');
    }
}
