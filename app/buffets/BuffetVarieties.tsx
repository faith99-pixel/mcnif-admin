import images from "@/public/images";
import React, { useState } from "react";
import CustomImage from "../components/ui/image";
import { Icons } from "../components/ui/icons";
import { Tabs } from "./BuffetPage";
import { DeleteModalComponent, DeleteSuccessModalComponent } from "../components/modal/ModalComponent";
import { displayPrice } from "../constants/priceDisplay";

type Props = {
    activeTab: Tabs;
};

const BuffetVarieties = ({ activeTab }: Props) => {

    const buffets = [
        {
            image: images.buffet_1,
            buttonDate: "Jun 17",
            Date: "17th June, 2024",
            location: "No. 70, West Midlands, UK.",
            title: "All African Dishes Buffet",
            price: 1350,
            status: true,
        },
        {
            image: images.buffet_2,
            buttonDate: "Jul 20",
            Date: "20th July, 2024",
            location: "No. 70, West Midlands, UK.",
            title: "Taste of Asia Buffet",
            price: 3350,
            status: true,
        },
        {
            image: images.buffet_3,
            buttonDate: "Jun 19",
            Date: "19th June, 2024",
            location: "No. 70, West Midlands, UK.",
            title: "Family Feast Buffet",
            price: 4000,
            status: true,
        },
        {
            image: images.buffet_4,
            buttonDate: "Sept 10",
            Date: "14th August, 2024",
            location: "No. 70, West Midlands, UK.",
            title: "Taste of Asia Buffet",
            price: 1650,
            status: false,
        },
    ];

    const filteredBuffets = buffets.filter((buffet) => {
        if (activeTab === Tabs.All) return true;
        if (activeTab === Tabs.Active) return buffet.status;
        if (activeTab === Tabs.Inactive) return !buffet.status;
    });

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)

    const [isAddBuffetModalVisible, setIsAddBuffetModalVisible] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    async function handleDeleteTestimonial() {
        setIsDeleting(true)
        try {
            setIsDeleteModalVisible(false)
            setIsDeleteSuccessModalVisible(true)
        } catch (error) {
            
        }
    };

    // const _filteredBuffets = () => {
    //   switch (activeTab) {
    //     case Tabs.All:
    //       return buffets;
    //     case Tabs.Active:
    //       return buffets.filter((anyBuffet) => anyBuffet.status);
    //     case Tabs.Inactive:
    //       return buffets.filter((anyBuffet) => !anyBuffet.status);

    //     default:
    //       return buffets;
    //   }
    // }

    return (
        <>
            <DeleteModalComponent
                setVisibility={setIsDeleteModalVisible}
                visibility={isDeleteModalVisible}
                contentType='Buffet'
                isLoading={isDeleting}
                rightActionButton={{ visibility: true, text: 'Delete', function: handleDeleteTestimonial }}
                leftActionButton={{ visibility: true, text: 'Cancel' }}>
            </DeleteModalComponent>

            <DeleteSuccessModalComponent
                setVisibility={setIsDeleteSuccessModalVisible}
                visibility={isDeleteSuccessModalVisible}
                contentType='Buffet' />

            {/* <CreateModalComponent
                setVisibility={setIsAddBuffetModalVisible}
                visibility={isAddBuffetModalVisible}
                isLoading={isCreating}
                contentType='Buffet'
            >
            </CreateModalComponent> */}

            <section className="relative grid grid-col-1 items-center md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                {filteredBuffets.map((buffet, index) => (
                    <div
                        key={index}
                        className="flex flex-col bg-white rounded-t-[20px] rounded-bl-[20px] overflow-hidden mt-3"
                    >
                        <div className="relative w-full h-[200px] overflow-hidden">
                            <CustomImage
                                src={buffet.image}
                                alt="section-image"
                                className="object-cover"
                            />
                            <div className="absolute bg-black/10 w-full h-full"></div>
                            <div className="absolute flex items-center justify-between top-2 left-2 z-10 w-full px-2">
                                <button
                                    className={`${buffet.status ? "bg-[#288806]" : "bg-[#B40707]"
                                        } text-white px-4 py-1 rounded-2xl`}
                                >
                                    {buffet.status ? "Active" : "Inactive"}
                                </button>
                                <div className="flex flex-col items-center justify-center w-8 h-8 bg-white rounded-xl mr-4 p-6">
                                    <h3 className="text-base font-semibold -mb-2">
                                        {buffet.buttonDate.split(" ")[0]}
                                    </h3>
                                    <span className="text-base font-bold">
                                        {buffet.buttonDate.split(" ")[1]}
                                    </span>
                                    {/* 
                <h3 className="text-base font-semibold -mb-2">
                  |{moment(buffet.Date).format('MMM')}
                  
                </h3>
                <span className="text-base font-bold">
                  |{moment(buffet.Date).format('DD m')}
                </span> */}
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <h2 className="mb-2 text-xl text-mcNiff-gray-2 font-[500]">{buffet.title}</h2>

                            <p className="flex gap-2 mb-2">
                                <Icons.Calender />
                                <span className="text-primary text-sm tracking-wider">{buffet.Date}</span>
                            </p>
                            <p className="flex gap-2 mb-8">
                                <Icons.Location />
                                <span className="text-primary text-sm tracking-wider">{buffet.location}</span>
                            </p>
                            <div className="border border-[#F0F2F5] w-full"></div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline mb-5 text-mcNiff-gray-2">
                                    <h3 className="text-xl font-semibold mt-2">{displayPrice(buffet.price)}/</h3>
                                    <span className="text-sm font-normal">pers</span>
                                </div>
                                <button
                                    className="flex gap-1">
                                    <Icons.Delete />
                                    <span className="text-mcNiff-primary-red " onClick={() => setIsDeleteModalVisible(true)}>Delete</span>
                                    <Icons.Delete />
                                    <span className="text-mcNiff-primary-red " onClick={() => setIsAddBuffetModalVisible(true)}>Add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
};

export default BuffetVarieties;
