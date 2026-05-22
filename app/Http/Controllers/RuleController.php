<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRuleRequest;
use App\Http\Requests\UpdateRuleRequest;
use App\Models\Rule;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function move(Request $request, Supplier $supplier, Rule $rule)
    {
        $direction = $request->validate([
            'direction' => ['required', 'in:up,down'],
        ])['direction'];

        $neighbor = $supplier->rules()
            ->where('sort_order', $direction === 'up' ? '<' : '>', $rule->sort_order)
            ->orderBy('sort_order', $direction === 'up' ? 'desc' : 'asc')
            ->first();

        if ($neighbor) {
            DB::transaction(function () use ($rule, $neighbor) {
                [$rule->sort_order, $neighbor->sort_order] = [
                    $neighbor->sort_order,
                    $rule->sort_order,
                ];
                $rule->save();
                $neighbor->save();
            });
        }

        return redirect()->route('suppliers.edit', $supplier);
    }
}
