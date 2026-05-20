import { Form, Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import suppliers from '@/routes/suppliers';
import type { BreadcrumbItem } from '@/types';

type Supplier = {
    id: number;
    name: string;
    write_physical_csv: boolean;
};

type Props = {
    supplier: Supplier;
};

export default function SuppliersEdit({ supplier }: Props) {
    const handleDelete = () => {
        router.delete(suppliers.destroy(supplier.id).url);
    };

    return (
        <>
            <Head title={`Edit ${supplier.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">{supplier.name}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage supplier settings.
                    </p>
                </div>

                <Form
                    {...suppliers.update.form(supplier.id)}
                    transform={(data) => ({
                        ...data,
                        write_physical_csv: !!data.write_physical_csv,
                    })}
                    disableWhileProcessing
                    className="flex max-w-2xl flex-col gap-6"
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
                                    defaultValue={supplier.name}
                                    autoComplete="off"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="write_physical_csv"
                                    name="write_physical_csv"
                                    defaultChecked={supplier.write_physical_csv}
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

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Save changes
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href={suppliers.index().url}>Back to suppliers</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="mt-6 max-w-2xl border-t pt-6">
                    <h2 className="text-base font-semibold">Danger zone</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Permanently delete this supplier and all associated data.
                    </p>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="mt-3">
                                Delete supplier
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete {supplier.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This permanently deletes the supplier and all associated data. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Delete supplier
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
    {
        title: 'Edit',
        href: suppliers.index().url,
    },
];

SuppliersEdit.layout = { breadcrumbs };
