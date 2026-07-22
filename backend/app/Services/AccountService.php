<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/** Powers Customer Dashboard → Profile and → Account Settings (password change). */
class AccountService
{
    public function updateProfile(User $user, array $attributes): User
    {
        $user->update($attributes);

        return $user->fresh();
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages(['current_password' => 'Your current password is incorrect.']);
        }

        $user->update(['password' => $newPassword]);
    }
}
