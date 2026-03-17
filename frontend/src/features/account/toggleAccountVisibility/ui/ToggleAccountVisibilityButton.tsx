import { Eye, EyeOff } from 'lucide-react'
import { useToggleAccountVisibilityMutation } from '../model/useToggleAccountVisibilityMutation'

export const ToggleAccountVisibilityButton = ({
    accountId,
    isHidden,
}: {
    accountId: string
    isHidden: boolean
}) => {
    const toggleMutation = useToggleAccountVisibilityMutation()

    const handleClick = () => {
        toggleMutation.mutate({
            id: accountId,
            isHidden: !isHidden,
        })
    }

    return (
        <button
            onClick={handleClick}
            title={isHidden ? 'Показать счет' : 'Скрыть счет'}
            disabled={toggleMutation.isPending}
        >
            {isHidden ? (
                <Eye className="text-[var(--primary-500)]" size={23} />
            ) : (
                <EyeOff className="text-[var(--primary-500)]" size={23} />
            )}
        </button>
    )
}
