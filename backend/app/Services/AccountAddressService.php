<?php

namespace App\Services;

use App\Models\Address;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/** Powers Customer Dashboard → Addresses. Every method scopes to the given `$user`, never trusting an address id alone — see each method's `where('user_id', ...)` guard. */
class AccountAddressService
{
    public function create(User $user, array $attributes): Address
    {
        return DB::transaction(function () use ($user, $attributes) {
            if (! empty($attributes['is_default'])) {
                $user->addresses()->update(['is_default' => false]);
            }

            return $user->addresses()->create($attributes);
        });
    }

    public function update(User $user, Address $address, array $attributes): Address
    {
        abort_unless($address->user_id === $user->id, 403);

        return DB::transaction(function () use ($user, $address, $attributes) {
            if (! empty($attributes['is_default'])) {
                $user->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
            }

            $address->update($attributes);

            return $address->fresh();
        });
    }

    public function delete(User $user, Address $address): void
    {
        abort_unless($address->user_id === $user->id, 403);
        $address->delete();
    }

    public function setDefault(User $user, Address $address): Address
    {
        abort_unless($address->user_id === $user->id, 403);

        return DB::transaction(function () use ($user, $address) {
            $user->addresses()->update(['is_default' => false]);
            $address->update(['is_default' => true]);

            return $address->fresh();
        });
    }
}
