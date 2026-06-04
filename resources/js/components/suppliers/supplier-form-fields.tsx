import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { DecimalSeparator, Delimiter, EnumOption } from '@/types';

type Props = {
    errors: Partial<Record<string, string>>;
    defaultName?: string;
    defaultDelimiter: Delimiter;
    defaultDecimalSeparator: DecimalSeparator;
    defaultWritePhysicalCsv?: boolean;
    delimiterOptions: EnumOption<Delimiter>[];
    decimalSeparatorOptions: EnumOption<DecimalSeparator>[];
    autoFocusName?: boolean;
};

export default function SupplierFormFields({
    errors,
    defaultName,
    defaultDelimiter,
    defaultDecimalSeparator,
    defaultWritePhysicalCsv,
    delimiterOptions,
    decimalSeparatorOptions,
    autoFocusName,
}: Props) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoFocus={autoFocusName}
                    autoComplete="off"
                    placeholder="Acme Imports"
                    defaultValue={defaultName}
                />
                <InputError message={errors.name} />
            </div>

            <div className="flex gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="delimiter">Delimiter</Label>
                    <Select name="delimiter" defaultValue={defaultDelimiter}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {delimiterOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.delimiter} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="decimal_separator">Decimal separator</Label>
                    <Select
                        name="decimal_separator"
                        defaultValue={defaultDecimalSeparator}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {decimalSeparatorOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.decimal_separator} />
                </div>
            </div>

            <div className="flex items-start gap-3">
                <Checkbox
                    id="write_physical_csv"
                    name="write_physical_csv"
                    defaultChecked={defaultWritePhysicalCsv}
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
        </>
    );
}
