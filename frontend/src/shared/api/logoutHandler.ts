let logoutHandler: (() => void | Promise<void>) | null = null

export const setLogoutHandler = (handler: () => void | Promise<void>) => {
    logoutHandler = handler
}

export const triggerLogout = async () => {
    if (logoutHandler) {
        await logoutHandler()
    }
}
