<?php

namespace App\Services\RuleStrategies;

use InvalidArgumentException;

class RegexRule implements RuleStrategy
{
    /**
     * @param  array<string, mixed>  $row
     * @param  array{column: string, pattern: string, replacement: string}  $config
     * @return array<string, mixed>
     */
    public function apply(array $row, array $config): array
    {
        if (! isset($config['column']) || ! is_string($config['column'])) {
            throw new InvalidArgumentException('Regex rule requires a string "column".');
        }
        if (! isset($config['pattern']) || ! is_string($config['pattern'])) {
            throw new InvalidArgumentException('Regex rule requires a string "pattern".');
        }
        if (! isset($config['replacement']) || ! is_string($config['replacement'])) {
            throw new InvalidArgumentException('Regex rule requires a string "replacement".');
        }

        $column = $config['column'];

        if (! array_key_exists($column, $row)) {
            return $row;
        }

        // Suppressing PHP's native warning so we can surface a clearer exception below.
        $result = @preg_replace($config['pattern'], $config['replacement'], (string) $row[$column]);

        if ($result === null) {
            throw new InvalidArgumentException(
                "Regex rule failed: invalid pattern '{$config['pattern']}'."
            );
        }

        $row[$column] = $result;

        return $row;
    }
}
