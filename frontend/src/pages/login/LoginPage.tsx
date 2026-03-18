import { LoginByCodeForm, LoginByPassForm } from '@/features/auth/login'
import { Button } from '@/shared/ui'
import { Stack } from '@/shared/ui/Stack'
import { AuthFormLayout } from '@/widgets/authFormLayout'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'

export const LoginPage = () => {
    return (
        <AuthFormLayout
            title="Авторизация"
            footer={
                <Stack justify={'center'} spacing={2}>
                    <p>Нет аккаунта?</p>
                    <Link
                        className="link"
                        to={'/register'}
                        data-discover="true"
                    >
                        Зарегистрироваться
                    </Link>
                </Stack>
            }
        >
            <LoginPageSwitch />
        </AuthFormLayout>
    )
}

const LoginPageSwitch = () => {
    const { method } = useSearch({ from: '/login' })
    const navigate = useNavigate({ from: '/login' })

    const switchMethod = (nextMethod: 'pass' | 'code') => {
        navigate({
            to: '/login',
            search: { method: nextMethod },
            replace: true,
        })
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                    type="button"
                    variant={method === 'pass' ? 'default' : 'outline'}
                    onClick={() => switchMethod('pass')}
                >
                    По паролю
                </Button>
                <Button
                    type="button"
                    variant={method === 'code' ? 'default' : 'outline'}
                    onClick={() => switchMethod('code')}
                >
                    По коду
                </Button>
            </div>

            {method === 'pass' ? <LoginByPassForm /> : <LoginByCodeForm />}
        </>
    )
}
