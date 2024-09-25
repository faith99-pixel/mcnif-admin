'use client'
import { useFetchTestimonial, useUpdateTestimonial } from '@/app/api/apiClients'
import { SuccessModalComponent } from '@/app/components/modal/ModalComponent'
import PageTitle from '@/app/components/reusable/PageTitle'
import Button from '@/app/components/ui/button'
import { Icons } from '@/app/components/ui/icons'
import Input from '@/app/components/ui/input'
import Label from '@/app/components/ui/label'
import TextArea from '@/app/components/ui/textarea'
import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import { catchError } from '@/app/constants/catchError'
import { AdminUserContext } from '@/app/context/AdminUserContext'
import { TestimonialRequest, TestimonialResponse } from '@/app/models/ITestimonial'
import { UserCredentialsSub } from '@/app/models/IUser'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {}

const EditTestimonialPage = (props: Props) => {

    const router = useRouter();
    const fetchTestimonial = useFetchTestimonial();
    const updateTestimonial = useUpdateTestimonial();
    const { fetchUserCredentials } = useContext(AdminUserContext) || {};
    const searchParams = useSearchParams()

    const [testimonial, setTestimonial] = useState<TestimonialResponse>();
    const [formValues, setFormValues] = useState<TestimonialRequest>();

    const [file, setFile] = useState<string>();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFetchingTestimonial, setIsFetchingTestimonial] = useState(false);

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
                        setTestimonial({ ...testimonial as TestimonialResponse, imageUrl: URL.createObjectURL(selectedFile) });

                        // Update form values 
                        setFormValues({ ...formValues as TestimonialRequest, base64ImageUrl: base64String });
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

    async function handleFetchTestimonial() {

        // Show loader 
        setIsFetchingTestimonial(true);

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

        await fetchTestimonial(userCredentials?.accessToken as string, searchParams.get('id') as string)
            .then((response) => {

                setTestimonial(response.data);
            })
            .catch((error) => {
                // Display error
                toast.error(`An error occured. Please try again`);

                // If we have a response error
                catchError(error)
            })
            .finally(() => {

                // Close loader 
                setIsFetchingTestimonial(false);
            })
    };

    async function handleUpdateTestimonial(e: FormEvent<HTMLFormElement>) {

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

        // userCredentials?.accessToken as string, searchParams.get('id') as string, formValues as TestimonialRequest

        // construct the data
        const data = {
            id: searchParams.get('id') as string,
            accessToken: userCredentials?.accessToken as string,
            data: formValues as TestimonialRequest
        }

        await updateTestimonial(data)
            .then((response) => {

                // Display success
                setIsSuccessModalVisible(true)

                // Route to testimonials page
                router.push('/testimonials');
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

    useEffect(() => {
        if (router) {
            handleFetchTestimonial();
        }
    }, [router]);

    return (
        <>
            <SuccessModalComponent
                setVisibility={setIsSuccessModalVisible}
                visibility={isSuccessModalVisible}
                messageTitle='Testimonial Updated'
                description='The testimonial has been successfully updated.'
            />

            <div className='flex flex-col'>
                <PageTitle
                    title='Edit Testimonial'
                    complimentaryButton={
                        <Link href={ApplicationRoutes.Testimonials}
                            className='w-10 h-10 rounded-full grid place-items-center cursor-pointer hover:bg-white'>
                            <Icons.ArrowLeft />
                        </Link>
                    }
                />
                <form className="flex flex-col gap-8 w-[40%]" onSubmit={(e) => handleUpdateTestimonial(e)}>
                    <div className='flex flex-col items-center mb-4 relative w-fit h-fit'>
                        <div className='w-40 h-40 rounded-full bg-mcNiff-light-gray-2 grid place-items-center overflow-hidden mb-3 relative '>
                            {testimonial?.imageUrl ?
                                <Image className='w-full h-full object-cover' src={testimonial.imageUrl} alt='user photo' fill />
                                :
                                <span className='inline-flex'><Icons.Image /></span>
                            }
                        </div>

                        {testimonial?.imageUrl &&
                            <button type='button' className='text-white text-sm font-medium cursor-pointer bg-primary w-10 h-10 grid place-items-center rounded-full absolute bottom-0 right-0 '>
                                <input type="file" onChange={(e) => handleFileUpload(e)} className='absolute w-full h-full top-0 left-0 cursor-pointer opacity-0' />
                                <Icons.Camera />
                            </button>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label text={<label>Name</label>} />
                        <Input
                            type="text"
                            name='name'
                            value={testimonial?.name}
                            onChange={(e) => {
                                setTestimonial({ ...testimonial as TestimonialResponse, name: e.target.value });
                                setFormValues({ ...formValues as TestimonialRequest, name: e.target.value });
                            }}
                            placeholder='Enter testifier name'
                            className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label text={<label>Review link</label>} />
                        <Input
                            type="text"
                            name='reviewLink'
                            value={testimonial?.reviewLink}
                            onChange={(e) => {
                                setTestimonial({ ...testimonial as TestimonialResponse, reviewLink: e.target.value });
                                setFormValues({ ...formValues as TestimonialRequest, reviewLink: e.target.value });
                            }}
                            placeholder='Enter review link'
                            className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label text={<label>Rating Number</label>} />
                        <Input
                            type="text"
                            name='ratingNumber'
                            value={testimonial?.ratingNumber}
                            onChange={(e) => {
                                const parsedValue = Number(e.target.value);
                                if (isNaN(parsedValue)) return;
                                if (parsedValue < 0 || parsedValue > 5) return;
                                setTestimonial({ ...testimonial as TestimonialResponse, ratingNumber: Number(e.target.value) });
                                setFormValues({ ...formValues as TestimonialRequest, ratingNumber: Number(e.target.value) });
                            }}
                            placeholder='Enter rating number'
                            className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label text={<label>Testimonial Details</label>} />
                        <TextArea
                            name='text'
                            value={testimonial?.text}
                            onChange={(e) => {
                                setTestimonial({ ...testimonial as TestimonialResponse, text: e.target.value });
                                setFormValues({ ...formValues as TestimonialRequest, text: e.target.value });
                            }}
                            placeholder='Enter testimony details'
                            className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        />
                    </div>
                    <div className="flex items-center ml-auto text-sm gap-5">
                        <Link href={ApplicationRoutes.Testimonials}
                            className='!bg-transparent !text-primary cursor-pointer transition-all ease-in duration-300'>
                            Cancel
                        </Link>
                        <Button
                            type='submit'
                            disabled={isUpdating}
                            className='px-10 cursor-pointer disabled:pointer-events-none disabled:opacity-60 relative overflow-hidden'>
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </>

    )
}

export default EditTestimonialPage