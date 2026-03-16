import { AxiosResponse } from 'axios'
import { ZodType } from 'zod'

export function responseContract<Data>(schema: ZodType<Data>) {
    return function parseResponse(
        response: AxiosResponse<unknown>,
    ): AxiosResponse<Data> {
        const data = schema.parse(response.data)
        return { ...response, data }
    }
}
