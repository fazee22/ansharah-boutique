<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
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
            'group' => ['required', Rule::in(['website', 'whatsapp', 'seo', 'homepage', 'marquee', 'sale', 'about'])],
            'values' => ['required', 'array'],
        ];
    }
}
