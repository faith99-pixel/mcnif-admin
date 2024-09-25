"use client";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { Icons } from "../components/ui/icons";
import PaymentTable from "./PaymentTable";
import PageTitle from "../components/reusable/PageTitle";
import { Payment } from "../models/IPayment";
import { SuccessModalComponent } from "../components/modal/ModalComponent";
import { AdminUserContext, AdminUserContextData } from "../context/AdminUserContext";
import { UserCredentialsSub } from "../models/IUser";
import { useFetchPayments, useVerifyCashPayment, useFetchPaymentDetails } from '../api/apiClients';
import jsonexport from "jsonexport";
import { toast } from "sonner";
import { catchError } from "../constants/catchError";
import moment from "moment";
import { serializePaymentMethod, serializePaymentStatus } from "../constants/serializer";
import PaymentDetailsModal from "../components/modal/PaymentDetailsModal";

type Props = {};

export enum Tabs {
    All = "All",
    Unverified = "Unverified",
    Pending = "Pending",
    Success = "Success",
}

const PaymentPage = (props: Props) => {

    const fetchPayments = useFetchPayments();
    const verifyCashPayment = useVerifyCashPayment()
    const fetchPaymentDetails = useFetchPaymentDetails()
    const { fetchUserCredentials } = useContext(AdminUserContext) as AdminUserContextData

    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.All);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedPayments, setSelectedPayments] = useState<Payment[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const [isFetchingPayments, setIsFetchingPayments] = useState<boolean>(true);
    const [isFetchingPaymentDetails, setIsFetchingPaymentDetails] = useState<boolean>(false);
    const [paymentDetails, setPaymentDetails] = useState<Payment>();
    const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<Payment>();
    const [isPaymentDetailsModalVisible, setIsPaymentDetailsModalVisible] = useState(false);
    const [isPaymentConfirmationModalVisible, setIsPaymentConfirmationModalVisible] = useState<boolean>(false);
    const [isConfirmingPayment, setIsConfirmingPayment] = useState<boolean>(false);
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
    const [isDownloadingPaymentInfo, setIsDownloadingPaymentInfo] = useState(false)

    function showPaymentConfirmationModal(payment: Payment) {
        setSelectedPayment(payment);
        setIsPaymentConfirmationModalVisible(true);
    };

    async function handleFetchPayments() {
        let userCredentials: UserCredentialsSub | null | undefined;

        // if user credentials does not exist, do nothing
        if (!fetchUserCredentials) return;

        const _handleFetchPayments = async (accessToken: string) => {
            await fetchPayments(accessToken)
                .then((response) => {
                    setPayments(response.data);
                })
                .catch((error) => {
                })
                .finally(() => setIsFetchingPayments(false))
        };

        // Fetch user credentials if they exist
        await fetchUserCredentials(true)
            .then(async (response) => {
                userCredentials = response;

                // Invoke function to fetch all payments
                await _handleFetchPayments(userCredentials?.accessToken as string)
            })
            .catch((error) => {
            })
    };

    const handleFetchPaymentDetails = async (payment: Payment) => {

        let userCredentials: UserCredentialsSub | null | undefined;
  
        if (!fetchUserCredentials) return;
  
        setIsFetchingPaymentDetails(true);
  
        await fetchUserCredentials(true)
           .then((response) => {
              userCredentials = response;
           })
           .catch((error) => {
           })
  
        await fetchPaymentDetails(userCredentials?.accessToken as string, payment.id)
  
           .then((response) => {
              // Log the response
              // Set the Enquiry
              setPaymentDetails(response.data)
              setIsPaymentDetailsModalVisible(true);
           })
           .catch((error) => {
              // Display error
              toast.error('An error occured, please try again.')
              catchError(error)
           })
           .finally(() => {
  
              // Close loader 
              setIsFetchingPaymentDetails(false);
           })
     };


    async function handleDownloadPaymentInfo(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {

        // Prevent default actions
        e.preventDefault();
        setIsDownloadingPaymentInfo(true);

        try {
            // Determine the data to export: selected payments or all payments
            const dataToExport = selectedPayments.length > 0 ? selectedPayments : payments;
            // console.log("dataToExport:", dataToExport)

            const formattedData = dataToExport.map((eachData) => {
                return {
                    "Payment ID": eachData.id,
                    "First Name": eachData.firstName,
                    "Last Name": eachData.lastName,
                    "Phone number": eachData.phoneNumber,
                    "Buffet Name": eachData.buffetName,
                    "Buffet Session": eachData.buffetSession,
                    "Payment Date": moment(eachData.reservationDate).format('YYYY-MM-DD'),
                    "Total Amount": eachData.totalAmountWithDiscount.toLocaleString(),
                    "Payment Status": serializePaymentStatus(eachData.paymentStatus),
                    "Payment method": serializePaymentMethod(eachData.paymentMethod),
                    "Discount Applied": eachData.discountApplied,
                }
            })
            // Convert data to CSV format
            const csvData = await jsonexport(formattedData);


            // Initialize file name
            const fileName = selectedPayments.length > 0 ? 'BuffetPayment.csv' : 'AllPayments.csv';

            // Create a Blob containing the CSV data
            const blob = new Blob([csvData], { type: 'text/csv' });

            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);

            // Create an invisible download link
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;

            // Append the link to the DOM
            document.body.appendChild(a);

            // Programmatically click the link to trigger the download
            a.click();

            // Remove the link from the DOM
            document.body.removeChild(a);

            setIsDownloadingPaymentInfo(false);

            // Optionally display a success message
            toast('Download successful');
        } catch (error) {
            console.error('Error exporting CSV:', error);
            setIsDownloadingPaymentInfo(false);
            // Optionally display an error message
            toast('Failed to download payment information.');
        }
    }

    async function handleConfirmPayment() {

        let userCredentials: UserCredentialsSub | null | undefined;

        // Show loader
        setIsConfirmingPayment(true);

        if (!fetchUserCredentials) return;

        // Fetch user credentials
        fetchUserCredentials(true)

            .then(async (response) => {
                userCredentials = response;
                // Verify payment
                return verifyCashPayment(userCredentials?.accessToken as string, selectedPayment?.id as string);
            })
            .then(() => {
                // Fetch updated payments
                return handleFetchPayments();
            })
            .then(() => {
                // Set payment as confirmed
                setIsPaymentConfirmed(true);

                // Show success message
                toast.success('Payment confirmed successfully');
                              
                // Close modal
                setIsPaymentConfirmationModalVisible(false);
            })
            .catch(error => {
                console.error("🚀 ~ handleConfirmPayment ~ error:", error);
                toast.error('Buffet session has no more available slots.');
                catchError(error);
            })
            .finally(() => {
                setIsConfirmingPayment(false);
            });
    };


    useEffect(() => {
        handleFetchPayments();
    }, [])

    return (
        <>
          {
            paymentDetails &&
            <PaymentDetailsModal 
               visibility={isPaymentDetailsModalVisible}
               setVisibility={setIsPaymentDetailsModalVisible}
               paymentDetails={paymentDetails}
               setPaymentDetails={setPaymentDetails}
               handleFetchPayments={handleFetchPayments}
            />
         }
            <SuccessModalComponent
                visibility={isPaymentConfirmationModalVisible}
                setVisibility={setIsPaymentConfirmationModalVisible}
                messageTitle="Confirm Payment"
                description="Are you sure you want to confirm this payment? This action cannot be undone."
                actionBtnFunction={handleConfirmPayment}
                actionButtonText="Yes, Confirm"
                isLoading={isConfirmingPayment}
            />

            <main className="">
                <PageTitle title="Payments" />

                {
                    payments.length > 0 &&
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-3 items-center">
                                <Icons.Filter />
                                <h2>Filter by</h2>
                            </div>
                            <div className="flex gap-4">
                                {
                                    Object.values(Tabs).map((tab) => (
                                        <span
                                            key={tab}
                                            onClick={() => {
                                                setActiveTab(tab);
                                            }}
                                            className={`${activeTab === tab
                                                ? "bg-primary text-white pointer-events-none"
                                                : "bg-[#E4DDD4] text-[#8E8E8E]"
                                                } cursor-pointer rounded-[30px] px-[20px] py-[5px] font-semibold text-sm whitespace-nowrap`}>
                                            {tab}
                                        </span>
                                    ))
                                }
                            </div>
                        </div>

                        <div className='flex justify-end ml-auto mb-6'>
                            <button className={`flex items-center py-2 px-4 rounded-full gap2 ${payments ? "bg-primary" : "bg-mcNiff-light-gray-4"}`} onClick={(e) => handleDownloadPaymentInfo(e)}>
                                <Icons.Download />
                                <span className='text-white'>Download data</span>
                            </button>
                        </div>
                    </div>
                }

                <PaymentTable
                    activeTab={activeTab}
                    selectedPayments={selectedPayments}
                    setSelectedPayments={setSelectedPayments}
                    showPaymentConfirmationModal={showPaymentConfirmationModal}
                    payments={payments}
                    setPayments={setPayments}
                    isFetchingPayments={isFetchingPayments}
                    handleFetchPaymentDetails={handleFetchPaymentDetails}
                    isFetchingPaymentDetails={isFetchingPaymentDetails}
                    selectedPaymentDetails={selectedPaymentDetails}
                />
            </main>
        </>
    );
};

export default PaymentPage;
