import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import suppliersColumnMappings from '@/routes/suppliers/column-mappings';

export type CanonicalField = 'ProductName' | 'Quantity' | 'Price' | 'SKU';

export type ColumnMapping = {
    id: number;
    source_column: string;
    canonical_field: CanonicalField;
};

const CANONICAL_FIELDS: CanonicalField[] = ['ProductName', 'Quantity', 'Price', 'SKU'];

type Props = {
    supplierId: number;
    mapping?: ColumnMapping;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function ColumnMappingFormDialog({
    supplierId,
    mapping,
    open,
    onOpenChange,
}: Props) {
    const isEdit = mapping !== undefined;

    const formProps = isEdit
        ? suppliersColumnMappings.update.form({
              supplier: supplierId,
              column_mapping: mapping.id,
          })
        : suppliersColumnMappings.store.form(supplierId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit mapping' : 'Add mapping'}</DialogTitle>
                    <DialogDescription>
                        Map a column from the supplier's CSV to one of the canonical export fields.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...formProps}
                    onSuccess={() => onOpenChange(false)}
                    disableWhileProcessing
                    className="flex flex-col gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="source_column">Source column</Label>
                                <Input
                                    id="source_column"
                                    name="source_column"
                                    type="text"
                                    required
                                    defaultValue={mapping?.source_column ?? ''}
                                    placeholder="price"
                                    autoComplete="off"
                                />
                                <p className="text-xs text-muted-foreground">
                                    The exact column name as it appears in the supplier's CSV header.
                                </p>
                                <InputError message={errors.source_column} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="canonical_field">Canonical field</Label>
                                <Select
                                    name="canonical_field"
                                    defaultValue={mapping?.canonical_field}
                                >
                                    <SelectTrigger id="canonical_field">
                                        <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CANONICAL_FIELDS.map((field) => (
                                            <SelectItem key={field} value={field}>
                                                {field}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.canonical_field} />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    {isEdit ? 'Save changes' : 'Add mapping'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
