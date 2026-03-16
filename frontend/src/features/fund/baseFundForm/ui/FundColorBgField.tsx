import {
    Input,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Stack,
} from '@/shared/ui'
import { Path } from 'react-hook-form'
import { BaseFundFormValues } from '../model/baseFundForm.types'
import { FundCard } from '@/entities/fund'

interface FundColorBgFieldProps {
    name?: Path<BaseFundFormValues>
}

export function FundColorBgField({ name = 'colorBg' }: FundColorBgFieldProps) {
    return (
        <FormField
            name={name}
            render={({ field }) => (
                <FormItem>
                    <Stack direction={'column'}>
                        <FormLabel htmlFor={field.name}>Цвет фона</FormLabel>
                        <FormControl>
                            <Stack spacing={0}>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="color"
                                    className="w-[0.1px] p-0 opacity-0"
                                />
                                <FormLabel
                                    htmlFor={field.name}
                                    style={{ lineHeight: 'inherit' }}
                                    className="flex-1"
                                >
                                    <FundCard
                                        className="h-full"
                                        name="Название"
                                        color={field.value}
                                    />
                                </FormLabel>
                            </Stack>
                        </FormControl>
                    </Stack>

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
