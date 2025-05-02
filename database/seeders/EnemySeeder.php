<?php

namespace Database\Seeders;

use App\Models\Enemy;
use Illuminate\Database\Seeder;

class EnemySeeder extends Seeder
{
    public function run(): void
    {
        // Level 1-10 enemies
        $enemies = [
            [
                'name' => 'Giant Rat',
                'level_group' => 1,
                'hp' => 50,
                'attack_min' => 5,
                'attack_max' => 8,
                'defense' => 2,
                'image_path' => 'enemies/giant_rat.png'
            ],
            [
                'name' => 'Goblin',
                'level_group' => 1,
                'hp' => 65,
                'attack_min' => 7,
                'attack_max' => 12,
                'defense' => 3,
                'image_path' => 'enemies/goblin.png'
            ],
            [
                'name' => 'Skeleton',
                'level_group' => 1,
                'hp' => 80,
                'attack_min' => 8,
                'attack_max' => 13,
                'defense' => 4,
                'image_path' => 'enemies/skeleton.png'
            ],
            
            // Level 11-20 enemies
            [
                'name' => 'Orc Warrior',
                'level_group' => 2,
                'hp' => 120,
                'attack_min' => 12,
                'attack_max' => 18,
                'defense' => 8,
                'image_path' => 'enemies/orc_warrior.png'
            ],
            [
                'name' => 'Cave Troll',
                'level_group' => 2,
                'hp' => 150,
                'attack_min' => 15,
                'attack_max' => 22,
                'defense' => 10,
                'image_path' => 'enemies/cave_troll.png'
            ],
            [
                'name' => 'Dark Elf',
                'level_group' => 2,
                'hp' => 100,
                'attack_min' => 18,
                'attack_max' => 25,
                'defense' => 7,
                'image_path' => 'enemies/dark_elf.png'
            ],
            
            // Level 21-30 enemies
            [
                'name' => 'Minotaur',
                'level_group' => 3,
                'hp' => 200,
                'attack_min' => 20,
                'attack_max' => 30,
                'defense' => 15,
                'image_path' => 'enemies/minotaur.png'
            ],
            [
                'name' => 'Stone Golem',
                'level_group' => 3,
                'hp' => 250,
                'attack_min' => 18,
                'attack_max' => 25,
                'defense' => 20,
                'image_path' => 'enemies/stone_golem.png'
            ],
            [
                'name' => 'Wraith',
                'level_group' => 3,
                'hp' => 180,
                'attack_min' => 25,
                'attack_max' => 35,
                'defense' => 12,
                'image_path' => 'enemies/wraith.png'
            ],
            
            // Level 31-40 enemies
            [
                'name' => 'Wyvern',
                'level_group' => 4,
                'hp' => 300,
                'attack_min' => 30,
                'attack_max' => 45,
                'defense' => 18,
                'image_path' => 'enemies/wyvern.png'
            ],
            [
                'name' => 'Chimera',
                'level_group' => 4,
                'hp' => 350,
                'attack_min' => 35,
                'attack_max' => 50,
                'defense' => 20,
                'image_path' => 'enemies/chimera.png'
            ],
            [
                'name' => 'Lich',
                'level_group' => 4,
                'hp' => 280,
                'attack_min' => 40,
                'attack_max' => 55,
                'defense' => 15,
                'image_path' => 'enemies/lich.png'
            ],
            
            // Level 41-50 enemies (boss tier)
            [
                'name' => 'Ancient Dragon',
                'level_group' => 5,
                'hp' => 500,
                'attack_min' => 50,
                'attack_max' => 70,
                'defense' => 30,
                'image_path' => 'enemies/ancient_dragon.png'
            ],
            [
                'name' => 'Demon Lord',
                'level_group' => 5,
                'hp' => 450,
                'attack_min' => 60,
                'attack_max' => 80,
                'defense' => 25,
                'image_path' => 'enemies/demon_lord.png'
            ],
            [
                'name' => 'Elder God',
                'level_group' => 5,
                'hp' => 600,
                'attack_min' => 55,
                'attack_max' => 75,
                'defense' => 35,
                'image_path' => 'enemies/elder_god.png'
            ],
        ];

        foreach ($enemies as $enemy) {
            Enemy::create($enemy);
        }
    }
}