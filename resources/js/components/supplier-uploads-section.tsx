import { Form, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import suppliersUploads from '@/routes/suppliers/uploads';

export type UploadStatus = 'pending' | 'done' | 'failed';

export type Upload = {
    id: number;
    original_filename: string;
    physical_csv_written: boolean;
    status: UploadStatus;
    error: string | null;
    row_count: number | null;
    processed_at: string | null;
    created_at: string;
};

type Props = {
    supplierId: number;
    uploads: Upload[];
};

const STATUS_VARIANTS: Record<UploadStatus, 'default' | 'secondary' | 'destructive'> = {
    pending: 'secondary',
    done: 'default',
    failed: 'destructive',
};

export default function SupplierUploadsSection({ supplierId, uploads }: Props) {
    const [deletingUpload, setDeletingUpload] = useState<Upload | null>(null);

    const handleDelete = () => {
        if (!deletingUpload) return;
        router.delete(
            suppliersUploads.destroy({
                supplier: supplierId,
                upload: deletingUpload.id,
            }).url,
            { onSuccess: () => setDeletingUpload(null) },
        );
    };

    return (
        <div className="mt-6 max-w-2xl border-t pt-6">
            <div>
                <h2 className="text-base font-semibold">Uploads</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Upload a CSV file to apply this supplier's rules and store the result.
                </p>
            </div>

            <Form
                {...suppliersUploads.store.form(supplierId)}
                disableWhileProcessing
                resetOnSuccess
                className="mt-4 flex flex-col gap-2"
            >
                {({ processing, errors }) => (
                    <>
                        <Label htmlFor="csv">CSV file</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="csv"
                                name="csv"
                                type="file"
                                accept=".csv,.txt"
                                required
                                className="cursor-pointer"
                            />
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Upload
                            </Button>
                        </div>
                        {errors.csv && (
                            <p className="text-sm text-destructive">{errors.csv}</p>
                        )}
                    </>
                )}
            </Form>

            <div className="mt-4 overflow-hidden rounded-xl border">
                {uploads.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No uploads yet.
                    </div>
                ) : (
                    <ul className="divide-y">
                        {uploads.map((upload) => (
                            <li
                                key={upload.id}
                                className="flex items-start justify-between gap-3 p-3"
                            >
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate text-sm font-medium">
                                            {upload.original_filename}
                                        </span>
                                        <Badge
                                            variant={STATUS_VARIANTS[upload.status]}
                                            className="capitalize"
                                        >
                                            {upload.status}
                                        </Badge>
                                    </div>
                                    {upload.status === 'done' && upload.row_count !== null && (
                                        <p className="text-xs text-muted-foreground">
                                            {upload.row_count.toLocaleString()} rows processed
                                        </p>
                                    )}
                                    {upload.status === 'failed' && upload.error && (
                                        <p className="text-xs break-words text-destructive">
                                            {upload.error}
                                        </p>
                                    )}
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    <Button variant="ghost" size="sm" asChild>
                                        <a
                                            href={
                                                suppliersUploads.downloadOriginal({
                                                    supplier: supplierId,
                                                    upload: upload.id,
                                                }).url
                                            }
                                        >
                                            Original
                                        </a>
                                    </Button>
                                    {upload.physical_csv_written && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <a
                                                href={
                                                    suppliersUploads.downloadProcessed({
                                                        supplier: supplierId,
                                                        upload: upload.id,
                                                    }).url
                                                }
                                            >
                                                Processed
                                            </a>
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeletingUpload(upload)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <AlertDialog
                open={deletingUpload !== null}
                onOpenChange={(open) => {
                    if (!open) setDeletingUpload(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this upload?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deletingUpload && (
                                <>
                                    <span className="font-medium">
                                        {deletingUpload.original_filename}
                                    </span>{' '}
                                    and all its processed rows will be permanently removed.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete upload
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
