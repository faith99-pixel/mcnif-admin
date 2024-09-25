import { Icons } from '@/app/components/ui/icons'
import React from 'react'

type Props = {
    icon: React.ReactNode;
    color: string;
}

const ModalIndicatorIcon = ({ icon, color }: Props) => {

    return (
        <div className="relative h-fit">
            <div className="relative grid place-items-center mx-auto">
                <div className={`absolute transform w-16 h-16 bg-${color}-300/20 rounded-full animate-pulse`}></div>
                <span className={`z-10 w-12 h-12 bg-${color}-400/20 rounded-full grid place-items-center`}>
                    {icon}
                </span>
            </div>
        </div>
    )
}

export default ModalIndicatorIcon