import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class RecaptchaService {
    constructor(private readonly config: ConfigService) {}

    async verify(token: string, ip?: string) {
        const { data } = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: this.config.get('RECAPTCHA_SECRET_KEY'),
                    response: token,
                    remoteip: ip,
                },
            },
        )

        return data
    }
}
