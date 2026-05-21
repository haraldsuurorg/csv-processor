<?php

namespace App\Http\Requests;

use App\Enums\RuleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(RuleType::class)],
            'config' => ['required', 'array'],
            'config.column' => ['required', 'string', 'max:255'],
            'config.factor' => ['required_if:type,multiply', 'numeric'],
            'config.pattern' => ['requited_if:type,regex', 'string'],
            'config.replacement' => ['required_if:type,regex', 'string'],
        ];
    }
}
