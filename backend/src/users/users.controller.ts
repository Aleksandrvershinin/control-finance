import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { plainToClass } from 'class-transformer'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ResponseUserDto } from './dto/response-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getUserProfile(@Auth('userId') userId: string) {
        const user = await this.usersService.findById(userId)
        return {
            user: plainToClass(ResponseUserDto, user, {
                excludeExtraneousValues: true,
            }),
        }
    }
    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateUser(
        @Auth('userId') userId: string,
        @Body() dto: UpdateUserDto,
    ) {
        const user = await this.usersService.update(userId, dto)
        return {
            user: plainToClass(ResponseUserDto, user, {
                excludeExtraneousValues: true,
            }),
        }
    }
}
