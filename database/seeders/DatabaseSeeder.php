<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            UserSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'test@admin.com',
            'password' => bcrypt('admin123'),
        ]);
        $user->assignRole('admin');
    }
}
