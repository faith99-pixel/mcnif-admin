/* eslint-disable react/jsx-key */
import React, { useCallback, useEffect, useState } from "react";
import Table from "../components/ui/table";
import { EnquiryResponse } from "../models/IEnquiry";
import { serializeEnquiryStatus } from "../constants/serializer";
import { EnquiryStatus } from "../enums/EnquiryStatus";
import Button from "../components/ui/button";
import { Icons } from "../components/ui/icons";

type Props = {
    showEnquiryDetails: (enquiry: EnquiryResponse) => void
    enquiries: EnquiryResponse[]
    isFetchingEnquiry: boolean
    setEnquiry: React.Dispatch<React.SetStateAction<EnquiryResponse | undefined>>
    setSelectedEnquiry: React.Dispatch<React.SetStateAction<EnquiryResponse | undefined>>
    selectedEnquiry: EnquiryResponse | undefined
    setFilteredEnquiries: React.Dispatch<React.SetStateAction<EnquiryResponse[]>>
    handleFetchEnquiries: () => Promise<void>
    isFetchingEnquiries: boolean
};

export enum Tabs {
    All = "All",
    Pending = "Pending",
    Resolved = "Resolved",
}

const EnquiryContent = ({ enquiries, showEnquiryDetails, isFetchingEnquiry, setSelectedEnquiry, selectedEnquiry, isFetchingEnquiries, handleFetchEnquiries }: Props) => {

    const [selectedEnquiryStatus, setSelectedEnquiryStatus] = useState<Tabs>(Tabs.All);

    const isFetchingSelectedEnquiryInfo = (enquiry: EnquiryResponse) => isFetchingEnquiry && selectedEnquiry && selectedEnquiry.id === enquiry.id;

    const handleSelectEnquiry = (enquiry: EnquiryResponse) => {
        setSelectedEnquiry(enquiry);
        showEnquiryDetails(enquiry)
    };

    const filteredEnquiries = useCallback((status: Tabs) => {
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

        const noFilteredEnquiry = filteredEnquiries(selectedEnquiryStatus).length == 0;

        if (selectedEnquiryStatus === Tabs.Pending && noFilteredEnquiry) {
            return "No pending contact enquiries found."
        }

        if (selectedEnquiryStatus === Tabs.Resolved && noFilteredEnquiry) {
            return "No resolved contact enquiries found."
        }

        return "No contact enquiries found."
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
                    filteredEnquiries(selectedEnquiryStatus) && (
                        <Table
                            tableHeaderStyle="bg-[#272727] text-white"
                            nullDataMessage={generateNullDataMsg()}
                            tableHeaders={
                                [
                                    <div className="flex items-center font-normal text-[15px] space-x-2">
                                        <span>Name</span>
                                    </div>,
                                    <div className="px-4">Email Address</div>,
                                    <div className="px-4">Message</div>,
                                    <div className="px-4">Status</div>,
                                    <div className="px-4">Action</div>,
                                ]
                            }
                            tableRowsData={
                                filteredEnquiries(selectedEnquiryStatus).map((enquiry) => [
                                    <div className="flex items-center space-x-2" key={enquiry.id}>
                                        <span className="text-mcNiff-gray-3 whitespace-nowrap">{`${enquiry.firstName} ${enquiry.lastName}`}</span>
                                    </div>,
                                    <div className="px-4 text-mcNiff-gray-3">{enquiry.email}</div>,
                                    <div className="px-4 text-mcNiff-gray-3 max-w-52 whitespace-nowrap overflow-hidden text-ellipsis">{enquiry.message}</div>,
                                    <div className={`text-primary ${enquiry.status === EnquiryStatus.Resolved && '!text-mcNiff-primary-green3'}`}>{serializeEnquiryStatus(enquiry.status)}</div>,
                                    <Button
                                        onClick={() => handleSelectEnquiry(enquiry)}
                                        disabled={isFetchingSelectedEnquiryInfo(enquiry)}
                                        className="px-4 py-1 rounded-full bg-mcNiff-primary whitespace-nowrap">
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
    );
};

export default EnquiryContent;
