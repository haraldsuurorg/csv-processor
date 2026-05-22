import { Head } from '@inertiajs/react';

import { type ColumnMapping } from '@/components/suppliers/column-mapping-form-dialog';
import { type Rule } from '@/components/suppliers/rule-form-dialog';
import SupplierDangerZone from '@/components/suppliers/supplier-danger-zone';
import SupplierMappingsSection from '@/components/suppliers/supplier-mappings-section';
import SupplierRulesSection from '@/components/suppliers/supplier-rules-section';
import SupplierSettingsForm from '@/components/suppliers/supplier-settings-form';

type Supplier = {
    id: number;
    name: string;
    write_physical_csv: boolean;
    rules: Rule[];
    column_mappings: ColumnMapping[];
};

type Props = {
    supplier: Supplier;
};

export default function SuppliersEdit({ supplier }: Props) {
    return (
        <>
            <Head title={`Edit ${supplier.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">{supplier.name}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage supplier settings, column mappings, and processing rules.
                    </p>
                </div>

                <SupplierSettingsForm supplier={supplier} />

                <SupplierMappingsSection supplier={supplier} />

                <SupplierRulesSection supplier={supplier} />

                <SupplierDangerZone supplier={supplier} />
            </div>
        </>
    );
}
