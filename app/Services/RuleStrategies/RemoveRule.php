<?php

namespace App\Services\RuleStrategies;

use InvalidArgumentException;

class RemoveRule implements RuleStrategy
{
    /**
     * @param  array<string, mixed>  $row
     * @param  array{column: string}  $config
     * @return array<string, mixed>
     */
    public function apply(array $row, array $config): array
    {
        if (! isset($config['column']) || ! is_string($config['column'])) {
            throw new InvalidArgumentException('Remove rule requires a string "column".');
        }

        unset($row[$config['column']]);

        return $row;
    }
}
