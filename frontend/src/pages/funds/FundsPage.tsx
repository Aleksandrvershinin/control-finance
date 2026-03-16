import { fundApi } from '@/entities/fund'
import { CreateFundButton, FundTable } from '@/features/fund'
import { CreateFundDialog } from '@/features/fund/createFund'
import { UpdateFundDialog } from '@/features/fund/updateFund'
import { DeleteFundDialog } from '@/features/fund/deleteFund'
import { Stack } from '@/shared/ui/Stack'
import { useSuspenseQuery } from '@tanstack/react-query'

export const FundsPage = () => {
    const { data: funds } = useSuspenseQuery(fundApi.getFundsQueryOptions())

    return (
        <section>
            <div className="container">
                <CreateFundDialog />
                <UpdateFundDialog />
                <DeleteFundDialog />

                <CreateFundButton />
                {funds.length > 0 && (
                    <Stack direction={'column'} className="max-w-96 mt-5">
                        <FundTable funds={funds} />
                    </Stack>
                )}
            </div>
        </section>
    )
}
