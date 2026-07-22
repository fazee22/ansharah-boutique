<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddNoteRequest;
use App\Http\Requests\Admin\UpdateCustomerStatusRequest;
use App\Http\Resources\Admin\CustomerResource;
use App\Models\User;
use App\Services\CustomerService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(private readonly CustomerService $customers) {}

    /** `?search=`, `?account_status=`, paginated. */
    public function index(Request $request): JsonResponse
    {
        $customers = User::query()
            ->customers()
            ->withCount('orders')
            ->search($request->string('search')->toString() ?: null)
            ->when($request->filled('account_status'), fn ($query) => $query->where('account_status', $request->string('account_status')))
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(CustomerResource::collection($customers));
    }

    public function show(User $customer): JsonResponse
    {
        $customer->load(['addresses', 'customerNotes.author']);

        return ApiResponse::success([
            'customer' => new CustomerResource($customer),
            'stats' => $this->customers->stats($customer),
        ]);
    }

    public function updateStatus(UpdateCustomerStatusRequest $request, User $customer): JsonResponse
    {
        $updated = $this->customers->setAccountStatus($customer, $request->validated('account_status'));

        return ApiResponse::success(new CustomerResource($updated), 'Account status updated.');
    }

    public function addNote(AddNoteRequest $request, User $customer): JsonResponse
    {
        $updated = $this->customers->addNote($customer, $request->user()?->id, $request->validated('body'));

        return ApiResponse::success(new CustomerResource($updated->load('customerNotes.author')), 'Note added.');
    }
}
