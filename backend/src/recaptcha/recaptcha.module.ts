import { Global, Module } from '@nestjs/common'
import { RecaptchaService } from './recaptcha.service'
import { RecaptchaGuard } from './recaptcha.guard'

@Global()
@Module({
    providers: [RecaptchaService, RecaptchaGuard],
    exports: [RecaptchaService, RecaptchaGuard],
})
export class RecaptchaModule {}
