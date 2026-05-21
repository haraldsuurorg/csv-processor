<?php

namespace App\Enums;

enum CanonicalField:string
{
    case ProductName = 'ProductName';
    case Quantity = 'Quantity';
    case Price = 'Price';
    case SKU = 'SKU';
}