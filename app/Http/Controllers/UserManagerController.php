<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class UserManagerController extends Controller
{
    function index()
    {
        return Inertia::render(
            'user-management/user-manager',
            [
                'users' => User::with('roles')->get()
            ]
        );
    }
}
