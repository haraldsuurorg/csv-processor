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

        $this->runProcessing($upload, $supplier);

        return $upload;
    }

    public function reprocess(Upload $upload): Upload
    {
        $upload->processedRows()->delete();

        if ($upload->physical_csv_written) {
            Storage::delete($upload->processedPath());
        }

        $upload->update([
            'status' => UploadStatus::Pending,
            'error' => null,
            'row_count' => null,
            'physical_csv_written' => false,
            'processed_at' => null,
        ]);

        $this->runProcessing($upload, $upload->supplier);

        return $upload;
    }

    private function runProcessing(Upload $upload, Supplier $supplier): void
    {
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
    }

    /**
     * @return array{int, bool}
     */
    private function processRows(Upload $upload, Supplier $supplier): array
    {
        $reader = Reader::fromString(Storage::get($upload->originalPath()));
        $reader->setHeaderOffset(0);

        $strategies = $supplier->rules()->orderBy('sort_order')->get()
            ->map(fn ($rule) => [
                'strategy' => $this->resolver->resolve($rule->type),
                'config' => $rule->config,
            ]);

        $writer = null;
        $writeStream = null;
        if ($supplier->write_physical_csv) {
            $writeStream = fopen('php://temp', 'r+');
            $writer = Writer::from($writeStream);
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

        if ($writeStream !== null) {
            rewind($writeStream);
            Storage::writeStream($upload->processedPath(), $writeStream);
            fclose($writeStream);
        }

        return [$rowCount, $writer !== null];
    }
}
