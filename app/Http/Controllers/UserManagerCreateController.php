<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserManagerCreateController extends Controller
{
    function index()
    {
        return Inertia::render('user-management/form.user-manager');
    }
}
