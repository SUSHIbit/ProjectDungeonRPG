<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PlayerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'mimin@gmail.com',
            'password' => Hash::make('123456789'),
            'is_admin' => true,
        ]);

        // Create admin's player profile
        PlayerProfile::create([
            'user_id' => $admin->id,
            'character_name' => 'GameMaster',
            'current_level' => 1,
            'max_hp' => 200,
            'attack_min' => 20,
            'attack_max' => 30,
            'defense' => 15,
            'heal' => 40,
            'highest_level_reached' => 1,
        ]);

        // Create a regular test user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'player@gmail.com',
            'password' => Hash::make('123456789'),
            'is_admin' => false,
        ]);

        // Create test user's player profile
        PlayerProfile::create([
            'user_id' => $user->id,
            'character_name' => 'TestPlayer',
            'current_level' => 1,
            'max_hp' => 100,
            'attack_min' => 10,
            'attack_max' => 15,
            'defense' => 5,
            'heal' => 20,
            'highest_level_reached' => 1,
        ]);
    }
}