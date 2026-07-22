<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InitiatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'order_number' => ['required', 'string', 'exists:orders,order_number'],
            // Required for a guest caller as a lightweight ownership check
            // (there's no cart-linked checkout session yet to derive this
            // from automatically) — an authenticated request additionally
            // verifies the order actually belongs to that user.
            'email' => ['required', 'email'],
            'gateway' => ['required', Rule::in(['stripe', 'jazzcash', 'easypaisa', 'cod'])],
        ];
    }
}
