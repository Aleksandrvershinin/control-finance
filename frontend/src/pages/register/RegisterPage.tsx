import { RegisterForm } from '@/features/auth/register'
import { Stack } from '@/shared/ui/Stack'
import { AuthFormLayout } from '@/widgets/authFormLayout'
import { Link } from '@tanstack/react-router'

export function RegisterPage() {
    return (
        <AuthFormLayout
            title="Регистрация"
            footer={
                <Stack justify={'center'} spacing={2}>
                    <p>Уже есть аккаунт?</p>
                    <Link
                        to={'/login'}
                        search={{ method: 'pass' }}
                        data-discover="true"
                        className="link"
                    >
                        Войти
                    </Link>
                </Stack>
            }
        >
            <RegisterForm />
        </AuthFormLayout>
    )
}
