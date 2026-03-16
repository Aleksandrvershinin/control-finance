import { CurrentUserResponse } from '../api/userResponse.types'
import { CurrentUser } from '../model/user.types'

export function transformCurrentUserResponseToCurrentUser(
    currentUserResponse: CurrentUserResponse,
): CurrentUser {
    const { user } = currentUserResponse

    return {
        id: user.id,
        email: user.email,
        currencyId: user.currencyId,
    }
}
