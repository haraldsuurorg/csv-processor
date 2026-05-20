<?php

namespace App\Services\RuleStrategies;

use InvalidArgumentException;

class MultiplyRule implements RuleStrategy
{
    /**
     * @param  array<string, mixed>  $row
     * @param  array{column: string, factor: float|int|string}  $config
     * @return array<string, mixed>
     */
    public function apply(array $row, array $config): array
    {
        if (! isset($config['column']) || ! is_string($config['column'])) {
            throw new InvalidArgumentException('Multiply rule requires a string "column".');
        }
        if (! isset($config['factor']) || ! is_numeric($config['factor'])) {
            throw new InvalidArgumentException('Multiply rule requires a numeric "factor".');
        }

        $column = $config['column'];

        if (! array_key_exists($column, $row)) {
            return $row;
        }

        $row[$column] = (float) $row[$column] * (float) $config['factor'];

        return $row;
    }
}
