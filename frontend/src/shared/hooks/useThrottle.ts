import { useCallback, useRef } from 'react'

export function useThrottle<T extends (...args: any[]) => void>(
    callback: T,
    delay: number,
) {
    const lastCallRef = useRef(0)

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now()
            if (now - lastCallRef.current < delay) return
            lastCallRef.current = now
            callback(...args)
        },
        [callback, delay],
    )
}
