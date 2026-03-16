import { RegisterForm } from '@/features/auth/register'
import { Stack } from '@/shared/ui/Stack'
import { Link } from '@tanstack/react-router'

export function RegisterPage() {
    return (
        <section>
            <div className="container">
                <Stack
                    direction={'column'}
                    className="rounded-lg shadow-2xl w-96 p-4 mt-20 mx-auto bg-white"
                >
                    <h1 className="text-2xl font-semibold mb-4 text-center">
                        Регистрация
                    </h1>
                    <RegisterForm />
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
                </Stack>
            </div>
        </section>
    )
}
