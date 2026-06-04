<?php

namespace App\Enums;

use JsonSerializable;

enum Delimiter: string implements JsonSerializable
{
    case Comma = ',';
    case Semicolon = ';';

    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'value' => $this->value,
        ];
    }
}