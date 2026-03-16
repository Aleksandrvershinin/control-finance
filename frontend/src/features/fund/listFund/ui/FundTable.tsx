import { FundCard, FundType } from '@/entities/fund'
import {
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    DeleteButton,
    EditButton,
} from '@/shared/ui'
import { useUpdateFundDialogStore } from '../../updateFund/model/useUpdateFundDialogStore'
import { useDeleteFundDialogStore } from '../../deleteFund/model/useDeleteFundDialogStore'

interface FundTableProps {
    funds: FundType[]
}

export function FundTable({ funds }: FundTableProps) {
    const openUpdate = useUpdateFundDialogStore((s) => s.open)
    const openDelete = useDeleteFundDialogStore((s) => s.open)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Действия</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {funds.map((fund) => (
                    <TableRow key={fund.id}>
                        <TableCell>
                            <FundCard color={fund.colorBg} name={fund.name} />
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={2}>
                                <EditButton onClick={() => openUpdate(fund)} />
                                <DeleteButton
                                    onClick={() => openDelete(fund.id)}
                                />
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
