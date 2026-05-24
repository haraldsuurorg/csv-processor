import { Form, Head, Link } from '@inertiajs/react';

import SupplierUploadsTable from '@/components/suppliers/supplier-uploads-table';
import type {Upload} from '@/components/suppliers/supplier-uploads-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import suppliers from '@/routes/suppliers';
import suppliersUploads from '@/routes/suppliers/uploads';

type Supplier = {
    id: number;
    name: string;
    uploads: Upload[];
};

type Props = {
    supplier: Supplier;
};

export default function SuppliersShow({ supplier }: Props) {
    return (
        <>
            <Head title={supplier.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">{supplier.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {supplier.uploads.length === 0
                                ? 'No uploads yet — upload a CSV to get started.'
                                : `${supplier.uploads.length} upload${supplier.uploads.length === 1 ? '' : 's'}`}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={suppliers.edit(supplier.id).url}>Edit supplier</Link>
                    </Button>
                </div>

                <div className="rounded-xl border p-4 max-w-2xl">
                    <Form
                        {...suppliersUploads.store.form(supplier.id)}
                        disableWhileProcessing
                        resetOnSuccess
                        className="flex flex-col gap-2"
                    >
                        {({ processing, errors }) => (
                            <>
                                <Label htmlFor="csv" className='ml-1 mb-1'>Upload CSV</Label>
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
                                <p className='text-xs text-muted-foreground ml-1'>.csv or .txt files up to 10 MB</p>
                                {errors.csv && (
                                    <p className="text-sm text-destructive">{errors.csv}</p>
                                )}
                            </>
                        )}
                    </Form>
                </div>

                <SupplierUploadsTable
                    supplierId={supplier.id}
                    uploads={supplier.uploads}
                />
            </div>
        </>
    );
}
