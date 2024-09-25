'use client'
import { useCreateTestimonial } from '@/app/api/apiClients'
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
import { TestimonialRequest } from '@/app/models/ITestimonial'
import { UserCredentialsSub } from '@/app/models/IUser'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { toast } from 'sonner'

type Props = {}

const CreateTestimonialPage = (props: Props) => {

    const router = useRouter();
    const createTestimonial = useCreateTestimonial()
    const { fetchUserCredentials } = useContext(AdminUserContext) || {};

    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)

    const [formValues, setFormValues] = useState<TestimonialRequest>();
    const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);

    const [userPhoto, setUserPhoto] = useState<string>();
    const [nameErrorMsg, setNameErrorMsg] = useState(false);
    const [textErrorMsg, setTextErrorMsg] = useState(false);
    const [imageUrlErrorMsg, setImageUrlErrorMsg] = useState<string | boolean>(false);

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

            // Unset validation message
            setImageUrlErrorMsg(false);

            const file = e.target.files[0]; // Get the selected file

            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

                    if (base64URL) {
                        // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
                        const base64String = base64URL.split(',')[1];

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
            // Set appropriate validation message
            setImageUrlErrorMsg('Please select a valid photo');

            // Exit this method
            return;
        }

        // Set the image url
        const imgURL = URL.createObjectURL(selectedFile);

        // Update the image url state
        setUserPhoto(imgURL);
    };

    // Function to handle form value change
    function onFormValueChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        stateFunction?: (value: React.SetStateAction<boolean>) => void
    ) {
        const { name, value } = e.target;

        setFormValues({ ...formValues as TestimonialRequest, [name]: value });

        stateFunction && stateFunction(false)
    };

    /**
    * Function to validate form fields
    * @returns boolean depicting form validation status
    */
    function validateFields() {

        if (formValues &&
            formValues.name &&
            formValues.text &&
            formValues.base64ImageUrl
        ) {
            return true;
        } else {

            if (!formValues?.name) {
                setNameErrorMsg(true);
            } else {
                setNameErrorMsg(false);
            }
            if (!formValues?.text) {
                setTextErrorMsg(true);
            } else {
                setTextErrorMsg(false);
            }
            if (!formValues?.base64ImageUrl) {
                setImageUrlErrorMsg(true);
            } else {
                setImageUrlErrorMsg(false);
            }

            return false;
        }
    };

    // Function to create testimonial
    async function handleCreateTestimonial(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        if (!validateFields()) return;

        // Show laoder 
        setIsCreatingTestimonial(true);


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

        await createTestimonial(userCredentials?.accessToken as string, { ...formValues as TestimonialRequest, ratingNumber: Number(formValues?.ratingNumber) })
            .then((response) => {

                // Display success modal
                setIsSuccessModalVisible(true)

                // Call function to fetch testimonials
                // handleFetchTestimonials({ clearPreviousTestimonials: true });

                router.push('/testimonials')
            })
            .catch((error) => {
                // Display error
                toast.error("An error occured. Please try again");

                // Catch error 
                catchError(error);

                setIsSuccessModalVisible(false)
            })
            .finally(() => {
                // Close loader 
                setIsCreatingTestimonial(false);
            })

    }

    return (
        <>
            <SuccessModalComponent
                setVisibility={setIsSuccessModalVisible}
                visibility={isSuccessModalVisible}
                messageTitle='Testimonial Added'
                description='The testimonial has been successfully added.'
            />

            <div className='flex flex-col'>

                <PageTitle
                    title='Add Testimonial'
                    complimentaryButton={
                        <Link href={ApplicationRoutes.Testimonials}
                            className='w-10 h-10 rounded-full grid place-items-center cursor-pointer hover:bg-white'>
                            <Icons.ArrowLeft />
                        </Link>
                    }
                />

                <form className="flex flex-col gap-8 w-[40%]" onSubmit={(e) => handleCreateTestimonial(e)}>
                    <div className='flex flex-col items-center mb-4 relative w-fit h-fit'>
                        <div className=' w-40 h-40 rounded-full bg-mcNiff-light-gray-2 grid place-items-center overflow-hidden mb-3 relative '>
                            <span className='inline-flex'><Icons.Image /></span>
                            {userPhoto && <Image className='w-full h-full object-cover' src={userPhoto} alt='user photo' fill />}
                        </div>
                        <button type='button' className='text-white text-sm font-medium cursor-pointer bg-primary w-10 h-10 grid place-items-center rounded-full absolute bottom-0 right-0 '>
                            <input type="file"
                                onChange={(e) => {
                                    handleFileUpload(e)
                                    setImageUrlErrorMsg(false)
                                }}
                                className='absolute w-full h-full top-0 left-0 cursor-pointer opacity-0' />
                            <Icons.Camera />
                        </button>
                    </div>
                    {imageUrlErrorMsg && <span className='text-mcNiff-red text-sm -mt-11 mb-5'>Please select an image</span>}

                    <div className="flex flex-col gap-1">
                        <Label text={<>Name</>} />
                        <Input
                            type='text'
                            name='name'
                            placeholder='Enter testifier name'
                            value={formValues?.name ?? ''}
                            onChange={(e) => onFormValueChange(e, setNameErrorMsg)}
                            className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        />
                        {nameErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter your name</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label text={<>Review URL</>} />
                        <Input
                            type='text'
                            name='reviewLink'
                            placeholder='Enter review URL'
                            value={formValues?.reviewLink ?? ''}
                            onChange={(e) => onFormValueChange(e, setNameErrorMsg)}
                            className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        />
                        {nameErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter the link to the review</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label text={<>Rating</>} />
                        <Input
                            type='text'
                            name='ratingNumber'
                            placeholder='Enter rating number'
                            value={formValues?.ratingNumber ?? ''}
                            onChange={(e) => {
                                const parsedValue = Number(e.target.value);
                                if (isNaN(parsedValue)) return;
                                if (e.target.value.length > 1) return;
                                if (parsedValue < 0 || parsedValue > 5) return;
                                onFormValueChange(e, setNameErrorMsg)
                            }}
                            className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        />
                        {nameErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter the rating number</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label text={<>Testimonial Details</>} />
                        <TextArea
                            name='text'
                            value={formValues?.text ?? ''}
                            onChange={(e) => onFormValueChange(e, setTextErrorMsg)}
                            placeholder='Enter testimony details'
                            className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        />
                        {textErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter details</span>}
                    </div>
                    <div className="flex items-center ml-auto text-sm gap-5">
                        <Link href={ApplicationRoutes.Testimonials}
                            className='!bg-transparent !text-primary cursor-pointer transition-all ease-in duration-300'>
                            Cancel
                        </Link>
                        <Button type='submit' className='px-10 cursor-pointer relative overflow-hidden disabled:pointer-events-none disabled:opacity-60' disabled={isCreatingTestimonial}>
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateTestimonialPage