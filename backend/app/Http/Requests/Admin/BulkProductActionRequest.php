<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkProductActionRequest extends FormRequest
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
            'product_ids' => ['required', 'array', 'min:1'],
            'product_ids.*' => ['integer', Rule::exists('products', 'id')],
            'action' => ['required', Rule::in(['delete', 'publish', 'draft', 'hide', 'change_category'])],
            'category_id' => ['required_if:action,change_category', 'integer', Rule::exists('categories', 'id')],
        ];
    }
}
