import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { RECAPTCHA_ACTION } from './recaptcha.decorator'
import { RecaptchaService } from './recaptcha.service'

@Injectable()
export class RecaptchaGuard implements CanActivate {
    constructor(
        private readonly recaptcha: RecaptchaService,
        private readonly reflector: Reflector,
        private readonly config: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.config.get('RECAPTCHA_ENABLED') === 'false') {
            return true
        }

        const action = this.reflector.get<string>(
            RECAPTCHA_ACTION,
            context.getHandler(),
        )

        if (!action) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const token = request.body?.recaptchaToken

        if (!token) {
            throw new ForbiddenException('reCAPTCHA token missing')
        }

        const result = await this.recaptcha.verify(token, request.ip)

        if (!result.success) {
            throw new ForbiddenException('reCAPTCHA failed')
        }

        if (result.action !== action) {
            throw new ForbiddenException('Invalid reCAPTCHA action')
        }

        const threshold = Number(
            this.config.get('RECAPTCHA_SCORE_THRESHOLD', 0.9),
        )

        if (result.score < threshold) {
            throw new ForbiddenException('Suspicious activity detected')
        }
        return true
    }
}
