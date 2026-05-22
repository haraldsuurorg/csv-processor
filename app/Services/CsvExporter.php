<?php

namespace App\Services;

use App\Models\Upload;
use Illuminate\Support\Facades\Storage;
use League\Csv\Writer;

class CsvExporter
{
    /**
     * Stream the canonical (post-mapping) CSV directly to PHP output.
     */
    public function streamToOutput(Upload $upload): void
    {
        $writer = Writer::from(fopen('php://output', 'w'));
        $this->writeTo($writer, $upload);
    }

    private function writeTo(Writer $writer, Upload $upload): void
    {
        $mappings = $upload->supplier->columnMappings;

        $headers = $mappings->pluck('canonical_field')
            ->map(fn ($field) => $field->value)
            ->all();

        $writer->insertOne($headers);

        foreach ($upload->processedRows()->cursor() as $processedRow) {
            $row = [];
            foreach ($mappings as $mapping) {
                $row[] = $processedRow->data[$mapping->source_column] ?? '';
            }
            $writer->insertOne($row);
        }
    }
}