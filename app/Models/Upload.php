<?php

namespace App\Models;

use App\Enums\UploadStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Upload extends Model
{
    protected $fillable = [
        'supplier_id',
        'original_filename',
        'physical_csv_written',
        'status',
        'error',
        'row_count',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'physical_csv_written' => 'boolean',
            'status' => UploadStatus::class,
            'row_count' => 'integer',
            'processed_at' => 'datetime',
        ];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function processedRows(): HasMany
    {
        return $this->hasMany(ProcessedRow::class);
    }

    public function originalPath(): string
    {
        return "uploads/{$this->supplier_id}/{$this->id}/original.csv";
    }

    public function processedPath(): string
    {
        return "uploads/{$this->supplier_id}/{$this->id}/processed.csv";
    }
}
