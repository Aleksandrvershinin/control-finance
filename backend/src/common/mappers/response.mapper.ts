import { plainToInstance } from 'class-transformer'

export function toResponse(dto: any, data: any) {
    return plainToInstance(dto, data, {
        excludeExtraneousValues: true,
    })
}
