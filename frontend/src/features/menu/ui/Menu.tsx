import { MenuItem } from './MenuItem'
import { NAVIGATION_ITEMS } from '../config/navigationItems'
import { MenuVariant, getMenuStyles } from '../config/menuVariants'

interface MenuProps {
    variant?: MenuVariant
}

export function Menu({ variant = 'header' }: MenuProps) {
    const styles = getMenuStyles(variant)
    const containerClass = `${styles.container}`
    const itemClass = `${styles.item}`

    return (
        <nav>
            <ul className={containerClass}>
                {NAVIGATION_ITEMS.map((item) => (
                    <li className={itemClass} key={item.path}>
                        <MenuItem item={item} variant={variant} />
                    </li>
                ))}
            </ul>
        </nav>
    )
}
