/* eslint-disable react/jsx-key */
"use client"
import React, { MouseEvent, useContext, useEffect, useState } from 'react'
import PageTitle from '../components/reusable/PageTitle'
import Table from '../components/ui/table'
import { Icons } from '../components/ui/icons'
import { useFetchSubscriptions } from '../api/apiClients'
import { AdminUserContext } from '../context/AdminUserContext'
import { SubscriptionResponse } from '../models/ISubscription'
import { UserCredentialsSub } from '../models/IUser'
import Credentials from 'next-auth/providers/credentials'
import { toast } from 'sonner'
import { catchError } from '../constants/catchError'
import moment from 'moment'
import { FullPageLoader } from '../Loader/ComponentLoader'
import jsonexport from 'jsonexport'

type Props = {}

const SubscriptionContent = (props: Props) => {
    const fetchSubscriptions = useFetchSubscriptions()

    const { fetchUserCredentials } = useContext(AdminUserContext) || {};
    const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
    const [isFetchingSubscriptions, setIsFetchingSubscriptions] = useState(false);

    const [selectedSubscriptiontInfo, setSelectedSubscriptiontInfo] = useState<string>();
    const [isDownloadingSubscriptionInfo, setIsDownloadingSubscriptionInfo] = useState(false)

    const generateNullSubscriptionMsg = () => {
        if (!subscriptions || subscriptions.length === 0) {
            return "There are no subscriptions available";
        }
        return "";
    };

    const handleFetchSubscription = async () => {
        // Show loader 
        setIsFetchingSubscriptions(true)

        let userCredentials: UserCredentialsSub | null | undefined;

        // if user credentials does not exist, do nothing
        if (!fetchUserCredentials) return;

        // Fetch user credentials if they exist
        await fetchUserCredentials(true)
            .then((response) => {
                userCredentials = response;
            })
            .catch((error) => {
            })

        await fetchSubscriptions(userCredentials?.accessToken as string)
            .then((response) => {

                // Log response 

                setSubscriptions(response.data);
            })
            .catch((error) => {
                // Display error
                toast.error(`An error occured. Please try again`);

                // If we have a response error
                catchError(error)
            })
            .finally(() => {

                // Close loader 
                setIsFetchingSubscriptions(false);
            })
    };
    async function handleDownloadSubscriptionInfo(
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) {
        // Prevent default actions
        e.preventDefault();
        setIsDownloadingSubscriptionInfo(true);
    
        try {
            // Determine the data to export: selected subscription or all subscriptions
            const dataToExport = selectedSubscriptiontInfo ? subscriptions.filter(subscription => subscription.createdAt === selectedSubscriptiontInfo) : subscriptions;
    
            const formattedData = dataToExport.map((eachData) => {
                return {
                    "Email Address": eachData.emailAddress,
                    "Subscription Date": moment(eachData.createdAt).format('YYYY-MM-DD'),
                };
            });
    
            // Convert data to CSV format
            const csvData = await jsonexport(formattedData);
    
            // Initialize file name
            const fileName = selectedSubscriptiontInfo ? 'Subscription.csv' : 'AllSubscriptions.csv';
    
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
    
            setIsDownloadingSubscriptionInfo(false);
    
            // success message
            toast('Download successful');
        } catch (error) {
            console.error('Error exporting CSV:', error);
            setIsDownloadingSubscriptionInfo(false);
            //error message
            toast('Failed to download subscription information.');
        }
    }
    
    useEffect(() => {
        handleFetchSubscription();
    }, []);

    return (
        <main>
            <PageTitle title="Newsletter Subscriptions" className='mb-5' />
            <div className='flex justify-end ml-auto mb-6'>
                <button className={`flex items-center py-2 px-4 rounded-full gap2 ${subscriptions ? "bg-primary" : "bg-mcNiff-light-gray-4"}`} onClick={((e) => { handleDownloadSubscriptionInfo(e) })}>
                    <Icons.Download />
                    <span className='text-white'>Download data</span>
                </button>
            </div>
            {
                subscriptions &&
                <div className="text-white w-full flex flex-col gap-4 !overflow-y-auto rounded-2xl max-h-96 hideScrollBar">
                    <Table
                        tableHeaderStyle="bg-[#272727] text-white"
                        nullDataMessage={generateNullSubscriptionMsg()}
                        tableHeaders={
                            [
                                <div className="flex items-center font-normal text-[15px] space-x-2">
                                    <span>Email Address</span>
                                </div>,
                                <div className="px-4">Date subscribed</div>,
                                <></>,
                                <></>
                            ]
                        }
                        tableRowsData={
                            subscriptions.map((subscription, index) => [
                                <div className="flex items-center space-x-2" key={index}>
                                    <span className="text-mcNiff-gray-3 whitespace-nowrap">{subscription.emailAddress}</span>
                                </div>,
                                <div className="px-4 text-mcNiff-gray-3">{moment(subscription.createdAt).format('do MMM, YYYY')}</div>,
                                <div className="px-4 text-mcNiff-gray-3"></div>,
                            ])
                        }
                        isLoading={isFetchingSubscriptions}
                    />
                </div>
            }
        </main>
    )
}

export default SubscriptionContent