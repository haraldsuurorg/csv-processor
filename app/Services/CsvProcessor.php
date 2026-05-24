<?php

namespace App\Services;

use App\Enums\UploadStatus;
use App\Models\ProcessedRow;
use App\Models\Supplier;
use App\Models\Upload;
use App\Services\RuleStrategies\RuleStrategyResolver;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;
use League\Csv\Writer;
use Throwable;

class CsvProcessor
{
    private const CHUNK_SIZE = 500;

    public function __construct(
        private readonly RuleStrategyResolver $resolver,
    ) {}

    public function process(Supplier $supplier, UploadedFile $file): Upload
    {
        $upload = $supplier->uploads()->create([
            'original_filename' => $file->getClientOriginalName(),
            'status' => UploadStatus::Pending,
        ]);

        $file->storeAs(
            "uploads/{$supplier->id}/{$upload->id}",
            'original.csv',
        );

        try {
            [$rowCount, $physicalCsvWritten] = $this->processRows($upload, $supplier);

            $upload->update([
                'status' => UploadStatus::Done,
                'row_count' => $rowCount,
                'physical_csv_written' => $physicalCsvWritten,
                'processed_at' => now(),
            ]);
        } catch (Throwable $e) {
            $upload->update([
                'status' => UploadStatus::Failed,
                'error' => $e->getMessage(),
            ]);
        }

        return $upload;
    }

    /**
     * @return array{int, bool}
     */
    private function processRows(Upload $upload, Supplier $supplier): array
    {
        $reader = Reader::from(Storage::path($upload->originalPath()), 'r');
        $reader->setHeaderOffset(0);

        $strategies = $supplier->rules()->orderBy('sort_order')->get()
            ->map(fn ($rule) => [
                'strategy' => $this->resolver->resolve($rule->type),
                'config' => $rule->config,
            ]);

        $writer = null;
        if ($supplier->write_physical_csv) {
            $writer = Writer::from(Storage::path($upload->processedPath()), 'w+');
        }

        $rowCount = 0;
        $buffer = [];
        $headerWritten = false;

        foreach ($reader->getRecords() as $row) {
            foreach ($strategies as $item) {
                $row = $item['strategy']->apply($row, $item['config']);
            }

            $buffer[] = [
                'upload_id' => $upload->id,
                'data' => json_encode($row, JSON_THROW_ON_ERROR),
            ];

            if ($writer !== null) {
                if (!$headerWritten) {
                    $writer->insertOne(array_keys($row));
                    $headerWritten = true;
                }
                $writer->insertOne(array_values($row));
            }

            $rowCount++;

            if (count($buffer) >= self::CHUNK_SIZE) {
                ProcessedRow::insert($buffer);
                $buffer = [];
            }
        }

        if (!empty($buffer)) {
            ProcessedRow::insert($buffer);
        }

        return [$rowCount, $writer !== null];
    }
}
