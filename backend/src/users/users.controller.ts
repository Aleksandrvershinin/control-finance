import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { plainToClass } from 'class-transformer'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ResponseUserDto } from './dto/response-user.dto'

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
