<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'write_physical_csv'
    ];

    protected function casts(): array
    {
        return [
            'write_physical_csv' => 'boolean',
        ];
    }
}
