<?php

namespace App\Http\Requests;

use App\Enums\DecimalSeparator;
use App\Enums\Delimiter;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'write_physical_csv' => ['boolean'],
            'delimiter' => ['required', Rule::enum(Delimiter::class)],
            'decimal_separator' => ['required', 'different:delimiter', Rule::enum(DecimalSeparator::class)],
        ];
    }
}
