import { Menu } from '@/features/menu'
import { LogoutButton } from '@/features/auth/logout'
import {
    ChangePasswordButton,
    ChangePasswordDialog,
} from '@/features/auth/changePassword'
import { Stack } from '@/shared/ui/Stack'

export const Header = () => {
    return (
        <header className="text-[var(--text-white)] text-sm sm:text-base  mb-5 lg:gap-x-8 bg-[var(--success-800)] p-4 shadow-md">
            <Stack className="container mx-auto flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Menu />
                <Stack className="gap-4 self-end sm:self-auto">
                    <ChangePasswordButton />
                    <LogoutButton />
                </Stack>
            </Stack>
            <ChangePasswordDialog />
        </header>
    )
}
