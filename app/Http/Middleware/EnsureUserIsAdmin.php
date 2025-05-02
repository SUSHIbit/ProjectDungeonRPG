<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            return redirect()->route('player.dashboard')
                ->with('error', 'You do not have permission to access this area.');
        }

        return $next($request);
    }
}