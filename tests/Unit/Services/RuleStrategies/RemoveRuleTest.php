<?php

namespace Tests\Unit\Services\RuleStrategies;

use App\Services\RuleStrategies\RemoveRule;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class RemoveRuleTest extends TestCase
{
    public function test_removes_specified_column_from_row(): void
    {
        $rule = new RemoveRule;

        $result = $rule->apply(
            ['sku' => 'ABC', 'temp' => 'discard me', 'price' => 10],
            ['column' => 'temp'],
        );

        $this->assertSame(['sku' => 'ABC', 'price' => 10], $result);
    }

    public function test_returns_row_unchanged_when_target_column_missing(): void
    {
        $rule = new RemoveRule;
        $row = ['sku' => 'ABC'];

        $result = $rule->apply($row, ['column' => 'nonexistent']);

        $this->assertSame($row, $result);
    }

    public function test_throws_when_column_missing_from_config(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new RemoveRule)->apply(['sku' => 'ABC'], []);
    }
}
