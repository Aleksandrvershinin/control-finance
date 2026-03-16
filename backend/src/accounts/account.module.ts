import { Module } from '@nestjs/common'
import { AccountService } from './account.service'
import { AccountController } from './account.controller'
import { FundsModule } from 'src/funds/funds.module'
import { LedgerModule } from 'src/ledger/ledger.module'

@Module({
    imports: [LedgerModule, FundsModule],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule {}
