"use client";
import React, { useContext, useEffect, useState } from "react";
import { Icons } from "../components/ui/icons";
import PageTitle from "../components/reusable/PageTitle";
import Link from "next/link";
import { ApplicationRoutes } from "../constants/applicationRoutes";
import { styles } from "../styles/styles";
import { DeleteModalComponent, DeleteSuccessModalComponent } from "../components/modal/ModalComponent";
import BuffetCard from "../components/cards/BuffetCard";
import { BuffetResponse } from "../models/IBuffet";
import { useArchiveBuffet, useFetchBuffets } from "../api/apiClients";
import { AdminUserContext } from "../context/AdminUserContext";
import { UserCredentialsSub } from "../models/IUser";
import { toast } from "sonner";
import { catchError } from "../constants/catchError";
import { FullPageLoader } from "../Loader/ComponentLoader";

type Props = {};

export enum Tabs {
    All = "All",
    Active = "Active",
    Inactive = "Inactive",
}

const ToggleOption = ({ isActive, fn, text }: { isActive: boolean, fn: () => void, text: string }) => {
    return (
        <button
            onClick={() => fn()}
            className={`${isActive ? "bg-primary text-white" : "bg-[#E4DDD4] text-[#8E8E8E]"} cursor-pointer rounded-full px-6 py-2 font-semibold text-sm grid place-items-center whitespace-nowrap`}>
            {text}
        </button>
    )
}

const BuffetPage = (props: Props) => {

    const fetchBuffets = useFetchBuffets();
    const archiveBuffet = useArchiveBuffet()

    const { fetchUserCredentials } = useContext(AdminUserContext) || {};

    const [buffets, setBuffets] = useState<BuffetResponse[]>()
    const [selectedBuffet, setSelectedBuffet] = useState<BuffetResponse>();
    const [isFetchingBuffets, setIsFetchingBuffets] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.All);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);

    // Function to fetch buffets
    const handleFetchBuffets = async ({ clearPreviousBuffets = false }) => {

        if (clearPreviousBuffets) {
            // Clear previous configurations
            setBuffets(undefined);
            // Show loader
            setIsFetchingBuffets(true)
        }

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

        await fetchBuffets(userCredentials?.accessToken as string)
            .then((response) => {


                // Set the buffets
                setBuffets(response.data)
            })
            .catch((error) => {
                // Display error
                toast.error('An error occured.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsFetchingBuffets(false);
            })
    };

    const filteredBuffets = buffets?.filter((buffet) => {
        if (activeTab === Tabs.All) return true;
        if (activeTab === Tabs.Active) return buffet.isVisible;
        if (activeTab === Tabs.Inactive) return !buffet.isVisible;
    });

    // Function to archive buffet
    async function handleArchiveBuffet() {

        setIsDeleting(true)

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

        await archiveBuffet(userCredentials?.accessToken as string, selectedBuffet?.id as string)
            .then((response) => {
                // Fetch buffets
                handleFetchBuffets({ clearPreviousBuffets: true });

                // Close modal after deleting...
                setIsDeleteModalVisible(false)

                // Open success modal...
                setIsDeleteSuccessModalVisible(true)
            })
            .catch((error) => {
                // Display error
                toast.error("An error occured. Please try again");
                // Catch error 
                catchError(error);
            })
            .finally(() => {
                // Close loader 
                setIsDeleting(false);
            })
    }

    useEffect(() => {
        handleFetchBuffets({ clearPreviousBuffets: true })
    }, []);

    return (
        <>
            <DeleteModalComponent
                setVisibility={setIsDeleteModalVisible}
                visibility={isDeleteModalVisible}
                contentType='Buffet'
                isLoading={isDeleting}
                rightActionButton={{ visibility: true, text: 'Delete', function: handleArchiveBuffet }}
                leftActionButton={{ visibility: true, text: 'Cancel' }} />

            <DeleteSuccessModalComponent
                setVisibility={setIsDeleteSuccessModalVisible}
                visibility={isDeleteSuccessModalVisible}
                contentType='Buffet' />

            <main className="">
                <PageTitle
                    title='Buffets'
                    additonalContent={
                        <Link
                            href={ApplicationRoutes.CreateBuffet}
                            className={`${styles.linkButton} hover:shadow-md focus:bg-primary/60`}>
                            <Icons.Plus />
                            <p>Add new buffet</p>
                        </Link>
                    }
                />

                {
                    buffets && buffets.length > 0 &&
                    <div className="flex items-center gap-4">
                        <div className="flex gap-3">
                            <Icons.Filter />
                            <h2>Filter by</h2>
                        </div>
                        <div className="flex gap-2">
                            <ToggleOption
                                isActive={activeTab === Tabs.All}
                                fn={() => setActiveTab(Tabs.All)}
                                text="All"
                            />
                            <ToggleOption
                                isActive={activeTab === Tabs.Active}
                                fn={() => setActiveTab(Tabs.Active)}
                                text="Active"
                            />
                            <ToggleOption
                                isActive={activeTab === Tabs.Inactive}
                                fn={() => setActiveTab(Tabs.Inactive)}
                                text="Inactive"
                            />
                        </div>
                    </div>
                }

                <section className="relative grid grid-col-1 items-center md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                    {filteredBuffets?.map((buffet, index) => (
                        <BuffetCard
                            key={index}
                            buffet={buffet}
                            setIsDeleteModalVisible={setIsDeleteModalVisible}
                            setSelectedBuffet={setSelectedBuffet}
                        />
                    ))}
                </section>

                {
                    !buffets && isFetchingBuffets && (
                        <FullPageLoader />
                    )
                }

                {!buffets || buffets?.length == 0 && !isFetchingBuffets && (
                    <p className='text-mcNiff-gray-3 text-sm text-center'>There are no data available</p>
                )}
            </main>
        </>
    );
};

export default BuffetPage;
