<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('character_name')->nullable();
            $table->integer('current_level')->default(1);
            $table->integer('max_hp')->default(100);
            $table->integer('attack_min')->default(10);
            $table->integer('attack_max')->default(15);
            $table->integer('defense')->default(5);
            $table->integer('heal')->default(20);
            $table->integer('highest_level_reached')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_profiles');
    }
};