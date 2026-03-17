export const ACCORDION_KEYS = {
    FUNDS: 'funds',
    ACCOUNTS: 'accounts',
    HIDDEN_ACCOUNTS: 'hidden_accounts',
    TRANSACTIONS: 'transactions',
    MAIN_FILTERS: 'main_filters',
} as const

export type AccordionKey = (typeof ACCORDION_KEYS)[keyof typeof ACCORDION_KEYS]
