import { AccountCard, AccountFundsList, Account } from '@/entities/account'
import { FundCard } from '@/entities/fund'
import { DeleteAccountButton } from '@/features/account/deleteAccount'
import { EditAccountButton } from '@/features/account/updateAccount'
import { ToggleAccountVisibilityButton } from '@/features/account'
import { TransactionCreateButton } from '@/features/transaction/createTransaction'

type AccountsListItemProps = {
    account: Account
    currencyCode: string
    currencySymbol: string
}

export const AccountsListItem = ({
    account,
    currencyCode,
    currencySymbol,
}: AccountsListItemProps) => {
    const hasFunds = account.funds.some((fund) => fund.balance !== 0)

    return (
        <AccountCard
            currencyCode={currencyCode}
            currencySymbol={currencySymbol}
            account={account}
            incomeAction={
                <TransactionCreateButton
                    action="INCOME"
                    accountId={account.id}
                />
            }
            expenseAction={
                <TransactionCreateButton
                    action="EXPENSE"
                    accountId={account.id}
                />
            }
            transferAction={
                <TransactionCreateButton
                    action="TRANSFER"
                    accountId={account.id}
                />
            }
            visibilityAction={
                <ToggleAccountVisibilityButton
                    accountId={account.id}
                    isHidden={account.isHidden}
                />
            }
            editAction={<EditAccountButton account={account} />}
            deleteAction={
                <DeleteAccountButton id={account.id} name={account.name} />
            }
            funds={
                !hasFunds ? null : (
                    <AccountFundsList
                        account={account}
                        renderFundCard={(fund) => (
                            <FundCard
                                name={fund.name}
                                balance={fund.balance}
                                color={fund.colorBg}
                                currencyCode={currencyCode}
                            />
                        )}
                    />
                )
            }
        />
    )
}
