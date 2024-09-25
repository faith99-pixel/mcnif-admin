import React, { useContext } from 'react'
import DrawerWrapper from './DrawerWrapper'
import moment from 'moment'
import { Icons } from '../ui/icons'
import { AdminUserContext, AdminUserContextData } from '@/app/context/AdminUserContext'
import { ComponentLoader } from '@/app/Loader/ComponentLoader'

type Props = {
    notificationsDrawerVisibility: boolean
    setNotificationsDrawerVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

const NotificationsDrawer = ({ setNotificationsDrawerVisibility, notificationsDrawerVisibility }: Props) => {

    const { notifications, isFetchingNotifications } = useContext(AdminUserContext) as AdminUserContextData;

    return (
        <DrawerWrapper
            visibility={notificationsDrawerVisibility}
            setVisibility={setNotificationsDrawerVisibility}
        >
            {
                notifications && !isFetchingNotifications &&
                <div className="h-full">
                    <div className="flex flex-row items-center justify-between p-6 shadow-md">
                        <h3 className="text-mcNiff-gray-2 text-2xl">Notifications</h3>
                        <span
                            className='cursor-pointer w-10 h-10 rounded-full grid place-items-center hover:bg-mcNiff-light-gray'
                            onClick={() => setNotificationsDrawerVisibility(false)}>
                            <Icons.Close />
                        </span>
                    </div>
                    <div className="border-[#F0F2F5] border w-[95%] m-auto"></div>
                    {/* <p className="flex items-center justify-end p-6 text-primary cursor-pointer">
                    Clear All
                </p> */}
                    <div className="overflow-y-auto thinScrollbar scroll h-[calc(100vh-80px)]">
                        {notifications?.map((notification, index) => (
                            <div
                                key={index}
                                className={`flex flex-col m-4 p-3 rounded-xl text-primary bg-primary/10`}
                            >
                                <p className="text-base tracking-wide">{notification.detail}</p>
                                <span className="text-xs mt-2">{moment(notification.createdAt).format("DD MMMM, YYYY ")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {
                isFetchingNotifications &&
                <div className="fixed z-50 bottom-0 top-0  flex items-center justify-center mx-auto">
                    <ComponentLoader />
                </div>
            }
            {
                notifications && notifications.length === 0 &&!isFetchingNotifications &&
                <div className="flex flex-col items-center justify-center text-mcNiff-gray-3 text-xl">
                    No notifications found.
                </div>
            }
        </DrawerWrapper>
    )
}

export default NotificationsDrawer