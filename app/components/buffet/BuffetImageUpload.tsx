import Image from 'next/image'
import React from 'react'
import { Icons } from '../ui/icons'
import { handleFileUpload } from '@/app/constants/imageUploader'
import Button from '../ui/button'
import { CompleteBuffetRequest } from '@/app/models/IBuffet'

type Props = {
    imageUrlErrorMsg: string | boolean
    setImageUrlErrorMsg: React.Dispatch<React.SetStateAction<string | boolean>>
    photo: string | undefined
    setPhoto: React.Dispatch<React.SetStateAction<string | undefined>>
    formValues: CompleteBuffetRequest | undefined
    setFormValues: React.Dispatch<React.SetStateAction<CompleteBuffetRequest | undefined>>
} 

const BuffetImageUpload = ({ imageUrlErrorMsg, photo, setPhoto, setImageUrlErrorMsg, formValues, setFormValues }: Props) => {
    return (
        <>
            <div className='bg-mcNiff-light-gray-2 rounded-lg w-full flex flex-col items-center justify-center h-[200px] gap-3 relative'>
                {photo && <Image src={photo} alt="Blog image url" fill className='object-cover object-center absolute rounded-[10px]' />}
                <div className='flex flex-col gap-1 items-center justify-center'>
                    <Icons.Image />
                    <p className='text-mcNiff-gray-3 text-sm'>Only JPG or PNG are allowed. Max size of 1MB</p>
                </div>
                <Button type='button' className=''>
                    <input type="file"
                        onChange={(e) => {
                            handleFileUpload({
                                e,
                                setImageUploadErrorMsg: setImageUrlErrorMsg,
                                updateFormValues: setFormValues,
                                formValues: formValues,
                                setImageUrl: setPhoto
                            })
                            setImageUrlErrorMsg(false)
                        }}
                        className='absolute w-full h-full top-0 left-0 cursor-pointer opacity-0' />
                    Choose an Image
                </Button>
            </div>
            {imageUrlErrorMsg && <span className='text-error text-sm'>Please select an image</span>}
        </>
    )
}

export default BuffetImageUpload