export const telegramService = {
    get webApp() {
        return window.Telegram?.WebApp
    },

    isMiniApp() {
        return Boolean(window.Telegram?.WebApp?.initData)
    },

    get initData() {
        return window.Telegram?.WebApp?.initData
    },
}
