import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const stackVariants = cva('flex', {
    variants: {
        direction: {
            row: 'flex-row',
            column: 'flex-col',
            'row-reverse': 'flex-row-reverse',
            'column-reverse': 'flex-col-reverse',
        },
        align: {
            start: 'items-start',
            center: 'items-center',
            end: 'items-end',
            stretch: 'items-stretch',
        },
        justify: {
            start: 'justify-start',
            center: 'justify-center',
            end: 'justify-end',
            between: 'justify-between',
            around: 'justify-around',
            evenly: 'justify-evenly',
        },
        wrap: {
            true: 'flex-wrap',
            false: 'flex-nowrap',
        },
        spacing: {
            0: 'gap-0',
            0.5: 'gap-0.5',
            1: 'gap-1',
            1.5: 'gap-1.5',
            2: 'gap-2',
            2.5: 'gap-2.5',
            3: 'gap-3',
            4: 'gap-4',
            5: 'gap-5',
            6: 'gap-6',
            8: 'gap-8',
            10: 'gap-10',
            12: 'gap-12',
        },
    },
    defaultVariants: {
        direction: 'row',
        align: 'stretch',
        justify: 'start',
        wrap: false,
        spacing: 2,
    },
})

interface StackProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof stackVariants> {}

export function Stack({
    className,
    direction,
    align,
    justify,
    wrap,
    spacing,
    ...props
}: StackProps) {
    return (
        <div
            className={cn(
                stackVariants({
                    direction,
                    align,
                    justify,
                    wrap,
                    spacing,
                }),
                className,
            )}
            {...props}
        />
    )
}
