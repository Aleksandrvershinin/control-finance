import { useSuspenseCurrencies } from '@/entities/currency'
import { Button } from '@/shared/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRootMessage,
} from '@/shared/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUpdateCurrencyMutation } from '../model/useUpdateCurrencyMutation'
import { SelectCurrencyFormType, selectCurrencySchema } from '../model/shema'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'

export const SelectCurrencyForm = () => {
    const { data } = useSuspenseCurrencies()
    const updateCurrentUser = useUpdateCurrencyMutation()

    const form = useForm<SelectCurrencyFormType>({
        resolver: zodResolver(selectCurrencySchema),
        defaultValues: {
            currencyId: '',
        },
    })
    const handleError = useFormErrorHandler(form.setError)
    const onSubmit = (values: SelectCurrencyFormType) => {
        updateCurrentUser.mutateAsync(values, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Успешно',
                })
                close()
            },
            onError: handleError,
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-[340px] pt-6 mx-auto"
            >
                <FormRootMessage className="text-center" />
                <FormField
                    control={form.control}
                    name="currencyId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Основная валюта</FormLabel>

                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите валюту" />
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    {data.currencies.map((currency) => (
                                        <SelectItem
                                            key={currency.id}
                                            value={currency.id}
                                        >
                                            {currency.symbol} {currency.code} —{' '}
                                            {currency.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Сохранить
                </Button>
            </form>
        </Form>
    )
}
