'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Icons } from '../components/ui/icons'
import Link from 'next/link'
import CustomImage from '../components/ui/image'
import { DeleteModalComponent, DeleteSuccessModalComponent } from '../components/modal/ModalComponent'
import { useRouter } from 'next/navigation'
import PageTitle from '../components/reusable/PageTitle'
import { styles } from '../styles/styles'
import { ApplicationRoutes } from '../constants/applicationRoutes'
import { TestimonialResponse } from '../models/ITestimonial'
import { UserCredentialsSub } from '../models/IUser'
import { AdminUserContext } from '../context/AdminUserContext'
import { useDeleteTestimonial, useFetchTestimonials } from '../api/apiClients'
import { catchError } from '../constants/catchError'
import { toast } from 'sonner'
import { FullPageLoader } from '../Loader/ComponentLoader'

type Props = {}

const TestimonialPage = (props: Props) => {

    const fetchTestimonials = useFetchTestimonials()
    const deleteTestimonial = useDeleteTestimonial()
    const { fetchUserCredentials } = useContext(AdminUserContext) || {};

    const [testimonials, setTestimonials] = useState<TestimonialResponse[]>()
    const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialResponse>();
    const [isFetchingTestimonials, setIsFetchingTestimonials] = useState(false)

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)

    // Function to fetch testimonials
    const handleFetchTestimonials = async ({ clearPreviousTestimonials = false }) => {

        if (clearPreviousTestimonials) {
            // Clear previous configurations
            setTestimonials(undefined);
            // Show loader
            setIsFetchingTestimonials(true)
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

        await fetchTestimonials(userCredentials?.accessToken as string)
            .then((response) => {
                // Set the testimonials
                setTestimonials(response.data)
            })
            .catch((error) => {
                // Display error
                toast.error('An error occured.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsFetchingTestimonials(false);
            })
    }

    // Function to delete testimonial
    async function handleDeleteTestimonial() {
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

        await deleteTestimonial(userCredentials?.accessToken as string, selectedTestimonial?.id as string)
            .then((response) => {

                // Fetch testimonial
                handleFetchTestimonials({ clearPreviousTestimonials: true });

                // Close modal after deleting...
                setIsDeleteModalVisible(false)

                // Open success modal...
                setIsDeleteSuccessModalVisible(true)
            })
            .catch((error) => {
                // Display error
                toast.error('An error occured.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsDeleting(false);
            })
    }

    useEffect(() => {
        // Call function to fetch testimonials
        handleFetchTestimonials({ clearPreviousTestimonials: true });
    }, [])

    return (
        <>
            <DeleteModalComponent
                setVisibility={setIsDeleteModalVisible}
                visibility={isDeleteModalVisible}
                contentType='Testimonial'
                isLoading={isDeleting}
                rightActionButton={{ visibility: true, text: 'Delete', function: handleDeleteTestimonial }}
                leftActionButton={{ visibility: true, text: 'Cancel' }}
            />

            <DeleteSuccessModalComponent
                setVisibility={setIsDeleteSuccessModalVisible}
                visibility={isDeleteSuccessModalVisible}
                contentType='Testimonial'
            />

            <main className="flex flex-col">
                <PageTitle
                    title='Testimonials'
                    className='mb-20'
                    additonalContent={
                        <Link
                            href={ApplicationRoutes.CreateTestimonials}
                            className={`${styles.linkButton} hover:shadow-md focus:bg-primary/60`}>
                            <Icons.Plus />
                            <p>Add a Testimonial</p>
                        </Link>
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-16">
                    {testimonials?.map((testimonial) => (
                        <div className="bg-mcNiff-gray-4 rounded-[20px] p-5" key={testimonial.id}>
                            <div className="relative h-[90px] w-[90px] -translate-y-14">
                                <CustomImage src={testimonial.imageUrl} alt='user image' className='object-cover rounded-full' />
                            </div>
                            <h2 className='-mt-7 mb-1 text-mcNiff-dark text-xl'>{testimonial.name}</h2>
                            <p className='text-mcNiff-gray-3 text-sm leading-6 pb-7 mb-3 border border-b-white'>{testimonial.text}</p>
                            <div className="flex items-center gap-4 justify-end text-black text-sm">
                                <Link href={`testimonials/edit?id=${testimonial.id}`}
                                    className={styles.cardLinkButton}>
                                    <Icons.Edit />Edit
                                </Link>
                                <button
                                    className={`${styles.cardLinkButton} text-mcNiff-red`}
                                    onClick={() => {
                                        setSelectedTestimonial(testimonial)
                                        setIsDeleteModalVisible(true)
                                    }}>
                                    <Icons.Delete />Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!testimonials && isFetchingTestimonials && (
                    <FullPageLoader />
                )}

                {!testimonials || testimonials?.length == 0 && !isFetchingTestimonials && (
                    <p className='text-mcNiff-gray-3 text-sm text-center'>There are no data available</p>
                )}
            </main>
        </>

    )
}

export default TestimonialPage