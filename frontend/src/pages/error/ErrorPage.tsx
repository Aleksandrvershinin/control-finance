import { motion } from 'framer-motion'
import { ErrorInfo } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'

interface ErrorPageProps {
    error?: Error
    info?: ErrorInfo
    reset?: () => void
}

export const ErrorPage = ({ error, info, reset }: ErrorPageProps) => {
    const isDev = process.env.NODE_ENV === 'development'

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 min-h-screen">
            <motion.h1
                className="text-6xl font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                😱 Ошибка
            </motion.h1>

            <motion.p
                className="text-lg text-[var(--neutral-800)] mt-3 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Что-то пошло не так. Попробуйте обновить страницу или вернуться
                на главную.
            </motion.p>

            {isDev && error?.message && (
                <motion.pre
                    className="mt-6 p-4 bg-[var(--neutral-100)]  rounded text-sm max-w-2xl overflow-auto text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error.message}
                    {info?.componentStack && (
                        <div className="mt-2">
                            <strong>Component stack:</strong>
                            <br />
                            {info.componentStack}
                        </div>
                    )}
                </motion.pre>
            )}

            <motion.div
                className="mt-6 flex gap-4 flex-wrap justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                {reset && (
                    <Button onClick={reset} className="px-6 py-2 text-lg">
                        Попробовать снова
                    </Button>
                )}

                <Link to="/">
                    <Button className="px-6 py-2 text-lg">На главную</Button>
                </Link>

                <Button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 text-lg"
                >
                    Обновить страницу
                </Button>
            </motion.div>
        </div>
    )
}
