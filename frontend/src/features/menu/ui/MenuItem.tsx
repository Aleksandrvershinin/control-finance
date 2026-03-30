import { Link } from '@tanstack/react-router'
import { House } from 'lucide-react'
import { NavigationItem } from '../config/navigationItems'
import { MenuVariant } from '../config/menuVariants'

type MenuItemStyleConfig = {
    link: string
    activeLink: string
}

const MENU_ITEM_VARIANTS: Record<MenuVariant, MenuItemStyleConfig> = {
    header: {
        link: 'block h-[24px] font-semibold transition-colors duration-300 ease-in-out hover:text-[var(--primary-400)]',
        activeLink: 'text-[var(--primary-500)] poinivent-none',
    },
    footer: {
        link: 'transition-colors duration-300 ease-in-out hover:text-[var(--neutral-100)]',
        activeLink: 'text-[var(--primary-400)] underline poinivent-none',
    },
    mobile: {
        link: 'font-medium transition-colors duration-300 ease-in-out hover:text-[var(--primary-300)] py-2',
        activeLink:
            'text-[var(--warning-300)] border-b-2 border-[var(--warning-300)] poinivent-none',
    },
}

interface MenuItemProps {
    item: NavigationItem
    variant?: MenuVariant
}

export function MenuItem({ item, variant = 'header' }: MenuItemProps) {
    const styles = MENU_ITEM_VARIANTS[variant]
    const isHomeItem = item.path === '/'

    return (
        <Link
            to={item.path}
            activeProps={{
                className: `${styles.activeLink} pointer-events-none`,
            }}
            className={styles.link}
            aria-label={item.label}
            title={item.label}
        >
            {isHomeItem ? (
                <>
                    <House aria-hidden="true" className="inline-block h-full" />
                </>
            ) : (
                item.label
            )}
        </Link>
    )
}
