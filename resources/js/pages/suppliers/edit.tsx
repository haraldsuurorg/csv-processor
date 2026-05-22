import { Form, Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ColumnMappingFormDialog, {
    type ColumnMapping,
} from '@/components/column-mapping-form-dialog';
import InputError from '@/components/input-error';
import RuleFormDialog, { type Rule } from '@/components/rule-form-dialog';
import SupplierUploadsSection, {
    type Upload,
} from '@/components/supplier-uploads-section';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import suppliers from '@/routes/suppliers';
import suppliersColumnMappings from '@/routes/suppliers/column-mappings';
import suppliersRules from '@/routes/suppliers/rules';
import type { BreadcrumbItem } from '@/types';

type Supplier = {
    id: number;
    name: string;
    write_physical_csv: boolean;
    rules: Rule[];
    column_mappings: ColumnMapping[];
    uploads: Upload[];
};

type Props = {
    supplier: Supplier;
};

function summarizeRule(rule: Rule): string {
    switch (rule.type) {
        case 'multiply':
            return `${rule.config.column} × ${rule.config.factor}`;
        case 'remove':
            return `Drop "${rule.config.column}"`;
        case 'regex':
            return `${rule.config.column}: ${rule.config.pattern} → ${rule.config.replacement || '(empty)'}`;
    }
}

export default function SuppliersEdit({ supplier }: Props) {
    const [editingRule, setEditingRule] = useState<Rule | 'new' | null>(null);
    const [deletingRule, setDeletingRule] = useState<Rule | null>(null);
    const [editingMapping, setEditingMapping] = useState<ColumnMapping | 'new' | null>(null);
    const [deletingMapping, setDeletingMapping] = useState<ColumnMapping | null>(null);

    const handleDeleteSupplier = () => {
        router.delete(suppliers.destroy(supplier.id).url);
    };

    const handleDeleteRule = () => {
        if (!deletingRule) return;
        router.delete(
            suppliersRules.destroy({ supplier: supplier.id, rule: deletingRule.id }).url,
            { onSuccess: () => setDeletingRule(null) },
        );
    };

    const handleDeleteMapping = () => {
        if (!deletingMapping) return;
        router.delete(
            suppliersColumnMappings.destroy({
                supplier: supplier.id,
                column_mapping: deletingMapping.id,
            }).url,
            { onSuccess: () => setDeletingMapping(null) },
        );
    };

    const ruleForDialog = editingRule === 'new' ? undefined : editingRule ?? undefined;
    const mappingForDialog =
        editingMapping === 'new' ? undefined : editingMapping ?? undefined;

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
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingMapping(mapping)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="mt-6 max-w-2xl border-t pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold">Rules</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Applied in order to every uploaded CSV row.
                            </p>
                        </div>
                        <Button onClick={() => setEditingRule('new')}>Add rule</Button>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border">
                        {supplier.rules.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                No rules yet.
                            </div>
                        ) : (
                            <ul className="divide-y">
                                {supplier.rules.map((rule) => (
                                    <li
                                        key={rule.id}
                                        className="flex items-center justify-between gap-3 p-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <Badge variant="secondary" className="capitalize">
                                                {rule.type}
                                            </Badge>
                                            <span className="truncate text-sm">
                                                {summarizeRule(rule)}
                                            </span>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingRule(rule)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingRule(rule)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <SupplierUploadsSection
                    supplierId={supplier.id}
                    uploads={supplier.uploads}
                />

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
                                    onClick={handleDeleteSupplier}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Delete supplier
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
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
                            {deletingMapping &&
                                `${deletingMapping.source_column} → ${deletingMapping.canonical_field}`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteMapping}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete mapping
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <RuleFormDialog
                key={editingRule === 'new' ? 'rule-new' : `rule-${editingRule?.id ?? 'closed'}`}
                supplierId={supplier.id}
                rule={ruleForDialog}
                availableColumns={supplier.column_mappings.map((m) => m.source_column)}
                open={editingRule !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingRule(null);
                }}
            />

            <AlertDialog
                open={deletingRule !== null}
                onOpenChange={(open) => {
                    if (!open) setDeletingRule(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this rule?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deletingRule && summarizeRule(deletingRule)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteRule}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete rule
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
