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
                        className="mb-10 lg:flex-row-reverse lg:items-start lg:gap-10"
                    >
                        <div className="w-full lg:flex-[0_0_620px] lg:w-[620px] xl:flex-1 xl:w-auto">
                            <TransactionTableWidget />
                        </div>
                        <div className="flex-none w-[320px] xl:w-[350px]">
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
