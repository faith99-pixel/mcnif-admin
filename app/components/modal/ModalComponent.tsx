import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import ModalWrapper from './ModalWrapper';
import ModalIndicatorIcon from '../reusable/ModalIndicatorIcon';
import { Icons } from '../ui/icons';
import Button from '../ui/button';
import images from '@/public/images';
import CustomImage from '../ui/image';

interface ModalComponentProps {
    setVisibility: Dispatch<SetStateAction<boolean>>;
    visibility: boolean;
    children?: ReactNode;
    rightActionButton?: { visibility: boolean; text: string; function: () => Promise<void>; }
    leftActionButton?: { visibility: boolean; text: string; }
    isLoading?: boolean;
    contentType?: string;
}

interface SuccessModalComponentProps {
    setVisibility: Dispatch<SetStateAction<boolean>>;
    visibility: boolean;
    messageTitle: string;
    description: string;
    actionBtnFunction?: () => Promise<void>;
    actionButtonText?: string;
    isLoading?: boolean;
}
interface EditModalComponentProps {
    setVisibility: Dispatch<SetStateAction<boolean>>;
    visibility: boolean;
    isLoading?: boolean;
}


// Delete modal component
export const DeleteModalComponent = ({
    setVisibility,
    visibility,
    children,
    leftActionButton,
    rightActionButton,
    isLoading,
    contentType
}: ModalComponentProps) => {

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div
                className="bg-white w-full h-full rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <ModalIndicatorIcon
                        icon={<Icons.PromptDeleteIcon />}
                        color='red'
                    />
                    <span className='-translate-y-2 cursor-pointer w-10 h-10 rounded-full grid place-items-center hover:bg-mcNiff-light-gray' onClick={() => setVisibility(false)}>
                        <Icons.Close />
                    </span>
                </div>
                <div className="">
                    <h2 className='text-mcNiff-gray-2 font-semibold text-lg'>Delete {contentType} </h2>
                    <p className='max-w-[352px] text-mcNiff-gray-3 text-sm leading-5 mb-8'>Are you sure you want to delete this {contentType}? This action cannot be undone.</p>
                    <div className="flex items-center gap-3">
                        {leftActionButton?.visibility && (
                            <Button
                                type='button'
                                className='bg-transparent border border-primary !text-mcNiff-gray-2 w-full !p-2 hover:bg-mcNiff-light-gray transition'
                                onClick={() => setVisibility(false)}
                            >
                                {leftActionButton.text}
                            </Button>
                        )}
                        {rightActionButton?.visibility && (
                            <Button
                                type='submit'
                                disabled={isLoading}
                                style={isLoading ? { opacity: '0.6', pointerEvents: 'none' } : {}}
                                className='w-full relative overflow-hidden !p-2 hover:bg-buffet-accent-foreground transition'
                                onClick={() => rightActionButton.function()}
                            >
                                {rightActionButton.text}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    )
}

// Delete success modal component
export const DeleteSuccessModalComponent = ({
    setVisibility,
    visibility,
    contentType,
}: ModalComponentProps) => {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div className="bg-white w-full h-full rounded-xl py-7 px-6">
                <span className='ml-auto w-full flex justify-end cursor-pointer mb-4' onClick={() => setVisibility(false)}><Icons.Close /></span>
                <div className="flex flex-col gap-2 text-center">
                    <ModalIndicatorIcon
                        icon={<Icons.PromptDeleteIcon />}
                        color='red'
                    />
                    <h2 className='text-mcNiff-gray-2 font-semibold text-lg mt-2'>{contentType} Deleted</h2>
                    <p className='text-mcNiff-gray-3 text-base mb-2 leading-5'>The {contentType} post has been successfully deleted.</p>
                </div>
            </div>
        </ModalWrapper>
    )
}

// Success modal component
export const SuccessModalComponent = ({
    setVisibility,
    visibility,
    messageTitle,
    description,
    actionBtnFunction,
    actionButtonText,
    isLoading
}: SuccessModalComponentProps) => {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div
                className="bg-white w-full h-full rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <ModalIndicatorIcon
                        icon={<Icons.check />}
                        color='green'
                    />
                    <span className='-translate-y-2 cursor-pointer w-10 h-10 rounded-full grid place-items-center hover:bg-mcNiff-light-gray' onClick={() => setVisibility(false)}>
                        <Icons.Close />
                    </span>
                </div>
                <div className="">
                    <h2 className='text-mcNiff-gray-2 font-semibold text-lg'>{messageTitle}</h2>
                    <p className={`max-w-[352px] text-mcNiff-gray-3 text-sm leading-5 ${actionBtnFunction && "mb-8"}`}>{description}</p>
                    {
                        actionBtnFunction && (
                            <div className="flex items-center gap-3">
                                <Button
                                    type='button'
                                    className='bg-transparent border border-primary !text-mcNiff-gray-2 w-full !p-2 hover:bg-mcNiff-light-gray transition'
                                    onClick={() => setVisibility(false)}
                                >
                                    No, Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isLoading}
                                    style={isLoading ? { opacity: '0.6', pointerEvents: 'none' } : {}}
                                    className='w-full relative overflow-hidden !p-2 hover:bg-mcNiff-gray-2 transition'
                                    onClick={() => actionBtnFunction()}
                                >
                                    {actionButtonText}
                                </Button>
                            </div>
                        )
                    }
                </div>
            </div>
        </ModalWrapper>
    )
}




