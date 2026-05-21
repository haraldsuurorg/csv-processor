<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreColumnMappingRequest;
use App\Http\Requests\UpdateColumnMappingRequest;
use App\Models\ColumnMapping;
use App\Models\Supplier;
use Illuminate\Http\Request;

class ColumnMappingController extends Controller
{
    public function store(StoreColumnMappingRequest $request, Supplier $supplier)
    {
        $supplier->columnMappings()->create($request->validated());
    }

    public function update(
        UpdateColumnMappingRequest $request,
        Supplier $supplier,
        ColumnMapping $columnMapping,
    ) {
        $columnMapping->update($request->validated());

        return redirect()->route('suppliers.edit', $supplier);
    }

    public function destroy(Supplier $supplier, ColumnMapping $columnMapping)
    {
        $columnMapping->delete();

        return redirect()->route('suppliers.edit', $supplier);
    }
}
