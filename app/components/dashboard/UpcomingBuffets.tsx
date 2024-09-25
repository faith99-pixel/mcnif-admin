'use client'
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { Icons } from "@/app/components/ui/icons";
import Table from "@/app/components/ui/table";
import Link from "next/link";
import { FunctionComponent, ReactElement } from "react";
import moment from "moment";
import { BuffetResponse } from "@/app/models/IBuffet";
import { displayPrice } from "@/app/constants/priceDisplay";

interface UpcomingBuffetsProps {
    buffets: BuffetResponse[] | undefined
    isFetchingBuffets: boolean
}

const UpcomingBuffets: FunctionComponent<UpcomingBuffetsProps> = ({ buffets, isFetchingBuffets }): ReactElement => {
    return (
        <section className="bg-white p-5 px-6 rounded-2xl mt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-medium">Upcoming Buffets</h2>
                <Link href={ApplicationRoutes.Buffets} className="p-2 px-4 bg-primary/10 !text-primary rounded-lg flex flow-row items-center gap-1 hover:bg-primary/30 transition duration-300">
                    See All
                    <Icons.ArrowRight />
                </Link>
            </div>

            <div className="w-full flex flex-col gap-4 overflow-x-auto rounded-lg max-h-80 overflow-y-auto hideScrollBar">
                {
                    buffets &&
                    <Table
                        tableHeaders={[
                            <>Buffet name</>,
                            <>Date</>,
                            // <>Time</>,
                            <>Adult Price</>,
                            <>Children Price</>,
                            <>Location</>
                        ]}
                        tableRowsData={
                            buffets.map((buffet) => [
                                <>{buffet.name}</>, <>{moment(buffet.buffetDate).format('Do MMMM, YYYY')}</>, <>{displayPrice(buffet.pricePerAdult)}</>, <>{displayPrice(buffet.pricePerChild)}</>, <>{buffet.location}</>,
                            ])
                        }
                        isLoading={isFetchingBuffets}
                    />
                }
            </div>
        </section>
    );
}

export default UpcomingBuffets;