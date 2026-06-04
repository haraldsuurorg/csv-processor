<?php

namespace App\Models;

use App\Enums\DecimalSeparator;
use App\Enums\Delimiter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'write_physical_csv',
        'delimiter',
        'decimal_separator',
    ];

    protected function casts(): array
    {
        return [
            'write_physical_csv' => 'boolean',
            'delimiter' => Delimiter::class,
            'decimal_separator' => DecimalSeparator::class,
        ];
    }

    public function rules(): HasMany
    {
        return $this->hasMany(Rule::class)->orderBy('sort_order');
    }

    public function columnMappings(): HasMany
    {
        return $this->hasMany(ColumnMapping::class);
    }

    public function uploads(): HasMany
    {
        return $this->hasMany(Upload::class)->latest();
    }
}
