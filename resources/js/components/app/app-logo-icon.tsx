import { FileDigit } from 'lucide-react';
import type { SVGAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({ className, ...props }: SVGAttributes<SVGSVGElement>) {
    return (
        <FileDigit
            {...props}
            className={cn('text-primary dark:text-background', className)}
        />
    );
}
