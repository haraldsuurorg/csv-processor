import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import ColumnMappingFormDialog, {
    type ColumnMapping,
} from '@/components/suppliers/column-mapping-form-dialog';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import suppliersColumnMappings from '@/routes/suppliers/column-mappings';

type Props = {
    supplier: {
        id: number;
        column_mappings: ColumnMapping[];
    };
};

export default function SupplierMappingsSection({ supplier }: Props) {
    const [editingMapping, setEditingMapping] = useState<ColumnMapping | 'new' | null>(null);
    const [deletingMapping, setDeletingMapping] = useState<ColumnMapping | null>(null);

    const handleDelete = () => {
        if (!deletingMapping) return;
        router.delete(
            suppliersColumnMappings.destroy({
                supplier: supplier.id,
                column_mapping: deletingMapping.id,
            }).url,
            { onSuccess: () => setDeletingMapping(null) },
        );
    };

    const mappingForDialog =
        editingMapping === 'new' ? undefined : editingMapping ?? undefined;

    return (
        <div className="mt-6 max-w-2xl border-t pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold">Column mappings</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Map source CSV columns to canonical fields used at export.
                    </p>
                </div>
                <Button onClick={() => setEditingMapping('new')}>Add mapping</Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border">
                {supplier.column_mappings.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No mappings yet.
                    </div>
                ) : (
                    <ul className="divide-y">
                        {supplier.column_mappings.map((mapping) => (
                            <li
                                key={mapping.id}
                                className="flex items-center justify-between gap-3 p-3"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="truncate font-mono text-sm">
                                        {mapping.source_column}
                                    </span>
                                    <span className="text-muted-foreground">→</span>
                                    <Badge variant="secondary">
                                        {mapping.canonical_field}
                                    </Badge>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingMapping(mapping)}
                                    >
                                        Edit
                                    </Button>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => setDeletingMapping(mapping)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete mapping</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete mapping</TooltipContent>
                                    </Tooltip>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ColumnMappingFormDialog
                key={
                    editingMapping === 'new'
                        ? 'mapping-new'
                        : `mapping-${editingMapping?.id ?? 'closed'}`
                }
                supplierId={supplier.id}
                mapping={mappingForDialog}
                open={editingMapping !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingMapping(null);
                }}
            />

            <AlertDialog
                open={deletingMapping !== null}
                onOpenChange={(open) => {
                    if (!open) setDeletingMapping(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this mapping?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deletingMapping && (
                                <>
                                    <span className="font-medium">
                                        {deletingMapping.source_column}
                                    </span>{' '}
                                    →{' '}
                                    <span className="font-medium">
                                        {deletingMapping.canonical_field}
                                    </span>{' '}
                                    will be removed.
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
                            Delete mapping
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
