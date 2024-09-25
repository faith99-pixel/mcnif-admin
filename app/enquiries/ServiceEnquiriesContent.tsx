/* eslint-disable react/jsx-key */
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Table from '../components/ui/table'
import { AdminUserContext } from '../context/AdminUserContext'
import { toast } from 'sonner'
import { catchError } from '../constants/catchError'
import { UserCredentialsSub } from '../models/IUser'
import { EnquiryResponse } from '../models/IEnquiry'
import { serializeEnquiryStatus } from '../constants/serializer';
import { EnquiryStatus } from '../enums/EnquiryStatus'
import Button from '../components/ui/button'
import { Icons } from '../components/ui/icons'

type Props = {
    showEnquiryDetails: (enquiry: EnquiryResponse) => Promise<void>
    enquiries: EnquiryResponse[]
    isFetchingEnquiry: boolean
    selectedEnquiry: EnquiryResponse | undefined
    setSelectedEnquiry: React.Dispatch<React.SetStateAction<EnquiryResponse | undefined>>
    isFetchingEnquiries: boolean
}

export enum Tabs {
    All = "All",
    Pending = "Pending",
    Resolved = "Resolved"
}

const ServiceEnquiriesContentPage = (
    { showEnquiryDetails, enquiries, isFetchingEnquiry,
        selectedEnquiry, setSelectedEnquiry, isFetchingEnquiries
    }: Props) => {

    const [selectedEnquiryStatus, setSelectedEnquiryStatus] = useState<Tabs>(Tabs.All);

    const isFetchingServiceEnquiryInfo = (serviceEnquiry: EnquiryResponse) => isFetchingEnquiry && selectedEnquiry && selectedEnquiry.id === serviceEnquiry.id

    const handleSelectServiceEnquiry = (serviceEnquiry: EnquiryResponse) => {
        setSelectedEnquiry(serviceEnquiry);
        showEnquiryDetails(serviceEnquiry);
    };

    const filteredServicesEnquiries = useCallback((status: Tabs) => {
        switch (status) {
            case Tabs.All:
                return enquiries; 
            case Tabs.Pending:
                return enquiries.filter(enquiry => enquiry.status === EnquiryStatus.Pending);
            case Tabs.Resolved:
                return enquiries.filter(enquiry => enquiry.status === EnquiryStatus.Resolved);
            default:
                return enquiries;
        }
    }, [enquiries]);

    function generateNullDataMsg() {

        const noFilteredEnquiry = filteredServicesEnquiries(selectedEnquiryStatus).length == 0;

        if (selectedEnquiryStatus === Tabs.Pending && noFilteredEnquiry) {
            return "No pending service enquiries found."
        }

        if (selectedEnquiryStatus === Tabs.Resolved && noFilteredEnquiry) {
            return "No resolved service enquiries found."
        }

        return "No service enquiries found."
    };

    return (
        <>
            <div className="flex items-center justify-end mb-5">
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
                                        setSelectedEnquiryStatus(tab);
                                    }}
                                    className={`${selectedEnquiryStatus === tab
                                        ? "bg-primary text-white pointer-events-none"
                                        : "bg-[#E4DDD4] text-[#8E8E8E]"
                                        } cursor-pointer rounded-[30px] px-[20px] py-[5px] font-semibold text-sm whitespace-nowrap`}>
                                    {tab}
                                </span>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="text-white w-full flex flex-col gap-4 overflow-y-auto rounded-2xl max-h-96 hideScrollBar">
                {
                    filteredServicesEnquiries(selectedEnquiryStatus).length > 0 && (
                        <Table
                            tableHeaderStyle="bg-[#272727] text-white"
                            nullDataMessage={generateNullDataMsg()}
                            tableHeaders={[
                                <div className="flex items-center font-normal text-[15px] space-x-2">
                                    <span>Name</span>
                                </div>,
                                <div className="px-4">Email Address</div>,
                                <div className="px-4">Phone number</div>,
                                <div className="px-4">Service</div>,
                                <div className="px-4">Status</div>,
                                <div className="px-4">Action</div>,
                            ]}
                            tableRowsData={
                                filteredServicesEnquiries(selectedEnquiryStatus).map((serviceEnquiry, index) => [
                                    <div className="flex items-center space-x-2" key={index}>
                                        <span className="text-mcNiff-gray-3 whitespace-nowrap">{`${serviceEnquiry.firstName} ${serviceEnquiry.lastName}`}</span>
                                    </div>,
                                    <div className="px-4 text-mcNiff-gray-3">{serviceEnquiry.email}</div>,
                                    <div className="px-4 text-mcNiff-gray-3 max-w-52 whitespace-nowrap overflow-hidden text-ellipsis">{serviceEnquiry.phoneNumber}</div>,
                                    <div className="px-4 text-mcNiff-light-primary">{serviceEnquiry.service}</div>,
                                    <div className={`text-primary ${serviceEnquiry.status === EnquiryStatus.Resolved && '!text-mcNiff-primary-green3'}`}>{serializeEnquiryStatus(serviceEnquiry.status)}</div>,
                                    <Button
                                        onClick={() => handleSelectServiceEnquiry(serviceEnquiry)}
                                        disabled={isFetchingServiceEnquiryInfo(serviceEnquiry)}
                                        className="px-4 py-1 rounded-full bg-mcNiff-primary !whitespace-nowrap">
                                        View Details
                                    </Button>
                                ])
                            }
                            isLoading={isFetchingEnquiries}
                        />
                    )
                }
            </div>
        </>
    )
}

export default ServiceEnquiriesContentPage
