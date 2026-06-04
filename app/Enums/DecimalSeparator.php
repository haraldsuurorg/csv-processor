<?php

namespace App\Enums;

use JsonSerializable;

enum DecimalSeparator: string implements JsonSerializable
{
    case Comma = ',';
    case Period = '.';

    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'value' => $this->value,
        ];
    }
}