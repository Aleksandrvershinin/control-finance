import React from 'react'
import { getBalanceWithoutFunds } from '../lib/getBalanceWithoutFunds'
import { Account } from '../model/account.types'

type Props = {
    account: Account
    renderFundCard: (fund: Account['funds'][number]) => React.ReactNode
}

export const AccountFundsList = ({ account, renderFundCard }: Props) => {
    const balanceWithoutFunds = getBalanceWithoutFunds(account)
    return (
        <ul className="space-y-2">
            {account.funds.map((fund) => {
                if (fund.balance === 0) return null

                return <li key={fund.id}>{renderFundCard(fund)}</li>
            })}

            <li key={'witOutFund'}>
                {renderFundCard({
                    name: 'Без фонда',
                    id: 'witOutFund',
                    balance: balanceWithoutFunds,
                    colorBg: '',
                })}
            </li>
        </ul>
    )
}
