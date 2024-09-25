/* eslint-disable react/jsx-key */
"use client"
import React, { Dispatch, SetStateAction } from "react";
import Table from "../components/ui/table";
import { Tabs } from "./paymentPage";
import { styles } from "../styles/styles";
import { Payment } from "../models/IPayment";
import { PaymentStatus } from "../enums/PaymentStatus";
import { serializePaymentMethod, serializePaymentStatus } from "../constants/serializer";
import moment from "moment";
import { PaymentMethod } from "../enums/PaymentMethod";
import { displayPrice } from "../constants/priceDisplay";

type Props = {
    activeTab: Tabs;
    setSelectedPayments: Dispatch<SetStateAction<Payment[]>>
    selectedPayments: Payment[]
    showPaymentConfirmationModal(payment: Payment): void
    payments: Payment[]
    setPayments: React.Dispatch<React.SetStateAction<Payment[]>>
    isFetchingPayments: boolean
    isFetchingPaymentDetails: boolean
    selectedPaymentDetails: Payment | undefined
    handleFetchPaymentDetails: (payment: Payment) => Promise<void>
};

const PaymentTable = ({ activeTab, setSelectedPayments, selectedPayments,
    showPaymentConfirmationModal, payments, isFetchingPayments, handleFetchPaymentDetails, isFetchingPaymentDetails, selectedPaymentDetails }: Props) => {

    const isFetchingSelectedPaymentInfo = (payment: Payment) => isFetchingPaymentDetails && selectedPaymentDetails && selectedPaymentDetails.id === payment.id;

    const filteredPayments = () => {
        if (!payments || payments.length === 0) return [];

        return payments.filter((payment) => {
            switch (activeTab) {
                case Tabs.Pending:
                    return payment.paymentStatus === PaymentStatus.Pending;
                case Tabs.Success:
                    return payment.paymentStatus === PaymentStatus.Verified;
                case Tabs.Unverified:
                    return payment.paymentStatus === PaymentStatus.Unverified;
                case Tabs.All:
                default:
                    return true;
            }
        })
    };

    const handleRowClick = (payment: Payment) => {
        if (selectedPayments.includes(payment)) {
            setSelectedPayments(selectedPayments.filter(selectedPayment => selectedPayment !== payment));
        } else {
            setSelectedPayments([...selectedPayments, payment]);
        }
    };

    const displayDynamicNullMessage = () => {
        switch (activeTab) {
            case Tabs.Pending:
                return "No pending payments available";
            case Tabs.Success:
                return "No successful payments available";
            case Tabs.Unverified:
                return "No unverified payments available";
            case Tabs.All:
            default:
                return "No payments available";
        }
    }

    return (
        <div className="text-white w-full my-8 flex flex-col gap-4 overflow-y-auto rounded-2xl max-h-full hideScrollBar">
            <Table
                tableHeaderStyle="!bg-[#272727] !text-white"
                tableHeaders={[
                    <div className="flex text-[15px] items-center font-normal">
                        {
                            filteredPayments().length > 0 &&
                            <input
                                type="checkbox"
                                className={styles.checkBox(selectedPayments.length === payments.length && selectedPayments.length > 0)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedPayments(payments);
                                        return;
                                    }
                                    setSelectedPayments([]);
                                }}
                            />
                        }
                        <span className="ml-2">Name</span>
                    </div>,
                    <>Phone Number</>,
                    <>Amount</>,
                    <>Date</>,
                    <>Buffet</>,
                    <>Method</>,
                    <>Status</>,
                    <>Action</>,
                ]}
                tableRowsData={
                    filteredPayments().filter(x => x.paymentMethod != PaymentMethod.None).map((payment) => [
                        <div className="flex items-center text-[#666666]" key={payment.id} onClick={() => handleRowClick(payment)}>
                            <input
                                type="checkbox"
                                className={styles.checkBox(selectedPayments.includes(payment) || selectedPayments.length === payments.length)}
                                checked={selectedPayments.includes(payment)}
                                onChange={(e) => {
                                    if (selectedPayments.includes(payment)) {
                                        setSelectedPayments(selectedPayments.filter(selectedPayment => selectedPayment !== payment));
                                    } else {
                                        setSelectedPayments([...selectedPayments, payment]);
                                    }
                                }}
                            />
                            <span className="ml-2">{payment.firstName + " " + payment.lastName}</span>
                        </div>,
                        <span className="ml-2 text-mcNiff-gray-3" key={payment.id} onClick={() => handleRowClick(payment)}>{payment.phoneNumber}</span>,
                        <span className="text-mcNiff-gray-3" key={payment.id} onClick={() => handleRowClick(payment)}>{displayPrice(payment.totalAmountWithDiscount)}</span>,
                        <span className="text-mcNiff-gray-3" key={payment.id} onClick={() => handleRowClick(payment)}>{moment(payment.reservationDate).format("Do MMM YYYY")}</span>,
                        <span className="text-mcNiff-gray-3" key={payment.id} onClick={() => handleRowClick(payment)}>{payment.buffetName}</span>,
                        <span className="text-mcNiff-gray-3" key={payment.id} onClick={() => handleRowClick(payment)}>{serializePaymentMethod(payment.paymentMethod ?? 'not')}</span>,
                        <span onClick={() => handleRowClick(payment)} className={`${payment.paymentStatus === PaymentStatus.Pending && "text-mcNiff-light-primary" || payment.paymentStatus === PaymentStatus.Verified && "!text-mcNiff-primary-green3" || payment.paymentStatus === PaymentStatus.Unverified && "!text-mcNiff-gray-3"}`} key={payment.id}>
                            {serializePaymentStatus(payment.paymentStatus)}
                        </span>,
                        <div className="flex gap-5">
                            <button
                                className={`
                            ${payment.paymentStatus === PaymentStatus.Verified ? "bg-mcNiff-primary-grey2 text-mcNiff-primary-dark-4/60 pointer-events-none opacity-60" : "!bg-mcNiff-primary text-white"}
                            px-2 py-1 rounded-3xl`}
                                onClick={() => showPaymentConfirmationModal(payment)}
                                disabled={payment.paymentStatus === PaymentStatus.Verified}
                                key={payment.id}>
                                Confirm
                            </button>
                            <>
                                <button
                                    onClick={() => handleFetchPaymentDetails(payment)}
                                    disabled={isFetchingSelectedPaymentInfo(payment)}
                                    className="text-mcNiff-primary">
                                    View Details
                                </button></>
                        </div>
                    ])
                }
                rowClickFunction={() => { }}
                isLoading={isFetchingPayments}
                nullDataMessage={displayDynamicNullMessage()}
            />
        </div>
    );
};

export default PaymentTable;
