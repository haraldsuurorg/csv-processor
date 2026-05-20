<?php

namespace App\Services\RuleStrategies;

interface RuleStrategy
{
    /**
     * Apply this rule to a single CSV row.
     *
     * @param  array<string, mixed>  $row  Source row keyed by column name.
     * @param  array<string, mixed>  $config  Rule-specific configuration.
     * @return array<string, mixed>  The transformed row.
     */
    public function apply(array $row, array $config): array;
}
