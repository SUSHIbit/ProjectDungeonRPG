<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PlayerProfile;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => false, // Default to regular player
        ]);

        // Create player profile
        PlayerProfile::create([
            'user_id' => $user->id,
            'character_name' => 'Unnamed Hero',
            'current_level' => 1,
            'max_hp' => 100,
            'attack_min' => 10,
            'attack_max' => 15,
            'defense' => 5,
            'heal' => 20,
            'highest_level_reached' => 1,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect to player dashboard after registration
        return redirect(route('player.dashboard'));
    }
}