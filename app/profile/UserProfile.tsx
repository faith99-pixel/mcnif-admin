"use client"
import React, { FormEvent, useContext, useState } from 'react';
import PageTitle from '../components/reusable/PageTitle';
import { useRouter } from 'next/navigation';
import { Icons } from '../components/ui/icons';
import CustomImage from '../components/ui/image';
import images from '@/public/images';
import Button from '../components/ui/button';
import Label from '../components/ui/label';
import Input from '../components/ui/input';
import { UserProfileUpdateRequest } from '../models/IUserProfileResponse';
import { UserCredentialsSub } from '../models/IUser';
import { AdminUserContext, AdminUserContextData } from '../context/AdminUserContext';
import { useUpdateUser } from '../api/apiClients';
import { toast } from 'sonner';
import { catchError } from '../constants/catchError';
import EditUserProfileModal from '../components/modal/EditUserProfileModal';
import { SuccessModalComponent } from '../components/modal/ModalComponent';

type Props = {

}

const UserProfile = (props: Props) => {

    const router = useRouter();

    const updateUser = useUpdateUser();

    const { fetchUserCredentials, userProfileInformation: userProfile, fetchUserProfileInformation } = useContext(AdminUserContext) as AdminUserContextData;
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [formValues, setFormValues] = useState<UserProfileUpdateRequest>();

    const [isUpdatingUserProfile, setIsUpdatingUserProfile] = useState(false)

    const [isEditModalVisible, setIsEditModalVisible] = useState(false)

    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false);
    // show loader
    const [isLoading, setIsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false); // New state for edit mode

    // Function to update a user
    async function handleUpdateUserProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsUpdatingUserProfile(true);
        let userCredentials: UserCredentialsSub | null | undefined;

        if (!fetchUserCredentials) return;

        try {
            const credentialsResponse = await fetchUserCredentials(true);
            userCredentials = credentialsResponse;

            const data = {
                accessToken: userCredentials?.accessToken as string,
                data: formValues as UserProfileUpdateRequest,
            };

            // Update user profile using the provided access token and data
            const updateResponse = await updateUser(data);

            fetchUserProfileInformation();

            // You can navigate back or perform any necessary actions after successful update
            // router.push('/profile');

            setIsUpdatingUserProfile(false);

            setIsSuccessModalVisible(true); // Show success modal

        } catch (error: any) {
            toast.error(`An error occurred. Please try again.`);
            if (error?.response?.data.errorCode === 'Failed to update password') {
                toast.error('Failed to update password. Please try again.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
            catchError(error);
            setIsUpdatingUserProfile(false);
        }
    }

    return (
        <>
            {isEditModalVisible &&
                <EditUserProfileModal
                    setVisibility={setIsEditModalVisible}
                    visibility={isEditModalVisible}
                    setFormValues={setFormValues}
                    formValues={formValues}
                    isEditing={isEditing}
                    userProfile={userProfile}
                    isLoading={isLoading}
                />
            }
            <SuccessModalComponent
                setVisibility={setIsSuccessModalVisible}
                visibility={isSuccessModalVisible}
                messageTitle='Profile Updated'
                description='Your profile has been successfully updated.. You can always come back to make updates at any time.'
            />

            <div className='flex flex-col'>
                <PageTitle
                    title='Profile'
                    complimentaryButton={
                        <button
                            className='w-10 h-10 rounded-full grid place-items-center cursor-pointer hover:bg-white'
                            onClick={() => router.back()}
                        >
                            <Icons.ArrowLeft />
                        </button>
                    }
                />
            </div>

            <div className='flex items-center justify-around !w-[50%]'>
                <div className='relative'>
                    <div className='relative w-32 h-32 rounded-full overflow-hidden border-primary border-2 cursor-pointer'>
                        <CustomImage
                            className='w-full h-full object-cover'
                            src={formValues?.imageBase64Url ?
                                `data:image/png;base64,${formValues?.imageBase64Url}` :
                                userProfile?.imageUrl ??
                                images.avatar_image}
                            alt='user photo'
                            fill
                        />
                    </div>

                    <div className='absolute grid place-items-center bg-white rounded-full border -bottom-4 left-20 cursor-pointer'>
                        {
                            isEditing &&
                            <button className='bg-primary rounded-full p-1'>
                                <input
                                    // onChange={(e) => handleFileUpload(e)}
                                    onClick={() => {
                                        setIsEditModalVisible(true)
                                    }}
                                    className='absolute w-full h-full top-0 left-0 cursor-pointer opacity-0' />
                                <Icons.Camera />
                            </button>
                        }
                    </div>
                </div>
                {/* <div className='flex flex-col items-center space-y-2'>
          <h1 className='text-[22px] font-bold'>{userProfile?.firstName}</h1>
          <p>{userProfile?.email}</p>
          <button onClick={() => setIsEditing(true)} className='bg-primary rounded-md p-2 text-white'>Edit Profile</button>
        </div> */}
                <p className='ml-8 text-mcNiff-gray-2'>{userProfile?.firstName} {userProfile?.lastName}</p>

                <Button onClick={() => setIsEditing(true)} className='flex items-center justify-center ml-auto'>
                    <Icons.PenIcon /> Edit profile
                </Button>
            </div>

            <form className='!w-[50%]' onSubmit={(e) => handleUpdateUserProfile(e)}>
                <div className='flex flex-col gap-4 mt-8 mb-10'>
                    <div className='flex gap-4 '>
                        <div className=''>
                            <Label text={<>First Name</>} />
                            <Input
                                type='text'
                                name='firstName'
                                placeholder='Enter first name'
                                className={`max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px] ${!isEditing ? "opacity-50" : ""}`}
                                value={formValues?.firstName ?? userProfile?.firstName}
                                onChange={(e) => {
                                    setFormValues({ ...formValues as UserProfileUpdateRequest, firstName: e.target.value });
                                }}
                                disabled={!isEditing} // Disable input when not in edit mode
                            />
                        </div>
                        <div>
                            <Label text={<>Last Name</>} />
                            <Input
                                type='text'
                                name='lastName'
                                placeholder='Enter last name'
                                className={`max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px] ${!isEditing ? "opacity-50" : ""}`}
                                value={formValues?.lastName ?? userProfile?.lastName}
                                onChange={(e) => {
                                    setFormValues({ ...formValues as UserProfileUpdateRequest, lastName: e.target.value });
                                }}
                                disabled={!isEditing} // Disable input when not in edit mode
                            />
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div>
                            <Label text={<>Email Address</>} />
                            <Input
                                type='email'
                                name='email'
                                placeholder='Email Address'
                                className={`max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px] ${!isEditing ? "opacity-50" : ""}`}
                                value={userProfile?.email}
                                disabled={!isEditing} // Disable input when not in edit mode
                            />
                        </div>
                        <div>
                            <Label text={<>Phone Number</>} />
                            <Input
                                type='text'
                                name='phoneNumber'
                                placeholder='Enter phone number'
                                className={`max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px] ${!isEditing ? "opacity-50" : ""}`}
                                value={formValues?.phoneNumber ?? userProfile?.phoneNumber}
                                onChange={(e) => {
                                    setFormValues({ ...formValues as UserProfileUpdateRequest, phoneNumber: e.target.value });
                                }}
                                disabled={!isEditing} // Disable input when not in edit mode
                            />
                        </div>
                    </div>
                    {
                        isEditing &&
                        <div className='flex gap-4'>
                            <div>
                                <Label text={<>Current Password</>} />
                                <div className='relative'>
                                    <Input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        name='currentPassword'
                                        placeholder='Enter current password'
                                        className={`max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px] ${!isEditing ? "opacity-50" : ""}`}
                                        onChange={(e) => {
                                            setFormValues({ ...formValues as UserProfileUpdateRequest, currentPassword: e.target.value });
                                        }}
                                        disabled={!isEditing} // Disable input when not in edit mode
                                    />
                                    <span className='absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                        {showCurrentPassword ? <Icons.EyeOpen /> : <Icons.EyeClosed />}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <Label text={<>New Password</>} />
                                <div className='relative'>
                                    <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name='newPassword'
                                        placeholder='Enter new password'
                                        className={`max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px] ${!isEditing ? "opacity-50" : ""}`}
                                        onChange={(e) => {
                                            setFormValues({ ...formValues as UserProfileUpdateRequest, newPassword: e.target.value });
                                        }}
                                        disabled={!isEditing} // Disable input when not in edit mode
                                    />
                                    <span className='absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer' onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <Icons.EyeOpen /> : <Icons.EyeClosed />}
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {isEditing && (
                    <div className="flex items-center justify-end text-sm gap-5">
                        <Button
                            className="!bg-transparent !text-primary cursor-pointer transition-all ease-in duration-300"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdatingUserProfile}
                            className="!px-10 whitespace-nowrap cursor-pointer disabled:pointer-events-none disabled:opacity-60 relative overflow-hidden"
                        >
                            Save
                        </Button>
                    </div>
                )}
            </form>
        </>
    )
}

export default UserProfile;
