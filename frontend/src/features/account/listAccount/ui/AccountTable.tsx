import { Account } from '@/entities/account'
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
import { useUpdateAccountDialogStore } from '../../updateAccount/model/useUpdateAccountDialogStore'
import { useDeleteAccountDialogStore } from '../../deleteAccount/model/useDeleteAccountDialogStore'

interface AccountTableProps {
    accounts: Account[]
}

export function AccountTable({ accounts }: AccountTableProps) {
    const openUpdate = useUpdateAccountDialogStore((s) => s.open)
    const openDelete = useDeleteAccountDialogStore((s) => s.open)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Баланс</TableHead>
                    <TableHead>Действия</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {accounts?.map((account) => (
                    <TableRow key={account.id}>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>{account.balance ?? '-'}</TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={2}>
                                <EditButton
                                    onClick={() => openUpdate(account)}
                                />
                                <DeleteButton
                                    onClick={() =>
                                        openDelete({
                                            id: account.id,
                                            name: account.name,
                                        })
                                    }
                                />
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
