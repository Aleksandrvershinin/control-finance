import { useState, useCallback } from 'react'
import { getErrorMessage } from '../lib/getErrorMessage'

export function useFetch<T>(initialData: T | undefined = {} as T) {
    const [data, setData] = useState<T>(initialData)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const resetError = () => {
        setError(null)
    }
    const fetchFunction = useCallback(
        async (fetchFunction: () => Promise<T>) => {
            setIsLoading(true)
            setError(null)
            try {
                const result = await fetchFunction()
                setData(result)
                return result
            } catch (error: unknown) {
                setError(getErrorMessage(error))
            } finally {
                setIsLoading(false)
            }
        },
        [],
    )

    return { data, isLoading, error, fetchFunction, resetError }
}
