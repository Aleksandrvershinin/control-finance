import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    private transporter: nodemailer.Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })
    }

    async sendLoginCode(email: string, code: string): Promise<void> {
        const html = this.buildLoginCodeTemplate(code)

        await this.transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: 'Your login code',
            html,
        })

        this.logger.log(`Login code sent to ${email}`)
    }

    private buildLoginCodeTemplate(code: string): string {
        return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6">
                <h2>Login code</h2>
                <p>Your one-time login code:</p>
                <div style="
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 4px;
                    margin: 16px 0;
                ">
                    ${code}
                </div>
                <p>This code is valid for 10 minutes.</p>
                <p>If you didn’t request this, just ignore this email.</p>
            </div>
        `
    }
}
