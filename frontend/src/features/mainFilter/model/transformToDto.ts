import {
    TransactionQueryParamsDto,
    transactionQueryParamsDtoSchema,
} from '@/entities/transaction'
import { MainFilterState } from './useMainFilterStore'

export const transformMainFilterToTransactionQueryDto = (
    state: MainFilterState,
): TransactionQueryParamsDto => {
    const params = {
        ...state.filters,
        cursor: state.cursor,
        sortField: state.sortField,
        sortOrder: state.sortOrder,
    }
    const result: TransactionQueryParamsDto = {}
    for (const key in transactionQueryParamsDtoSchema.shape) {
        try {
            const value = params[key as keyof typeof params]
            // валидируем отдельно каждое поле
            const fieldSchema =
                transactionQueryParamsDtoSchema.shape[
                    key as keyof typeof transactionQueryParamsDtoSchema.shape
                ]
            const parsed = fieldSchema.parse(value)
            if (parsed !== undefined)
                result[key as keyof TransactionQueryParamsDto] = parsed as any
        } catch {
            // если значение невалидное — просто игнорируем
        }
    }
    return result
}
