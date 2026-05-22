import { router } from '@inertiajs/react';

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
import suppliers from '@/routes/suppliers';

type Props = {
    supplier: {
        id: number;
        name: string;
    };
};

export default function SupplierDangerZone({ supplier }: Props) {
    const handleDelete = () => {
        router.delete(suppliers.destroy(supplier.id).url);
    };

    return (
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
    );
}
