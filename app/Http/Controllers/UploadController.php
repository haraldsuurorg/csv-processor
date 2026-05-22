<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUploadRequest;
use App\Models\Supplier;
use App\Models\Upload;
use App\Services\CsvProcessor;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UploadController extends Controller
{
    public function store(
        StoreUploadRequest $request,
        Supplier $supplier,
        CsvProcessor $processor,
    ) {
        $processor->process($supplier, $request->file('csv'));

        return redirect()->route('suppliers.edit', $supplier);
    }

    public function destroy(Supplier $supplier, Upload $upload)
    {
        Storage::deleteDirectory("uploads/{$supplier->id}/{$upload->id}");

        $upload->delete();

        return redirect()->route('suppliers.edit', $supplier);
    }

    public function downloadOriginal(Supplier $supplier, Upload $upload): StreamedResponse
    {
        return Storage::download($upload->originalPath(), $upload->original_filename);
    }

    public function downloadProcessed(Supplier $supplier, Upload $upload): StreamedResponse
    {
        abort_unless($upload->physical_csv_written, 404);

        return Storage::download(
            $upload->processedPath(),
            "processed-{$upload->original_filename}",
        );
    }
}
