import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { Icons } from '../ui/icons';
import Button from '../ui/button';
import { EnquiryResponse } from '@/app/models/IEnquiry';
import { useUpdateEnquiryStatus } from '@/app/api/apiClients';
import { AdminUserContext } from '@/app/context/AdminUserContext';
import { toast } from 'sonner';
import { catchError } from '@/app/constants/catchError';
import { UserCredentialsSub } from '@/app/models/IUser';
import { ButtonLoader } from '@/app/Loader/ComponentLoader';
import { serializeEnquiryStatus } from '@/app/constants/serializer';
import { EnquiryStatus } from '@/app/enums/EnquiryStatus';

type Props = {
    visibility: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>
    selectedEnquiry?: EnquiryResponse
    enquiry: EnquiryResponse
    setEnquiry: React.Dispatch<React.SetStateAction<EnquiryResponse | undefined>>
    handleFetchEnquiries: () => Promise<void>
}

const EnquiryModal = (
    { visibility, setVisibility, enquiry,
        setEnquiry, handleFetchEnquiries: handleFetchContactEnquiries }: Props) => {

    const updateEnquiryStatus = useUpdateEnquiryStatus();

    const { fetchUserCredentials } = useContext(AdminUserContext) || {};

    const [isUpdatingEnquiryStatus, setIsUpdatingEnquiryStatus] = useState(false);

    const handleUpdateEnquiryStatus = async () => {

        let userCredentials: UserCredentialsSub | null | undefined;

        // Show loader
        setIsUpdatingEnquiryStatus(true);

        if (!fetchUserCredentials) return;

        await fetchUserCredentials(true)
            .then((response) => {
                userCredentials = response;
            })
            .catch((error) => {
                toast.error('An error occured, please try again.')
            })

        await updateEnquiryStatus(userCredentials?.accessToken as string, { ...enquiry, status: EnquiryStatus.Resolved })
            .then(async (response) => {

                // Log the response

                // Update enquiry
                setEnquiry(response.data)

                await handleFetchContactEnquiries();

                toast.success('Enquiry status updated successfully.')
            })

            .catch((error) => {
                // Display error
                toast.error('An error occured, please try again.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsUpdatingEnquiryStatus(false);
            })
    }

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            {
                enquiry &&
                <div className="relative bg-white w-full h-full rounded-xl py-7 px-6">
                    <div className="flex items-end justify-between mb-4">
                        <span className="text-mcNiff-gray-2 text-xl">
                            Enquiries Details
                        </span>
                        <button
                            className="w-8 h-8 grid place-items-center bg-mcNiff-primary/20 rounded-md hover:scale-90 transition"
                            onClick={() => setVisibility(false)}
                        >
                            <Icons.Close className='stroke-primary' />
                        </button>
                    </div>
                    <div className="border border-[#F0F2F5] w-full mb-6"></div>
                    <div className="flex flex-col gap-2 text-left mb-4">
                        <div className='mb-5'>
                            <h2 className="text-mcNiff-primary">
                                Name
                            </h2>
                            <p className="text-mcNiff-gray-3">
                                {enquiry.firstName} {enquiry.lastName}
                            </p>
                        </div>
                        <div>
                            <div className='mb-5'>
                                <h2 className="text-mcNiff-primary">
                                    Email address
                                </h2>
                                <p className="text-mcNiff-gray-3">
                                    {enquiry.email}
                                </p>
                            </div>
                            <div className='mb-5'>
                                <h2 className="text-mcNiff-primary">
                                    Message
                                </h2>
                                <p className="text-mcNiff-gray-3 w-[400px]">
                                    {enquiry.message}
                                </p>
                            </div>
                            {
                                enquiry.service &&
                                <div className='mb-5'>
                                    <h2 className="text-mcNiff-primary">
                                        Service
                                    </h2>
                                    <p className="text-mcNiff-gray-3 w-[400px]">
                                        {enquiry.service}
                                    </p>
                                </div>
                            }
                            <div className=''>
                                <h2 className="text-mcNiff-primary">
                                    Status
                                </h2>
                                <p className={`text-primary ${enquiry.status === EnquiryStatus.Resolved && '!text-mcNiff-primary-green3'}`}>
                                    {serializeEnquiryStatus(enquiry.status)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-6">
                        <Button
                            onClick={() => setVisibility(false)}
                            className="!text-mcNiff-primary bg-transparent">
                            Go back
                        </Button>
                        <Button
                            disabled={isUpdatingEnquiryStatus || enquiry.status === EnquiryStatus.Resolved}
                            onClick={() => handleUpdateEnquiryStatus()}
                            hideLoader
                            type='submit'
                            className='rounded-full !whitespace-nowrap cursor-pointer !text-white bg-mcNiff-primary'>
                            Mark as resolved
                            {isUpdatingEnquiryStatus && <ButtonLoader />}
                        </Button>
                    </div>
                </div>
            }

        </ModalWrapper>
    )
}

export default EnquiryModal