import { Header } from '@/widgets/header'
import { Outlet } from '@tanstack/react-router'

export const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    )
}
