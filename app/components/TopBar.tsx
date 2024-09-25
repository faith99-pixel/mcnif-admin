import React, { useContext, useState } from 'react';
import { Icons } from './ui/icons';
import CustomImage from './ui/image';
import images from '@/public/images';
import Link from 'next/link';
import { ApplicationRoutes } from '../constants/applicationRoutes';
import { AdminUserContext, AdminUserContextData } from '../context/AdminUserContext';
import NotificationsDrawer from './drawer/NotificationsDrawer';
import SettingsDrawer from './drawer/SettingsDrawer';

type Props = {};

const TopBar = () => {
    const { userProfileInformation, notifications } = useContext(AdminUserContext) as AdminUserContextData;

    const [notificationsDrawerVisibility, setNotificationsDrawerVisibility] = useState(false);
    const [settingsDrawerVisibility, setSettingsDrawerVisibility] = useState(false);

    const toggleSettings = () => {
        setSettingsDrawerVisibility(!settingsDrawerVisibility);
    };

    return (
        <>
            <NotificationsDrawer
                notificationsDrawerVisibility={notificationsDrawerVisibility}
                setNotificationsDrawerVisibility={setNotificationsDrawerVisibility}
            />

            <SettingsDrawer
                settingsDrawerVisibility={settingsDrawerVisibility}
                setSettingsDrawerVisibility={setSettingsDrawerVisibility}
            />

            <div className='flex items-center justify-between mb-12'>
                {/* <form className='flex items-center justify-center gap-2 border-[#E3E3E3] border p-2 shadow-sm outline-none'>
                    <Icons.SearchIcon />
                    <input className='outline-none bg-transparent w-[500px] text-sm' type="text" placeholder='Search for a buffet' />
                </form> */}

                <div className='flex items-center gap-4 ml-auto'>
                    {/* Notification Icon */}
                    <div className='relative'>
                        <div
                            className='grid place-items-center w-10 h-10 rounded-full cursor-pointer hover:bg-gray-200'
                            onClick={() => setNotificationsDrawerVisibility(!notificationsDrawerVisibility)}>
                            {
                                notifications &&
                                <span className='absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full grid place-items-center text-xs'>
                                    {notifications?.length}
                                </span>
                            }
                            <Icons.NotificationIcon className='w-6 h-8' />
                        </div>
                    </div>

                    {/* Settings Icon */}
                    <div className='relative'>
                        <div className='grid place-items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer' onClick={toggleSettings}>
                            <Icons.Settings className='w-6 h-8' />
                        </div>
                    </div>

                    {/* User Avatar */}
                    {
                        userProfileInformation &&
                        <Link
                            href={ApplicationRoutes.Profile}
                            className='relative w-10 h-10 rounded-full overflow-hidden border-primary border-2 cursor-pointer hover:contrast-125'>
                            <CustomImage src={userProfileInformation?.imageUrl ?? images.avatar_image} alt='' className='object-cover' />
                        </Link>
                    }
                </div>
            </div>
        </>
    );
};

export default TopBar;
