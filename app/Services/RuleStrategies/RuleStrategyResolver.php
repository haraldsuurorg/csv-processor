<?php

namespace App\Services\RuleStrategies;

use App\Enums\RuleType;

class RuleStrategyResolver
{
    public function resolve(RuleType $type): RuleStrategy
    {
        return match ($type) {
            RuleType::Multiply => new MultiplyRule,
            RuleType::Remove => new RemoveRule,
            RuleType::Regex => new RegexRule,
        };
    }
}