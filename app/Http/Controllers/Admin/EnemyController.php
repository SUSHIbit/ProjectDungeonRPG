<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enemy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EnemyController extends Controller
{
    public function index()
    {
        $enemies = Enemy::orderBy('level_group')
            ->orderBy('name')
            ->get()
            ->groupBy('level_group');
            
        return Inertia::render('Admin/Enemies/Index', [
            'enemies' => $enemies
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Enemies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level_group' => 'required|integer|min:1|max:5',
            'hp' => 'required|integer|min:1',
            'attack_min' => 'required|integer|min:1',
            'attack_max' => 'required|integer|gte:attack_min',
            'defense' => 'required|integer|min:0',
            'image' => 'required|image|max:2048', // Max 2MB
        ]);

        // Handle image upload
        $path = $request->file('image')->store('enemies', 'public');
        
        Enemy::create([
            'name' => $validated['name'],
            'level_group' => $validated['level_group'],
            'hp' => $validated['hp'],
            'attack_min' => $validated['attack_min'],
            'attack_max' => $validated['attack_max'],
            'defense' => $validated['defense'],
            'image_path' => $path,
        ]);

        return redirect()->route('admin.enemies.index')
            ->with('success', 'Enemy created successfully!');
    }

    public function edit(Enemy $enemy)
    {
        return Inertia::render('Admin/Enemies/Edit', [
            'enemy' => $enemy
        ]);
    }

    public function update(Request $request, Enemy $enemy)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level_group' => 'required|integer|min:1|max:5',
            'hp' => 'required|integer|min:1',
            'attack_min' => 'required|integer|min:1',
            'attack_max' => 'required|integer|gte:attack_min',
            'defense' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048', // Optional image update
        ]);

        // Handle image update if provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($enemy->image_path) {
                Storage::disk('public')->delete($enemy->image_path);
            }
            
            // Upload new image
            $path = $request->file('image')->store('enemies', 'public');
            $validated['image_path'] = $path;
        }

        $enemy->update([
            'name' => $validated['name'],
            'level_group' => $validated['level_group'],
            'hp' => $validated['hp'],
            'attack_min' => $validated['attack_min'],
            'attack_max' => $validated['attack_max'],
            'defense' => $validated['defense'],
            'image_path' => $validated['image_path'] ?? $enemy->image_path,
        ]);

        return redirect()->route('admin.enemies.index')
            ->with('success', 'Enemy updated successfully!');
    }

    public function destroy(Enemy $enemy)
    {
        // Delete image
        if ($enemy->image_path) {
            Storage::disk('public')->delete($enemy->image_path);
        }
        
        $enemy->delete();

        return redirect()->route('admin.enemies.index')
            ->with('success', 'Enemy deleted successfully!');
    }
}