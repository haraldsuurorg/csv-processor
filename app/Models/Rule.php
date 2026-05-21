<?php

namespace App\Models;

use App\Enums\RuleType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rule extends Model
{
    protected $fillable = [
        'supplier_id',
        'type',
        'config',
        'sort_order',
    ];

    protected function casts():array
    {
        return [
            'type' => RuleType::class,
            'config' => 'array',
            'sort_order' => 'integer',
        ];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
