import { Form } from '@inertiajs/react';

import SupplierFormFields from '@/components/suppliers/supplier-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import suppliers from '@/routes/suppliers';
import type { DecimalSeparator, Delimiter, EnumOption } from '@/types';

type Props = {
    supplier: {
        id: number;
        name: string;
        write_physical_csv: boolean;
        delimiter: Delimiter;
        decimal_separator: DecimalSeparator;
    };
    delimiterOptions: EnumOption<Delimiter>[];
    decimalSeparatorOptions: EnumOption<DecimalSeparator>[];
};

export default function SupplierSettingsForm({
    supplier,
    delimiterOptions,
    decimalSeparatorOptions,
}: Props) {
    return (
        <Form
            {...suppliers.update.form(supplier.id)}
            transform={(data) => ({
                ...data,
                write_physical_csv: !!data.write_physical_csv,
            })}
            disableWhileProcessing
            className="flex max-w-2xl flex-col gap-8"
        >
            {({ processing, errors }) => (
                <>
                    <SupplierFormFields
                        errors={errors}
                        defaultName={supplier.name}
                        defaultDelimiter={supplier.delimiter}
                        defaultDecimalSeparator={supplier.decimal_separator}
                        defaultWritePhysicalCsv={supplier.write_physical_csv}
                        delimiterOptions={delimiterOptions}
                        decimalSeparatorOptions={decimalSeparatorOptions}
                    />

                    <Button type="submit" disabled={processing} className="w-fit">
                        {processing && <Spinner />}
                        Save changes
                    </Button>
                </>
            )}
        </Form>
    );
}
