"use client"
import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { Icons } from '../ui/icons'
import CustomImage from '../ui/image'
import images from '@/public/images'
import Button from '../ui/button'
import { UserProfileResponse, UserProfileUpdateRequest } from '@/app/models/IUserProfileResponse'

type Props = {
    visibility: boolean
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
    isLoading: boolean
    setFormValues: React.Dispatch<React.SetStateAction<UserProfileUpdateRequest | undefined>>
    formValues: UserProfileUpdateRequest | undefined
    isEditing: boolean
    userProfile: UserProfileResponse | null
}

const EditUserProfileModal = ({ visibility, setVisibility, isLoading, setFormValues, formValues, userProfile, isEditing }: Props) => {

    const [file, setFile] = useState<string>('');

    const handleFileUpload = (e: any) => {
        const selectedFile: File = e.target.files[0];

        if (selectedFile && (selectedFile.type === "image/jpg" ||
            selectedFile.type === "image/png" ||
            selectedFile.type === 'image/jpeg' ||
            selectedFile.type === 'image/webp')) {

            const reader = new FileReader();

            reader.onload = (e) => {
                const base64URL: string = e.target?.result as string;

                if (base64URL) {
                    const base64String = base64URL.split(',')[1];
                    setFormValues({ ...formValues as UserProfileUpdateRequest, imageBase64Url: base64String });
                    setVisibility(true)

                }
            };

            reader.readAsDataURL(selectedFile);
            setFile(URL.createObjectURL(selectedFile));
        }
    };

    return (
        <>
            <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
                <div className="bg-white w-full h-full rounded-xl p-8">
                    <div className="flex justify-between items-center mb-2">
                        <p>Edit Profile Image</p>
                        <span className='-translate-y-2 cursor-pointer w-10 h-10 rounded-full grid place-items-center hover:bg-mcNiff-light-gray' onClick={() => setVisibility(false)}>
                            <Icons.Close />
                        </span>
                    </div>
                    <div className='w-full border border-[#F0F2F5] mb-6'></div>
                    <div className="">
                        <div className='relative w-32 h-32 rounded-full overflow-hidden border-primary border-2 m-auto mb-8'>
                            <CustomImage
                                className='w-full h-full object-cover'
                                // src={file || images.avatar_image}
                                src={formValues?.imageBase64Url ?
                                    `data:image/png;base64,${formValues?.imageBase64Url}` :
                                    userProfile?.imageUrl ??
                                    images.avatar_image}
                                alt='user photo'
                                fill
                            />
                        </div>
                        {
                            isEditing &&
                            <Button
                                disabled={isLoading}
                                style={isLoading ? { opacity: '0.6', pointerEvents: 'none' } : {}}
                                className='w-full relative overflow-hidden text-sm font-normal !px-4 !py-2 hover:bg-buffet-accent-foreground transition'
                            >
                                <input type='file'
                                    onChange={(e) => handleFileUpload(e)} className='absolute w-full h-full top-0 left-0 cursor-pointer opacity-0' />
                                Select image from your computer
                            </Button>
                        }
                    </div>
                </div>
            </ModalWrapper>

        </>
    );
}

export default EditUserProfileModal;
