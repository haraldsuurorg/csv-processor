<?php

use App\Http\Controllers\ColumnMappingController;
use App\Http\Controllers\RuleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SupplierController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('suppliers', SupplierController::class)->except(['show', 'create']);

    Route::resource('suppliers.rules', RuleController::class)
        ->scoped()
        ->only(['store', 'update', 'destroy']);

    Route::resource('suppliers.column-mappings', ColumnMappingController::class)
        ->scoped()
        ->only(['store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';