import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import SupplierFormFields from '@/components/suppliers/supplier-form-fields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import suppliers from '@/routes/suppliers';
import type { BreadcrumbItem, DecimalSeparator, Delimiter, EnumOption } from '@/types';

type Supplier = {
    id: number;
    name: string;
    write_physical_csv: boolean;
    delimiter: Delimiter;
    decimal_separator: DecimalSeparator;
};

type Props = {
    suppliers: Supplier[];
    delimiterOptions: EnumOption<Delimiter>[];
    defaultDelimiter: Delimiter;
    decimalSeparatorOptions: EnumOption<DecimalSeparator>[];
    defaultDecimalSeparator: DecimalSeparator;
};


export default function SuppliersIndex({ suppliers: supplierList, delimiterOptions, defaultDelimiter, decimalSeparatorOptions, defaultDecimalSeparator }: Props) {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
            <Head title="Suppliers" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Suppliers</h1>

                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>New supplier</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New supplier</DialogTitle>
                                <DialogDescription>
                                    Suppliers are the source of CSV files you'll process.
                                </DialogDescription>
                            </DialogHeader>

                            <Form
                                {...suppliers.store.form()}
                                transform={(data) => ({
                                    ...data,
                                    write_physical_csv: !!data.write_physical_csv,
                                })}
                                onSuccess={() => setCreateOpen(false)}
                                resetOnSuccess
                                disableWhileProcessing
                                className="flex flex-col gap-8"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <SupplierFormFields
                                            errors={errors}
                                            defaultDelimiter={defaultDelimiter}
                                            defaultDecimalSeparator={defaultDecimalSeparator}
                                            delimiterOptions={delimiterOptions}
                                            decimalSeparatorOptions={decimalSeparatorOptions}
                                            autoFocusName
                                        />

                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setCreateOpen(false)}
                                                disabled={processing}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={processing}>
                                                {processing && <Spinner />}
                                                Create supplier
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Writes physical CSV</TableHead>
                                <TableHead className="w-0" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {supplierList.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No suppliers yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                supplierList.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="font-medium">
                                            {supplier.name}
                                        </TableCell>
                                        <TableCell>
                                            {supplier.write_physical_csv ? (
                                                <Badge>Yes</Badge>
                                            ) : (
                                                <Badge variant="secondary">No</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={suppliers.show(supplier.id).url}>
                                                    Open
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Suppliers',
        href: suppliers.index().url,
    },
];

SuppliersIndex.layout = { breadcrumbs };
