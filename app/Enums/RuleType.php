<?php

namespace App\Enums;

enum RuleType: string
{
    case Multiply = 'multiply';
    case Remove = 'remove';
    case Regex = 'regex';
}
