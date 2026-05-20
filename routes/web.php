<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SupplierController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('suppliers', SupplierController::class)->except(['show', 'create']);
});

require __DIR__.'/settings.php';
