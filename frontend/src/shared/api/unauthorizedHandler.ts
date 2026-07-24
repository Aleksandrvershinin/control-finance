let unauthorizedHandler: (() => void | Promise<void>) | null = null

export const setUnauthorizedHandler = (handler: () => void | Promise<void>) => {
    unauthorizedHandler = handler
}

export const triggerUnauthorized = async () => {
    if (unauthorizedHandler) {
        await unauthorizedHandler()
    }
}
