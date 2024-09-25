import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { Icons } from '../ui/icons';
import Button from '../ui/button';
import { useUpdatePaymentStatus } from '@/app/api/apiClients';
import { AdminUserContext } from '@/app/context/AdminUserContext';
import { toast } from 'sonner';
import { catchError } from '@/app/constants/catchError';
import { UserCredentialsSub } from '@/app/models/IUser';
import { serializePaymentMethod, serializePaymentStatus } from '@/app/constants/serializer';
import { Payment } from '@/app/models/IPayment';
import { PaymentStatus } from '@/app/enums/PaymentStatus';
import moment from 'moment';
import { displayPrice } from '@/app/constants/priceDisplay';

type Props = {
    visibility: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>
    paymentDetails: Payment
    setPaymentDetails: React.Dispatch<React.SetStateAction<Payment | undefined>>
    handleFetchPayments(): Promise<void>
}

const PaymentDetailsModal = (
    { visibility, setVisibility, paymentDetails,
        setPaymentDetails, handleFetchPayments }: Props) => {
    // console.log('paymentDetails', paymentDetails)
    const updatePaymentStatus = useUpdatePaymentStatus()

    const { fetchUserCredentials } = useContext(AdminUserContext) || {};

    const [isUpdatingPaymentStatus, setIsUpdatingPaymentStatus] = useState(false);

    const handleUpdatePaymentStatus = async () => {
        // console.log('handleUpdatePaymentStatus', handleUpdatePaymentStatus)

        let userCredentials: UserCredentialsSub | null | undefined;

        // Show loader
        setIsUpdatingPaymentStatus(true);

        if (!fetchUserCredentials) return;

        await fetchUserCredentials(true)
            .then((response) => {
                userCredentials = response;
            })
            .catch((error) => {
                toast.error('An error occured, please try again.')
            })

        await updatePaymentStatus(userCredentials?.accessToken as string, { ...paymentDetails, status: PaymentStatus.Verified })
            .then(async (response) => {

                // Log the response

                // Update enquiry
                setPaymentDetails(response.data)

                await handleFetchPayments();

                toast.success('payment status updated successfully.')
            })

            .catch((error) => {
                // Display error
                toast.error('An error occured, please try again.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsUpdatingPaymentStatus(false);
            })
    }

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            {
                paymentDetails &&
                <div className="relative bg-white w-full  rounded-xl py-7 px-6 overflow-y-auto hideScrollbar scroll h-[calc(80vh-30px)]">
                    <div className="flex items-end justify-between mb-4">
                        <span className="text-mcNiff-gray-2 text-xl">
                            Buffet Payment:
                        </span>
                        <button
                            className="w-8 h-8 grid place-items-center bg-mcNiff-primary/20 rounded-md hover:scale-90 transition"
                            onClick={() => setVisibility(false)}
                        >
                            <Icons.Close className='stroke-primary' />
                        </button>
                    </div>
                    <div className="border border-[#F0F2F5] w-full mb-6"></div>
                    <ul className='flex flex-col w-[350px]'>
                        <li className='mb-5 flex gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">
                                Name:
                            </h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {paymentDetails.firstName} {paymentDetails.lastName}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">
                                Buffet Name:
                            </h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {paymentDetails.buffetName}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">
                                Email Address:
                            </h2>
                            <p className="text-mcNiff-gray-3 w-1/2 break-all">
                                {paymentDetails.emailAddress}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Phone Number:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {paymentDetails.phoneNumber}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Buffet Session:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {paymentDetails.buffetSession}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Number of Adults:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {paymentDetails.numberOfAdults}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Number of Children:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {paymentDetails.numberOfAdults}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Number of Infants:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {paymentDetails.numberOfInfants}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Price for Adult:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {displayPrice(paymentDetails.priceForAdult)}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Price for Children:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {displayPrice(paymentDetails.priceForChildren)}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Date:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {moment(paymentDetails.reservationDate).format("Do MMM YYYY")}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Payment Method:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {serializePaymentMethod(paymentDetails.paymentMethod)}
                            </p>
                        </li>
                        <li className='mb-5 flex gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Total Amount:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {`${displayPrice(paymentDetails.totalAmount)} ${paymentDetails.discountApplied > 0 ? `(${paymentDetails.discountApplied}% discount)` : ''}`}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Total amount with discount:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {displayPrice(paymentDetails.totalAmountWithDiscount)}
                            </p>
                        </li>
                        <li className='mb-5 flex  gap-3'>
                            <h2 className="text-mcNiff-primary w-1/2">Dietery Restrictions:</h2>
                            <p className="text-mcNiff-gray-3 w-1/2">
                                {paymentDetails.dietaryRestrictions ?? "Not Specified"}
                            </p>
                        </li>
                        <li>
                            <div className='flex items-center justify-start mb-4 gap-3 '>
                                <h2 className="text-mcNiff-primary w-1/2">Payment Status:</h2>
                                <div className='w-1/2'>
                                    <button
                                        className={`${paymentDetails.paymentStatus === PaymentStatus.Verified && "!text-mcNiff-gray-3" ? '!bg-mcNiff-primary-green3/20 text-mcNiff-primary-green3 pointer-events-none opacity-60'
                                            : '!bg-mcNiff-primary/20 text-mcNiff-primary'} px-2 py-1 rounded-3xl `}>
                                        {serializePaymentStatus(paymentDetails.paymentStatus)}
                                    </button></div>

                            </div>
                        </li>
                    </ul>
                    <div className="flex items-center justify-end gap-6">
                        <Button
                            onClick={() => setVisibility(false)}
                            className="!text-mcNiff-primary bg-transparent text-lg">
                            Cancel
                        </Button>
                    </div>
                </div>
            }

        </ModalWrapper>
    )
};

export default PaymentDetailsModal