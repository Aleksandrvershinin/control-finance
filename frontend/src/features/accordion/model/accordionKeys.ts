export const ACCORDION_KEYS = {
    FUNDS: 'funds',
    ACCOUNTS: 'accounts',
    TRANSACTIONS: 'transactions',
    MAIN_FILTERS: 'main_filters',
} as const

export type AccordionKey = (typeof ACCORDION_KEYS)[keyof typeof ACCORDION_KEYS]
