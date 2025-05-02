<?php

namespace App\Http\Controllers;

use App\Models\PlayerProfile;
use App\Models\PlayerSkill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlayerController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $playerProfile = $user->playerProfile;
        $skills = $user->skills;

        return Inertia::render('Player/Dashboard', [
            'playerProfile' => $playerProfile,
            'skills' => $skills
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'character_name' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $playerProfile = $user->playerProfile;
        $playerProfile->update([
            'character_name' => $validated['character_name']
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    public function startGame()
    {
        $user = Auth::user();
        $playerProfile = $user->playerProfile;
        $playerProfile->update([
            'current_level' => 1,
        ]);

        return Inertia::render('Player/Game', [
            'playerProfile' => $playerProfile,
            'skills' => $user->skills,
            'initialLevel' => 1,
            'inGame' => true
        ]);
    }

    public function exitGame()
    {
        return redirect()->route('player.dashboard');
    }

    public function upgradeStats(Request $request)
    {
        $validated = $request->validate([
            'stat' => 'required|string|in:max_hp,attack_min,attack_max,defense,heal',
        ]);

        $user = Auth::user();
        $playerProfile = $user->playerProfile;
        
        $stat = $validated['stat'];
        $increaseValues = [
            'max_hp' => 20,
            'attack_min' => 3,
            'attack_max' => 5,
            'defense' => 2,
            'heal' => 5,
        ];
        
        $playerProfile->update([
            $stat => $playerProfile->$stat + $increaseValues[$stat]
        ]);
        
        return response()->json([
            'success' => true,
            'playerProfile' => $playerProfile
        ]);
    }

    public function completeLevel(Request $request)
    {
        $validated = $request->validate([
            'level' => 'required|integer|min:1',
            'success' => 'required|boolean',
        ]);

        $user = Auth::user();
        $playerProfile = $user->playerProfile;
        
        if ($validated['success']) {
            $newLevel = $validated['level'] + 1;
            $playerProfile->update([
                'current_level' => $newLevel,
            ]);
            
            // Update highest level reached if needed
            if ($newLevel > $playerProfile->highest_level_reached) {
                $playerProfile->update([
                    'highest_level_reached' => $newLevel,
                ]);
            }
        } else {
            // On defeat, update highest level if needed
            if ($validated['level'] > $playerProfile->highest_level_reached) {
                $playerProfile->update([
                    'highest_level_reached' => $validated['level'],
                ]);
            }
        }
        
        return response()->json([
            'success' => true,
            'playerProfile' => $playerProfile
        ]);
    }
}