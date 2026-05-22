<?php

namespace App\Enums;

enum UploadStatus: string
{
    case Pending = 'pending';
    case Done = 'done';
    case Failed = 'failed';
}