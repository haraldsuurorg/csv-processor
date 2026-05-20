<?php

namespace Tests\Unit\Services\RuleStrategies;

use App\Services\RuleStrategies\MultiplyRule;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class MultiplyRuleTest extends TestCase
{
    public function test_multiplies_column_value_by_factor(): void
    {
        $rule = new MultiplyRule;

        $result = $rule->apply(
            ['price' => 10, 'sku' => 'ABC'],
            ['column' => 'price', 'factor' => 1.5],
        );

        $this->assertSame(15.0, $result['price']);
        $this->assertSame('ABC', $result['sku']);
    }

    public function test_coerces_numeric_string_values(): void
    {
        $rule = new MultiplyRule;

        $result = $rule->apply(
            ['price' => '19.99'],
            ['column' => 'price', 'factor' => 2],
        );

        $this->assertSame(39.98, $result['price']);
    }

    public function test_returns_row_unchanged_when_target_column_missing(): void
    {
        $rule = new MultiplyRule;
        $row = ['sku' => 'ABC'];

        $result = $rule->apply($row, ['column' => 'price', 'factor' => 1.5]);

        $this->assertSame($row, $result);
    }

    public function test_throws_when_column_missing_from_config(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new MultiplyRule)->apply(['price' => 10], ['factor' => 1.5]);
    }

    public function test_throws_when_factor_missing_from_config(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new MultiplyRule)->apply(['price' => 10], ['column' => 'price']);
    }
}
