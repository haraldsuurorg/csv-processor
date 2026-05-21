<?php

namespace App\Http\Requests;

use App\Enums\CanonicalField;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateColumnMappingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supplierId = $this->route('supplier')->id;
        $mappingId = $this->route('column_mapping')->id;

        return [
            'source_column' => [
                'required', 'string', 'max:255',
                Rule::unique('column_mappings')
                    ->where('supplier_id', $supplierId)
                    ->ignore($mappingId),
            ],
            'canonical_field' => [
                'required',
                Rule::enum(CanonicalField::class),
                Rule::unique('column_mappings')
                    ->where('supplier_id', $supplierId)
                    ->ignore($mappingId),
            ],
        ];
    }
}
