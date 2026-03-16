import {
    ValidationPipe,
    BadRequestException,
    ValidationError,
} from '@nestjs/common'
import { mapValidationErrors } from '../mappers/validators/validation-error.mapper'

export class GlobalValidationPipe extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            transform: true,
            exceptionFactory: (errors: ValidationError[]) =>
                new BadRequestException({
                    success: false,
                    message: 'Ошибка валидации',
                    error: 'Bad Request',
                    errors: mapValidationErrors(errors),
                }),
        })
    }
}
