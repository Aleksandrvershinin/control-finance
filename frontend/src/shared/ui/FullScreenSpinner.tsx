import Spiner from './Spiner'
import { Dialog } from './dialog'

type FullScreenSpinnerProps = { isShow?: boolean }

export const FullScreenSpinner = ({
    isShow = true,
}: FullScreenSpinnerProps) => {
    return (
        <Dialog open={isShow}>
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[--neutral-300] backdrop-blur-3xl">
                <Spiner className="!w-20 !h-20" />
            </div>
        </Dialog>
    )
}
