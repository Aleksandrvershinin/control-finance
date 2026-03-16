import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { UsersModule } from './users/users.module'
import { envValidationSchema } from './config/env.validation'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { CurrencyModule } from './currency/currncy.module'
import { RecaptchaModule } from './recaptcha/recaptcha.module'
import { AccountModule } from './accounts/account.module'
import { FundsModule } from './funds/funds.module'
import { TransactionsModule } from './transactions/transactions.module'
import { CategoriesModule } from './categories/categories.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: envValidationSchema,
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 30,
                },
            ],
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
        CurrencyModule,
        RecaptchaModule,
        AccountModule,
        FundsModule,
        TransactionsModule,
        CategoriesModule,
    ],
    providers: [],
})
export class AppModule {}
