import { router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ExternalLink, Trash2 } from 'lucide-react';
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
import { DataTable } from '@/components/ui/data-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

const STATUS_VARIANTS: Record<UploadStatus, 'default' | 'secondary' | 'destructive'> = {
    pending: 'secondary',
    done: 'default',
    failed: 'destructive',
};

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('et-EE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
});

function formatDateTime(iso: string): string {
    return DATE_TIME_FORMAT.format(new Date(iso));
}

type Props = {
    supplierId: number;
    uploads: Upload[];
};

export default function SupplierUploadsTable({ supplierId, uploads }: Props) {
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

    const columns: ColumnDef<Upload>[] = [
        {
            accessorKey: 'original_filename',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2 h-7"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Filename
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-sm font-medium">{row.original.original_filename}</span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const upload = row.original;
                return (
                    <div className="flex flex-col gap-0.5">
                        <Badge
                            variant={STATUS_VARIANTS[upload.status]}
                            className="w-fit capitalize"
                        >
                            {upload.status}
                        </Badge>
                        {upload.status === 'failed' && upload.error && (
                            <p className="text-xs wrap-break-word text-destructive">
                                {upload.error}
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'row_count',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2 h-7"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Rows
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) =>
                row.original.row_count !== null ? (
                    <span className="text-sm tabular-nums">
                        {row.original.row_count.toLocaleString()}
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2 h-7"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Uploaded
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-sm tabular-nums text-muted-foreground">
                    {formatDateTime(row.original.created_at)}
                </span>
            ),
        },
        {
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const upload = row.original;
                return (
                    <div className="flex justify-end gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                                Download the originally uploaded file
                            </TooltipContent>
                        </Tooltip>
                        {upload.physical_csv_written && (
                            <Tooltip>
                                <TooltipTrigger asChild>
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
                                </TooltipTrigger>
                                <TooltipContent>
                                    Download the file on which the rules have been applied
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {upload.status === 'done' && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" asChild>
                                        <a
                                            href={
                                                suppliersUploads.export({
                                                    supplier: supplierId,
                                                    upload: upload.id,
                                                }).url
                                            }
                                        >
                                            Export
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Generate and download the file on which the rules and column name mapping have been applied
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingUpload(upload)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete upload</span>
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={uploads}
                emptyMessage="No uploads yet."
            />

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
        </>
    );
}
