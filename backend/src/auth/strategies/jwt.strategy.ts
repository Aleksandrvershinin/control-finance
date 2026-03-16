import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { AuthPayload } from 'src/common/interfaces/auth-payload.interface'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_ACCESS_SECRET') || 'JWT_ACCESS_SECRET',
        })
    }

    async validate(payload: any): Promise<AuthPayload> {
        const user = await this.usersService.findById(payload.sub)
        return { userId: user.id, userEmail: user.id }
    }
}
