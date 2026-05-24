import { router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import {  useState } from 'react';
import type {ReactNode} from 'react';

import type {ColumnMapping} from '@/components/suppliers/column-mapping-form-dialog';
import RuleFormDialog from '@/components/suppliers/rule-form-dialog';
import type {Rule} from '@/components/suppliers/rule-form-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import suppliersRules from '@/routes/suppliers/rules';

type Props = {
    supplier: {
        id: number;
        rules: Rule[];
        column_mappings: ColumnMapping[];
    };
};

function Code({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <code
            className={`rounded bg-muted px-1.5 py-0.5 font-mono text-xs${className ? ` ${className}` : ''}`}
        >
            {children}
        </code>
    );
}

function summarizeRule(rule: Rule): ReactNode {
    switch (rule.type) {
        case 'multiply':
            return (
                <>
                    <Code>{rule.config.column}</Code>
                    <span className="text-muted-foreground"> × </span>
                    <span className="tabular-nums">{rule.config.factor}</span>
                </>
            );
        case 'remove':
            return (
                <>
                    <span className="text-muted-foreground">Drop </span>
                    <Code>{rule.config.column}</Code>
                </>
            );
        case 'regex':
            return (
                <>
                    <Code>{rule.config.column}</Code>
                    <span className="text-muted-foreground"> : </span>
                    <Code>{rule.config.pattern}</Code>
                    <span className="text-muted-foreground"> → </span>
                    {rule.config.replacement ? (
                        <Code>{rule.config.replacement}</Code>
                    ) : (
                        <Code className="text-muted-foreground">removed</Code>
                    )}
                </>
            );
    }
}

export default function SupplierRulesSection({ supplier }: Props) {
    const [editingRule, setEditingRule] = useState<Rule | 'new' | null>(null);
    const [deletingRule, setDeletingRule] = useState<Rule | null>(null);

    const handleDelete = () => {
        if (!deletingRule) {
return;
}

        router.delete(
            suppliersRules.destroy({ supplier: supplier.id, rule: deletingRule.id }).url,
            { onSuccess: () => setDeletingRule(null) },
        );
    };

    const handleMove = (rule: Rule, direction: 'up' | 'down') => {
        router.post(
            suppliersRules.move({ supplier: supplier.id, rule: rule.id }).url,
            { direction },
            { preserveScroll: true },
        );
    };

    const ruleForDialog = editingRule === 'new' ? undefined : editingRule ?? undefined;
    const availableColumns = supplier.column_mappings.map((m) => m.source_column);

    return (
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
                        {supplier.rules.map((rule, index) => (
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
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={index === 0}
                                                onClick={() => handleMove(rule, 'up')}
                                            >
                                                <ChevronUp className="h-4 w-4" />
                                                <span className="sr-only">Move up</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Move up</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={index === supplier.rules.length - 1}
                                                onClick={() => handleMove(rule, 'down')}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                                <span className="sr-only">Move down</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Move down</TooltipContent>
                                    </Tooltip>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingRule(rule)}
                                    >
                                        Edit
                                    </Button>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => setDeletingRule(rule)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete rule</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete rule</TooltipContent>
                                    </Tooltip>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <RuleFormDialog
                key={editingRule === 'new' ? 'rule-new' : `rule-${editingRule?.id ?? 'closed'}`}
                supplierId={supplier.id}
                rule={ruleForDialog}
                availableColumns={availableColumns}
                open={editingRule !== null}
                onOpenChange={(open) => {
                    if (!open) {
setEditingRule(null);
}
                }}
            />

            <AlertDialog
                open={deletingRule !== null}
                onOpenChange={(open) => {
                    if (!open) {
setDeletingRule(null);
}
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
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete rule
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
