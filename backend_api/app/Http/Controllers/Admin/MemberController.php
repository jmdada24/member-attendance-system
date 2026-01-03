<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
       
        $search = $request->query('search');

        $members = User::query()
            ->where('role', 'member')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json($members);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password'   => ['required', 'string', 'min:6'],

            'subscription_type' => ['nullable', Rule::in(['none', 'basic', 'standard', 'premium'])],
            'subscription_starts_at' => ['nullable', 'date'],
            'subscription_ends_at' => ['nullable', 'date', 'after:subscription_starts_at'],
        ]);

        $subscriptionType = $data['subscription_type'] ?? 'none';

        $member = User::create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
            'role'       => 'member',

            'subscription_type' => $subscriptionType,
            'subscription_starts_at' => $subscriptionType === 'none' ? null : ($data['subscription_starts_at'] ?? now()),
            'subscription_ends_at' => $subscriptionType === 'none' ? null : ($data['subscription_ends_at'] ?? null),
            'qr_token' => $subscriptionType === 'none' ? null : (string) Str::uuid(),
        ]);

        return response()->json($member, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $member = User::query()
            ->where('role', 'member')
            ->findOrFail($id);

        return response()->json($member);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //

        $member = User::query()
            ->where('role', 'member')
            ->findOrFail($id);

        $data = $request->validate([
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name'  => ['sometimes', 'required', 'string', 'max:255'],
            'email'      => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($member->id)],
            'password'   => ['sometimes', 'nullable', 'string', 'min:6'],

            'subscription_type' => ['sometimes', 'nullable', Rule::in(['none', 'basic', 'standard', 'premium'])],
            'subscription_starts_at' => ['sometimes', 'nullable', 'date'],
            'subscription_ends_at' => ['sometimes', 'nullable', 'date', 'after:subscription_starts_at'],
        ]);

        if (array_key_exists('password', $data)) {
            if ($data['password']) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }
        }

        // Subscription rules
        if (array_key_exists('subscription_type', $data)) {
            $type = $data['subscription_type'] ?? 'none';

            if ($type === 'none') {
                $data['subscription_starts_at'] = null;
                $data['subscription_ends_at'] = null;
                $data['qr_token'] = null;
            } else {
                // if activating subscription and no qr_token yet, generate one
                if (!$member->qr_token) {
                    $data['qr_token'] = (string) Str::uuid();
                }
                if (!array_key_exists('subscription_starts_at', $data)) {
                    $data['subscription_starts_at'] = now();
                }
            }
        }

        $member->update($data);

        return response()->json($member);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $member = User::query()
            ->where('role', 'member')
            ->findOrFail($id);

        $member->delete();

        return response()->json(['message' => 'Member deleted']);
        
    }
}
