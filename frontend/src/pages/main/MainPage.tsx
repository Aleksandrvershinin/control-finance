import { CreateTransactionDialog } from '@/features/transaction/createTransaction'
import { DeleteTransactionDialog } from '@/features/transaction/deleteTransaction'
import { UpdateTransactionDialog } from '@/features/transaction/updateTransaction'
import { Stack } from '@/shared/ui/Stack'
import { Accounts } from '@/widgets/accounts'
import { FundsWidget } from '@/widgets/funds'
import { MainFilterPanel } from '@/widgets/mainFilterPanel'
import { TransactionTableWidget } from '@/widgets/transactionTable/ui/TransactionTableWidget'

export function MainPage() {
    return (
        <>
            <CreateTransactionDialog />
            <UpdateTransactionDialog />
            <DeleteTransactionDialog />
            <h1 className="sr-only">Контроль финансов главная страница</h1>
            <section>
                <Stack
                    spacing={2}
                    direction={'column'}
                    className="container mx-auto"
                >
                    <div className="hidden lg:block">
                        <MainFilterPanel />
                    </div>
                    <Stack
                        direction={'column-reverse'}
                        align={'center'}
                        className="mb-10 lg:flex-row-reverse lg:items-start lg:justify-between"
                    >
                        <div className="w-full lg:flex-1 lg:max-w-[635px] xl:max-w-[890px] 2xl:max-w-[1116px]">
                            <TransactionTableWidget />
                        </div>
                        <div className="flex-none w-[320px] 2xl:w-[350px]">
                            <FundsWidget />
                            <Accounts />
                            <div className="lg:hidden">
                                <MainFilterPanel />
                            </div>
                        </div>
                    </Stack>
                </Stack>
            </section>
        </>
    )
}
