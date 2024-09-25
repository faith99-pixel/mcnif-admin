import { FormEvent, FunctionComponent, ReactElement, useContext, useState } from "react";
import { Icons } from "../ui/icons";
import CustomImage from "../ui/image";
import { BuffetResponse } from "@/app/models/IBuffet";
import moment from "moment";
import { useArchiveBuffet } from "@/app/api/apiClients";
import { AdminUserContext, AdminUserContextData } from "@/app/context/AdminUserContext";
import { UserCredentialsSub } from "@/app/models/IUser";
import { toast } from "sonner";
import { catchError } from "@/app/constants/catchError";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { displayPrice } from "@/app/constants/priceDisplay";

interface BuffetCardProps {
    buffet: BuffetResponse
    setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedBuffet: React.Dispatch<React.SetStateAction<BuffetResponse | undefined>>
}

const BuffetCard: FunctionComponent<BuffetCardProps> = ({ buffet, setIsDeleteModalVisible, setSelectedBuffet }): ReactElement => {

    const router = useRouter();

    return (
        <div className="flex flex-col bg-white rounded-t-3xl rounded-bl-3xl overflow-hidden" >
            <Link href={`${ApplicationRoutes.EditBuffet}?id=${buffet.id}`} className="relative w-full h-[160px] overflow-hidden cursor-pointer">
                <CustomImage
                    src={buffet.imageUrl}
                    alt="section-image"
                    className="object-cover z-10 relative h-full w-full"
                />
                {/* <div className="absolute w-full h-full bg-black rounded-[20px] overflow-hidden"></div> */}
                <div className="relative flex items-start justify-between top-2 left-2 z-20 w-full p-2">
                    <span className={`${buffet.isVisible ? "bg-mcNiff-green" : "bg-mcNiff-red"} text-white px-4 py-1 rounded-2xl`}>
                        {buffet.isVisible ? "Active" : "Inactive"}
                    </span>
                    <div className="flex flex-col items-center justify-center w-8 h-8 bg-white rounded-xl mr-4 p-6">
                        <h3 className="text-base font-semibold -mb-2 opacity-70">
                            {moment(buffet.buffetDate).format("MMM")}
                        </h3>
                        <span className="text-base font-bold">
                            {moment(buffet.buffetDate).format("DD")}
                        </span>
                    </div>
                </div>
            </Link>
            <div className="p-4">
                <h2 className="mb-2 text-xl text-mcNiff-gray-2 font-[500]">{buffet.name}</h2>
                <p className="flex gap-2 mb-2">
                    <Icons.Calender />
                    <span className="text-primary text-sm tracking-wider">{moment(buffet.buffetDate).format("Do MMMM, YYYY")}</span>
                </p>
                <p className="flex gap-2 mb-8">
                    <Icons.Location />
                    <span className="text-primary text-sm tracking-wider">{buffet.location}</span>
                </p>
            </div>
            <div className="flex items-center justify-between p-4 pt-3 border-t-2 border-mcNiff-light-gray">
                <div className="flex gap-4">
                    <div className="flex flex-col items-baseline text-mcNiff-gray-2">
                        <span className="text-primary text-sm font-medium">Adult</span>
                        <h3 className="text-xl font-semibold">{displayPrice(buffet.pricePerAdult)}</h3>
                    </div>
                    <div className="flex flex-col items-baseline text-mcNiff-gray-2">
                        <span className="text-primary text-sm font-medium">Children</span>
                        <h3 className="text-xl font-semibold">{displayPrice(buffet.pricePerChild)}</h3>
                    </div>
                </div>
                <button
                    className="flex gap-1 text-mcNiff-primary-red leading-5 hover:opacity-60"
                    onClick={() => {
                        setSelectedBuffet(buffet)
                        setIsDeleteModalVisible(true)
                    }}>
                    <Icons.Delete />
                    Delete
                </button>
            </div>
        </div>
    );
}

export default BuffetCard;