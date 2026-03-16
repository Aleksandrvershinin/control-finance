export type MenuVariant = 'header' | 'footer' | 'mobile'

export interface MenuStyleConfig {
    container: string
    item: string
}

const MENU_VARIANTS: Record<MenuVariant, MenuStyleConfig> = {
    header: {
        container: 'flex items-center gap-x-4',
        item: '',
    },
    footer: {
        container:
            'flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start',
        item: '',
    },
    mobile: {
        container: 'flex flex-col gap-y-3',
        item: '',
    },
}

export function getMenuStyles(variant: MenuVariant): MenuStyleConfig {
    return MENU_VARIANTS[variant]
}
