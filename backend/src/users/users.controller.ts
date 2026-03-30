import {
    Body,
    Controller,
    Get,
    Post,
    Patch,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { plainToClass } from 'class-transformer'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ResponseUserDto } from './dto/response-user.dto'
import { RequestChangePasswordCodeDto } from './dto/request-change-password-code.dto'
import { ConfirmChangePasswordDto } from './dto/confirm-change-password.dto'
import { RecaptchaGuard } from 'src/recaptcha/recaptcha.guard'
import { Recaptcha } from 'src/recaptcha/recaptcha.decorator'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @Post()
    // async create(@Body() createUserDto: CreateUserDto) {
    //     const user = await this.usersService.create(createUserDto)
    //     return { user }
    // }

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

    @UseGuards(JwtAuthGuard, RecaptchaGuard)
    @Recaptcha('changePasswordCodeRequest')
    @Post('password/code/request')
    async requestChangePasswordCode(
        @Auth('userId') userId: string,
        @Body() _dto: RequestChangePasswordCodeDto,
    ) {
        return this.usersService.requestChangePasswordCode(userId)
    }

    @UseGuards(JwtAuthGuard, RecaptchaGuard)
    @Recaptcha('changePasswordConfirm')
    @Patch('password')
    async changePassword(
        @Auth('userId') userId: string,
        @Body() confirmChangePasswordDto: ConfirmChangePasswordDto,
    ) {
        return this.usersService.confirmChangePassword(
            userId,
            confirmChangePasswordDto,
        )
    }
    // @UseGuards(JwtAuthGuard)
    // @Get()
    // findAll() {
    //     return this.usersService.findAll()
    // }

    // @UseGuards(JwtAuthGuard)
    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.usersService.findOne(id)
    // }

    // @UseGuards(JwtAuthGuard)
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.usersService.update(id, updateUserDto)
    // }

    // @UseGuards(JwtAuthGuard)
    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.usersService.remove(id)
    // }
}
