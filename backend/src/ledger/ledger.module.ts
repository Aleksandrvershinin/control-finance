import { Module } from '@nestjs/common'
import { LedgerService } from './ledger.service'
import { BalancesModule } from 'src/balance/balances.module'

@Module({
    imports: [BalancesModule],
    providers: [LedgerService],
    exports: [LedgerService],
})
export class LedgerModule {}
