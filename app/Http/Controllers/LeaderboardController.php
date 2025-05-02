<?php

namespace App\Http\Controllers;

use App\Models\PlayerProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        $leaderboard = PlayerProfile::with('user')
            ->orderBy('highest_level_reached', 'desc')
            ->get()
            ->map(function ($profile) {
                return [
                    'character_name' => $profile->character_name,
                    'highest_level' => $profile->highest_level_reached,
                    'user_name' => $profile->user->name,
                ];
            });

        return Inertia::render('Leaderboard', [
            'leaderboard' => $leaderboard
        ]);
    }
}