import { useChangePasswordDialogStore } from '../model/useChangePasswordDialogStore'

export const ChangePasswordButton = () => {
    const open = useChangePasswordDialogStore((s) => s.open)

    return (
        <button type="button" onClick={open}>
            Сменить пароль
        </button>
    )
}
