<?php

namespace Tests\Unit\Services\RuleStrategies;

use App\Services\RuleStrategies\RegexRule;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class RegexRuleTest extends TestCase
{
    public function test_replaces_matched_text_in_column_value(): void
    {
        $rule = new RegexRule;

        $result = $rule->apply(
            ['sku' => 'OLD-12345'],
            ['column' => 'sku', 'pattern' => '/^OLD-/', 'replacement' => 'NEW-'],
        );

        $this->assertSame('NEW-12345', $result['sku']);
    }

    public function test_supports_backreferences_in_replacement(): void
    {
        $rule = new RegexRule;

        $result = $rule->apply(
            ['name' => 'Acme Imports'],
            ['column' => 'name', 'pattern' => '/^(\w+) (\w+)$/', 'replacement' => '$2 $1'],
        );

        $this->assertSame('Imports Acme', $result['name']);
    }

    public function test_returns_row_unchanged_when_target_column_missing(): void
    {
        $rule = new RegexRule;
        $row = ['sku' => 'ABC'];

        $result = $rule->apply($row, [
            'column' => 'name',
            'pattern' => '/foo/',
            'replacement' => 'bar',
        ]);

        $this->assertSame($row, $result);
    }

    public function test_throws_when_required_config_keys_missing(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new RegexRule)->apply(
            ['sku' => 'ABC'],
            ['column' => 'sku', 'pattern' => '/x/'],
        );
    }

    public function test_throws_when_pattern_is_invalid(): void
    {
        $this->expectException(InvalidArgumentException::class);

        // Missing delimiters — preg_replace returns null, which we surface as an exception.
        (new RegexRule)->apply(
            ['sku' => 'ABC'],
            ['column' => 'sku', 'pattern' => 'no-delimiters', 'replacement' => 'x'],
        );
    }
}
