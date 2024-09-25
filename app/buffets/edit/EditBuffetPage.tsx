"use client"
import { useFetchBuffet, useUpdateBuffet } from '@/app/api/apiClients'
import UpdateBuffetFormValues from '@/app/components/buffet/UpdateBuffetFormValues'
import { SuccessModalComponent } from '@/app/components/modal/ModalComponent'
import PageTitle from '@/app/components/reusable/PageTitle'
import { Icons } from '@/app/components/ui/icons'
import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import { catchError } from '@/app/constants/catchError'
import { AdminUserContext } from '@/app/context/AdminUserContext'
import { BuffetRequest, BuffetResponse } from '@/app/models/IBuffet'
import { UserCredentialsSub } from '@/app/models/IUser'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {}

const EditBuffetPage = (props: Props) => {

    const router = useRouter();
    const { fetchUserCredentials } = useContext(AdminUserContext) || {};
    const searchParams = useSearchParams()

    const updateBuffet = useUpdateBuffet();
    const fetchBuffet = useFetchBuffet();

    const [file, setFile] = useState<string>();
    const [buffet, setBuffet] = useState<BuffetResponse>()
    const [formValues, setFormValues] = useState<BuffetRequest>()

    const [isUpdating, setIsUpdating] = useState(false);
    const [isFetchingBuffet, setIsFetchingBuffet] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)

    /**
* Function to handle image file upload and update form values
* @param e is the event handler
* @returns void
*/
    const handleFileUpload = (e: any) => {

        // Get the selected file
        const selectedFile: File = e.target.files[0];

        // If a valid file was selected...
        if (selectedFile.type === "image/jpg" ||
            selectedFile.type === "image/png" ||
            selectedFile.type === 'image/jpeg' ||
            selectedFile.type === 'image/webp') {

            const file = e.target.files[0]; // Get the selected file

            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

                    if (base64URL) {
                        // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
                        const base64String = base64URL.split(',')[1];

                        // Update form values 
                        setBuffet({ ...buffet as BuffetResponse, imageUrl: URL.createObjectURL(selectedFile) });

                        // Update form values 
                        setFormValues({ ...formValues as BuffetRequest, imageBase64Url: base64String });
                    }
                };

                // Read the file as a data URL (base64-encoded)
                reader.readAsDataURL(file);
            }
        }
        // Otherwise...
        else {

            // Exit this method
            return;
        }

        // Set the image url
        const imgURL = URL.createObjectURL(selectedFile);

        // Update the image url state
        setFile(imgURL);
    };

    async function handleUpdateBuffet(e: FormEvent<HTMLFormElement | HTMLButtonElement>) {

        e.preventDefault();

        // Show loader 
        setIsUpdating(true);


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

        // construct the data
        const data = {
            id: searchParams.get('id') as string,
            accessToken: userCredentials?.accessToken as string,
            data: formValues as BuffetRequest
        }

        // return;
        await updateBuffet(data)
            .then((response) => {
                // Display success
                setIsSuccessModalVisible(true)

                // Route to buffets page
                router.push('/buffets');
            })
            .catch((error) => {
                // Display error
                toast.error(`An error occured. Please try again`);

                // If we have a response error
                catchError(error)

            })
            .finally(() => {
                // Close loader 
                setIsUpdating(false);
            })
    }

    async function handleFetchBuffet() {

        // Show loader 
        setIsFetchingBuffet(true);

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

        await fetchBuffet(userCredentials?.accessToken as string, searchParams.get('id') as string)
            .then((response) => {
                setBuffet(response.data);
            })
            .catch((error) => {

                // Display error
                toast.error(`An error occured. Please try again`);

                // If we have a response error
                catchError(error)
            })
            .finally(() => {

                // Close loader 
                setIsFetchingBuffet(false);
            })
    };

    // Event handler to toggle the isVisible property
    const toggleVisibility = () => {
        const newVisibility = !buffet?.isVisible; // Toggle the current visibility state

        // Update the buffet state with the new visibility
        setBuffet(prevBuffet => prevBuffet ? { ...prevBuffet, isVisible: newVisibility } : undefined);

        // Update the formValues state with the new visibility
        setFormValues(prevFormValues => ({
            ...prevFormValues,
            isVisible: newVisibility
        } as BuffetRequest));
    };


    useEffect(() => {
        if (router) {
            handleFetchBuffet();
        }
    }, [router]);

    return (
        <>
            <SuccessModalComponent
                setVisibility={setIsSuccessModalVisible}
                visibility={isSuccessModalVisible}
                messageTitle='Buffet Updated'
                description='The buffet has been successfully updated.'
            />

            <div>
                <PageTitle
                    title='Edit Buffet'
                    complimentaryButton={
                        <Link href={ApplicationRoutes.Buffets}
                            className='w-10 h-10 rounded-full grid place-items-center cursor-pointer hover:bg-white'>
                            <Icons.ArrowLeft />
                        </Link>
                    }
                    additonalContent={
                        <div className='flex flex-row items-center gap-3'>
                            <p>Set Status:</p>
                            <button
                                onClick={toggleVisibility}
                                className={`flex flex-row items-center justify-between gap-2 ${buffet?.isVisible ? 'bg-green-500' : 'bg-gray-200'} rounded-full p-1 inner-shadow w-28`}>
                                <span className={`${buffet?.isVisible ? "w-0 h-0 opacity-0" : "w-7 h-7 opacity-100"} rounded-full bg-white bg-gradient-to-b from-white to-gray-100 transition-all duration-300`} />
                                <p className={buffet?.isVisible ? 'text-white' : 'text-gray-500'}>{buffet?.isVisible ? "Active" : "Inactive"}</p>
                                <span className={`${!buffet?.isVisible ? "w-0 h-0 opacity-0" : "w-7 h-7 opacity-100"} rounded-full bg-white bg-gradient-to-b from-white to-gray-100 transition-all duration-300`} />
                            </button>
                        </div>
                    }
                />

                <UpdateBuffetFormValues
                    handleUpdateBuffet={handleUpdateBuffet}
                    buffet={buffet}
                    formValues={formValues}
                    handleFileUpload={handleFileUpload}
                    setBuffet={setBuffet}
                    setFormValues={setFormValues}
                    isUpdating={isUpdating}
                />
            </div>
        </>
    )
}

export default EditBuffetPage