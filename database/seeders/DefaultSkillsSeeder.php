<?php

namespace Database\Seeders;

use App\Models\PlayerSkill;
use App\Models\User;
use Illuminate\Database\Seeder;

class DefaultSkillsSeeder extends Seeder
{
    public function run(): void
    {
        $defaultSkills = [
            [
                'skill_name' => 'Basic Attack',
                'cooldown_duration' => 0,
            ],
            [
                'skill_name' => 'Power Strike',
                'cooldown_duration' => 2,
            ],
            [
                'skill_name' => 'Heal',
                'cooldown_duration' => 3,
            ],
            [
                'skill_name' => 'Shield Bash',
                'cooldown_duration' => 2,
            ],
            [
                'skill_name' => 'Fireball',
                'cooldown_duration' => 4,
            ],
        ];

        // Assign default skills to all users
        $users = User::all();
        foreach ($users as $user) {
            foreach ($defaultSkills as $skill) {
                PlayerSkill::create([
                    'user_id' => $user->id,
                    'skill_name' => $skill['skill_name'],
                    'cooldown_duration' => $skill['cooldown_duration'],
                ]);
            }
        }
    }
}