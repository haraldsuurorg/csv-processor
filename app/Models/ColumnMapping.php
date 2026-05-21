<?php

namespace App\Models;

use App\Enums\CanonicalField;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ColumnMapping extends Model
{
    protected $fillable = [
        'supplier_id',
        'source_column',
        'canonical_field',
    ];

    protected function casts():array
    {
        return [
            'canonical_field' => CanonicalField::class,
        ];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
