import { Form } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import suppliers from '@/routes/suppliers';

type Props = {
    supplier: {
        id: number;
        name: string;
        write_physical_csv: boolean;
    };
};

export default function SupplierSettingsForm({ supplier }: Props) {
    return (
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

                    <Button type="submit" disabled={processing} className="w-fit">
                        {processing && <Spinner />}
                        Save changes
                    </Button>
                </>
            )}
        </Form>
    );
}
