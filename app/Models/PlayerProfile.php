<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'character_name',
        'current_level',
        'max_hp',
        'attack_min',
        'attack_max',
        'defense',
        'heal',
        'highest_level_reached',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
