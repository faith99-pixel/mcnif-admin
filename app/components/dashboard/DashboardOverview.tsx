'use client'
import { Icons } from '@/app/components/ui/icons'
import Link from 'next/link'
import React from 'react'
import { KpiResponse } from '@/app/models/IKpis'
import { displayPrice } from '@/app/constants/priceDisplay'

type Props = {
    kpis: KpiResponse | undefined
    isFetchingKpis: boolean
}

const DashboardOverview = ({ kpis, isFetchingKpis }: Props) => {

    const totalPaymentsThisWeek = kpis?.totalPaymentsMadeThisWeek ?? 0;
    const totalPaymentsLastWeek = kpis?.totalPaymentsMadeLastWeek ?? 0;

    const revenue = (totalPaymentsThisWeek == 0 ? 0 : (totalPaymentsThisWeek - totalPaymentsLastWeek) / totalPaymentsThisWeek) * 100;
    const revenueColor = revenue > 0 ? 'text-mcNiff-green' : revenue < 0 ? 'text-mcNiff-red' : 'text-neutral';
    const formattedRevenue = revenue > 0 ? `+${revenue.toFixed(1)}` : revenue < 0 ? revenue.toFixed(1) : '0';


    return (
        <>
            <div className='grid grid-cols-3 gap-5'>
                <Link href={'/buffets'} className='w-full flex flex-col bg-white rounded-xl hover:shadow-dashboardCard group transition duration-300'>
                    <div className='w-full flex justify-between py-3 px-6'>
                        <span className={`w-12 h-12 rounded-lg bg-gradient-to-b from-dg-buffet-top to-dg-buffet-bottom grid place-items-center translate-y-[-25px] group-hover:translate-y-[-30px] transition duration-300`}>
                            <Icons.BuffetIcon />
                        </span>
                        <div className='flex flex-col items-end'>
                            <p className='text-primary text-base'>Total Buffets</p>
                            <h3 className='text-3xl font-medium'>{kpis?.totalBuffets && kpis.totalArchived && kpis?.totalBuffets - kpis?.totalArchived}</h3>
                        </div>
                    </div>
                </Link>
                <Link href={'/payments'} className='w-full flex flex-col bg-white rounded-xl hover:shadow-dashboardCard group transition duration-300'>
                    <div className='w-full flex justify-between py-3 px-6 border-b-[1px]'>
                        <span className={`w-12 h-12 rounded-lg bg-gradient-to-b from-dg-payment-top to-dg-payment-bottom grid place-items-center translate-y-[-25px] group-hover:translate-y-[-30px] transition duration-300`}>
                            <Icons.PaymentIcon />
                        </span>
                        <div className='flex flex-col items-end'>
                            <p className='text-primary text-base'>Payments Made</p>
                            <h3 className='text-3xl font-medium'>{displayPrice(kpis?.totalPaymentsMade as number)}</h3>
                        </div>
                    </div>
                    <div className='w-full p-4'>
                        <p className='text-base font-normal text-mcNiff-offWhite-3'>
                            <span className={`font-semibold ${revenueColor}`}>
                                {formattedRevenue}%
                            </span>
                            {/* <span className={` ${positiveMetric ? "text-green-600" : "text-red-500"}`}>{positiveMetric ? `+${kpi.percentage}` : `${kpi.percentage}`}</span> */}
                            &nbsp;than last week
                        </p>
                    </div>
                </Link>
                <Link href={'/enquiries'} className='w-full flex flex-col bg-white rounded-xl hover:shadow-dashboardCard group transition duration-300'>
                    <div className='w-full flex justify-between py-3 px-6'>
                        <span className={`w-12 h-12 rounded-lg bg-gradient-to-b from-dg-enquiry-top to-dg-enquiry-bottom grid place-items-center translate-y-[-25px] group-hover:translate-y-[-30px] transition duration-300`}>
                            <Icons.EnquiryIcon />
                        </span>
                        <div className='flex flex-col items-end'>
                            <p className='text-primary text-base'>Enquiries</p>
                            <h3 className='text-3xl font-medium'>{kpis?.totalEnquiries}</h3>
                        </div>
                    </div>
                </Link>
            </div>

            {!kpis && !isFetchingKpis && (
                <p className='text-mcNiff-gray-3 text-sm text-center'>There are no data available</p>
            )}
        </>

    )
}

export default DashboardOverview