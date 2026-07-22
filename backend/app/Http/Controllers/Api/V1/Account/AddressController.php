<?php

namespace App\Http\Controllers\Api\V1\Account;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\StoreAddressRequest;
use App\Http\Requests\Account\UpdateAddressRequest;
use App\Http\Resources\Admin\AddressResource;
use App\Models\Address;
use App\Services\AccountAddressService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Reuses `Http\Resources\Admin\AddressResource` — the JSON shape a
 * customer needs for their own address is identical to what the
 * admin's Customer Detail page shows for it; duplicating an
 * identical resource class under a second namespace wouldn't add
 * anything.
 */
class AddressController extends Controller
{
    public function __construct(private readonly AccountAddressService $addresses) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::success(AddressResource::collection($request->user()->addresses));
    }

    public function store(StoreAddressRequest $request): JsonResponse
    {
        $address = $this->addresses->create($request->user(), $request->validated());

        return ApiResponse::success(new AddressResource($address), 'Address added.');
    }

    public function update(UpdateAddressRequest $request, Address $address): JsonResponse
    {
        $updated = $this->addresses->update($request->user(), $address, $request->validated());

        return ApiResponse::success(new AddressResource($updated), 'Address updated.');
    }

    public function destroy(Request $request, Address $address): JsonResponse
    {
        $this->addresses->delete($request->user(), $address);

        return ApiResponse::success(null, 'Address removed.');
    }

    public function setDefault(Request $request, Address $address): JsonResponse
    {
        $updated = $this->addresses->setDefault($request->user(), $address);

        return ApiResponse::success(new AddressResource($updated), 'Default address updated.');
    }
}
