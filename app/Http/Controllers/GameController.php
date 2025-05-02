<?php

namespace App\Http\Controllers;

use App\Models\Enemy;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function getEnemy(Request $request)
    {
        $validated = $request->validate([
            'level' => 'required|integer|min:1',
        ]);
        
        $level = $validated['level'];
        $levelGroup = ceil($level / 10); // Convert level to level group (1-10 -> 1, 11-20 -> 2, etc.)
        
        // Get a random enemy from the appropriate level group
        $enemy = Enemy::where('level_group', $levelGroup)
            ->inRandomOrder()
            ->first();
            
        // Scale enemy stats based on the exact level
        $levelMultiplier = 1 + (($level - 1) % 10) * 0.1; // 1.0 at level 1, 1.9 at level 10
        
        $scaledEnemy = [
            'id' => $enemy->id,
            'name' => $enemy->name,
            'level' => $level,
            'hp' => round($enemy->hp * $levelMultiplier),
            'attack_min' => round($enemy->attack_min * $levelMultiplier),
            'attack_max' => round($enemy->attack_max * $levelMultiplier),
            'defense' => round($enemy->defense * $levelMultiplier),
            'image_path' => $enemy->image_path,
        ];
        
        return response()->json($scaledEnemy);
    }
}