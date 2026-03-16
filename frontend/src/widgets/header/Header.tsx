import { Menu } from '@/features/menu'
import { LogoutButton } from '@/features/auth/logout'
import { Stack } from '@/shared/ui/Stack'

export const Header = () => {
    return (
        <header className="text-[var(--text-white)] text-sm sm:text-base  mb-5 lg:gap-x-8 bg-[var(--success-800)] p-4 shadow-md">
            <Stack justify={'between'} className="container mx-auto">
                <Menu />
                <LogoutButton />
            </Stack>
        </header>
    )
}
