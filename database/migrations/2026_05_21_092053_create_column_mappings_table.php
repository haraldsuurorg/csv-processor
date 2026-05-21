<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('column_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $table->string('source_column');
            $table->string('canonical_field');
            $table->timestamps();

            $table->unique(['supplier_id', 'source_column']);
            $table->unique(['supplier_id', 'canonical_field']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('column_mappings');
    }
};
