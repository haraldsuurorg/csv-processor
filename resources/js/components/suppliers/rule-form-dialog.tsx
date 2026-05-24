import { Form } from '@inertiajs/react';
import { useState } from 'react';
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
import suppliersRules from '@/routes/suppliers/rules';

export type RuleType = 'multiply' | 'remove' | 'regex';

export type Rule = {
    id: number;
    type: RuleType;
    config: {
        column?: string;
        factor?: number | string;
        pattern?: string;
        replacement?: string;
    };
    sort_order: number;
};

type Props = {
    supplierId: number;
    rule?: Rule;
    availableColumns: string[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function RuleFormDialog({
    supplierId,
    rule,
    availableColumns,
    open,
    onOpenChange,
}: Props) {
    const isEdit = rule !== undefined;
    const [type, setType] = useState<RuleType>(rule?.type ?? 'multiply');

    // If the rule was created against a column that has since been removed from mappings,
    // keep it in the dropdown so editing doesn't get stuck on a phantom value.
    const existingColumn = rule?.config.column;
    const columnOptions =
        existingColumn && !availableColumns.includes(existingColumn)
            ? [...availableColumns, existingColumn]
            : availableColumns;

    const formProps = isEdit
        ? suppliersRules.update.form({ supplier: supplierId, rule: rule.id })
        : suppliersRules.store.form(supplierId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit rule' : 'Add rule'}</DialogTitle>
                    <DialogDescription>
                        Rules transform CSV column values. They run in the order shown on the supplier.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...formProps}
                    transform={(data) => ({ ...data, type })}
                    onSuccess={() => onOpenChange(false)}
                    disableWhileProcessing
                    className="flex flex-col gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={type} onValueChange={(v) => setType(v as RuleType)}>
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="multiply">Multiply</SelectItem>
                                        <SelectItem value="remove">Remove</SelectItem>
                                        <SelectItem value="regex">Regex</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="config_column">Column</Label>
                                <Select
                                    name="config[column]"
                                    defaultValue={rule?.config.column}
                                    disabled={columnOptions.length === 0}
                                >
                                    <SelectTrigger id="config_column">
                                        <SelectValue
                                            placeholder={
                                                columnOptions.length === 0
                                                    ? 'Add a column mapping first'
                                                    : 'Select a column'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columnOptions.map((column) => (
                                            <SelectItem key={column} value={column}>
                                                {column}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Source columns come from this supplier's mappings.
                                </p>
                                <InputError message={errors['config.column']} />
                            </div>

                            {type === 'multiply' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="config_factor">Factor</Label>
                                    <Input
                                        id="config_factor"
                                        name="config[factor]"
                                        type="number"
                                        step="any"
                                        required
                                        defaultValue={rule?.config.factor ?? ''}
                                        placeholder="1.5"
                                        autoComplete="off"
                                    />
                                    <InputError message={errors['config.factor']} />
                                </div>
                            )}

                            {type === 'regex' && (
                                <>
                                    <div className="rounded-md bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                                        <p>
                                            Find text matching{' '}
                                            <strong className="text-foreground">Pattern</strong>{' '}
                                            in the column and replace it with{' '}
                                            <strong className="text-foreground">
                                                Replacement
                                            </strong>
                                            .
                                        </p>
                                        <p className="mt-1.5">
                                            Example: Pattern{' '}
                                            <code className="rounded bg-background px-1 py-0.5 font-mono">
                                                /^CRD-/
                                            </code>{' '}
                                            with Replacement{' '}
                                            <code className="rounded bg-background px-1 py-0.5 font-mono">
                                                BS-
                                            </code>{' '}
                                            turns{' '}
                                            <code className="rounded bg-background px-1 py-0.5 font-mono">
                                                CRD-001
                                            </code>{' '}
                                            into{' '}
                                            <code className="rounded bg-background px-1 py-0.5 font-mono">
                                                BS-001
                                            </code>
                                            .
                                        </p>
                                        <p className="mt-1.5">
                                            Pattern uses PHP regex syntax (PCRE) and must be wrapped in slashes:{' '}
                                            <code className="rounded bg-background px-1 py-0.5 font-mono">
                                                /your-pattern/
                                            </code>
                                            . Add{' '}
                                            <code className="rounded bg-background px-1 py-0.5 font-mono">
                                                /i
                                            </code>{' '}
                                            at the end to ignore letter case (so{' '}
                                            <code className="rounded bg-background px-1 py-0.5 font-mono">
                                                /crd/i
                                            </code>{' '}
                                            matches CRD, crd, and Crd).
                                        </p>
                                        <p className='mt-1.5'>
                                            Leave Replacement empty to remove the match.
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="config_pattern">Pattern</Label>
                                        <Input
                                            id="config_pattern"
                                            name="config[pattern]"
                                            type="text"
                                            required
                                            defaultValue={rule?.config.pattern ?? ''}
                                            placeholder="/^OLD-/"
                                            autoComplete="off"
                                        />
                                        <InputError message={errors['config.pattern']} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="config_replacement">Replacement</Label>
                                        <Input
                                            id="config_replacement"
                                            name="config[replacement]"
                                            type="text"
                                            defaultValue={rule?.config.replacement ?? ''}
                                            placeholder="NEW-"
                                            autoComplete="off"
                                        />
                                        <InputError message={errors['config.replacement']} />
                                    </div>
                                </>
                            )}

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
                                    {isEdit ? 'Save changes' : 'Add rule'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
