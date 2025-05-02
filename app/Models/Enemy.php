<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enemy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'level_group',
        'hp',
        'attack_min',
        'attack_max',
        'defense',
        'image_path',
    ];
}