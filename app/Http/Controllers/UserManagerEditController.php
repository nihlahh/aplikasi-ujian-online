<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class UserManagerEditController extends Controller
{
    public function edit($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('user-management/form.user-manager', [
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
        ]));

        return redirect()->route('users.index')->with('message', 'User updated!');
    }
}
