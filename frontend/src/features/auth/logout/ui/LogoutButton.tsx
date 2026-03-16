import { cn } from '@/shared/lib/utils'
import { useLogoutMutation } from '../model/useLogoutMutation'

export const LogoutButton = () => {
    const { mutate, isPending } = useLogoutMutation()
    return (
        <button
            onClick={() => mutate()}
            disabled={isPending}
            className={cn({ 'animate-pulse': isPending })}
        >
            {isPending ? 'Выход...' : 'Выход'}
        </button>
    )
}
