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
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function RuleFormDialog({ supplierId, rule, open, onOpenChange }: Props) {
    const isEdit = rule !== undefined;
    const [type, setType] = useState<RuleType>(rule?.type ?? 'multiply');

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
                                <Input
                                    id="config_column"
                                    name="config[column]"
                                    type="text"
                                    required
                                    defaultValue={rule?.config.column ?? ''}
                                    placeholder="price"
                                    autoComplete="off"
                                />
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
                                        <p className="text-xs text-muted-foreground">
                                            PHP regex with delimiters (e.g. <code>/pattern/i</code>).
                                        </p>
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
                                        <p className="text-xs text-muted-foreground">
                                            Use <code>$1</code>, <code>$2</code> for backreferences. Empty to delete the match.
                                        </p>
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
