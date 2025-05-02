<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enemies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('level_group');  // 1-10, 11-20, etc.
            $table->integer('hp');
            $table->integer('attack_min');
            $table->integer('attack_max');
            $table->integer('defense');
            $table->string('image_path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enemies');
    }
};
