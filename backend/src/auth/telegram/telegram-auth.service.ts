import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createHmac } from 'crypto'

@Injectable()
export class TelegramAuthService {
    constructor(private readonly config: ConfigService) {}

    verify(initData: string) {
        const params = new URLSearchParams(initData)

        const hash = params.get('hash')

        if (!hash) {
            throw new UnauthorizedException('Telegram hash is missing')
        }

        params.delete('hash')

        const dataCheckString = [...params.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n')

        const botToken = this.config.get<string>('TELEGRAM_BOT_TOKEN')

        if (!botToken) {
            throw new Error('TELEGRAM_BOT_TOKEN not configured')
        }

        const secret = createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest()

        const calculatedHash = createHmac('sha256', secret)
            .update(dataCheckString)
            .digest('hex')

        if (calculatedHash !== hash) {
            throw new UnauthorizedException('Invalid Telegram signature')
        }

        const user = params.get('user')

        if (!user) {
            throw new UnauthorizedException('Telegram user not found')
        }

        return JSON.parse(user)
    }
}
