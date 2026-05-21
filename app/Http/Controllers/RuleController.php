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

        return redirect()->route('suppliers.edit', $supplier);
    }

    public function update(UpdateRuleRequest $request, Supplier $supplier, Rule $rule)
    {
        $rule->update($request->validated());

        return redirect()->route('suppliers.edit', $supplier);
    }

    public function destroy(Supplier $supplier, Rule $rule)
    {
        $rule->delete();

        return redirect()->route('suppliers.edit', $supplier);
    }
}
