<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRuleRequest;
use App\Http\Requests\UpdateRuleRequest;
use App\Models\Rule;
use App\Models\Supplier;

class RuleController extends Controller
{
    public function store(StoreRuleRequest $request, Supplier $supplier)
    {
        $supplier->rules()->create([
            ...$request->validated(),
            'sort_order' => ($supplier->rules()->max('sort_order') ?? 0) + 1,
        ]);
    }

    public function update(UpdateRuleRequest $request, Rule $rule)
    {
        $rule->update($request->validated());

        return redirect()->route('suppliers.edit', $rule->supplier_id);
    }

    public function destroy(Rule $rule)
    {
        $rule->delete();

        return redirect()->route('suppliers.edit', $rule->supplier_id);
    }
}
