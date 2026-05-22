<?php

use App\Http\Controllers\ColumnMappingController;
use App\Http\Controllers\RuleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UploadController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('suppliers', SupplierController::class)->except(['create']);

    Route::resource('suppliers.rules', RuleController::class)
        ->scoped()
        ->only(['store', 'update', 'destroy']);

    Route::resource('suppliers.column-mappings', ColumnMappingController::class)
        ->scoped()
        ->only(['store', 'update', 'destroy']);

    Route::resource('suppliers.uploads', UploadController::class)
        ->scoped()
        ->only(['store', 'destroy']);

    Route::get(
        'suppliers/{supplier}/uploads/{upload}/download-original',
        [UploadController::class, 'downloadOriginal'],
    )->scopeBindings()->name('suppliers.uploads.download-original');

    Route::get(
        'suppliers/{supplier}/uploads/{upload}/download-processed',
        [UploadController::class, 'downloadProcessed'],
    )->scopeBindings()->name('suppliers.uploads.download-processed');
});

require __DIR__.'/settings.php';