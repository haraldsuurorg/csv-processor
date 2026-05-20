import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { BreadcrumbItem } from '@/types';

type Supplier = {
    id: number;
    name: string;
    write_physical_csv: boolean;
};

type Props = {
    suppliers: Supplier[];
};

export default function SuppliersIndex({ suppliers: supplierList }: Props) {
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
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                autoFocus
                                                autoComplete="off"
                                                placeholder="Acme Imports"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="write_physical_csv"
                                                name="write_physical_csv"
                                            />
                                            <div className="grid gap-1">
                                                <Label htmlFor="write_physical_csv">
                                                    Write physical CSV file
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Also save processed uploads as a CSV file to disk.
                                                </p>
                                                <InputError message={errors.write_physical_csv} />
                                            </div>
                                        </div>

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
                                                <Link href={suppliers.edit(supplier.id).url}>
                                                    Edit
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
