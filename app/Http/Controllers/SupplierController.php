<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        return Inertia::render('suppliers/index', [
            'suppliers' => Supplier::orderBy('name')->get(),
        ]);
    }

    public function show(Supplier $supplier)
    {
        return Inertia::render('suppliers/show', [
            'supplier' => $supplier->load('uploads'),
            'breadcrumbs' => [
                ['title' => 'Suppliers', 'href' => route('suppliers.index')],
                ['title' => $supplier->name, 'href' => route('suppliers.show', $supplier)]
            ],
        ]);
    }

    public function store(StoreSupplierRequest $request)
    {
        Supplier::create($request->validated());

        return redirect()->route('suppliers.index');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('suppliers/edit', [
            'supplier' => $supplier->load('rules', 'columnMappings'),
            'breadcrumbs' => [
                ['title' => 'Suppliers', 'href' => route('suppliers.index')],
                ['title' => $supplier->name, 'href' => route('suppliers.show', $supplier)],
                ['title' => 'Edit', 'href' => route('suppliers.edit', $supplier)],
            ],
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $supplier->update($request->validated());

        return redirect()->route('suppliers.edit', $supplier);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('suppliers.index');
    }
}
