'use client'
import { useCreateBlogPost, useFetchBlogPosts } from '@/app/api/apiClients'
import { SuccessModalComponent } from '@/app/components/modal/ModalComponent'
import PageTitle from '@/app/components/reusable/PageTitle'
import Button from '@/app/components/ui/button'
import { Icons } from '@/app/components/ui/icons'
import Input from '@/app/components/ui/input'
import Label from '@/app/components/ui/label'
import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import { catchError } from '@/app/constants/catchError'
import { AdminUserContext } from '@/app/context/AdminUserContext'
import { BlogRequest, BlogResponse } from '@/app/models/IBlog'
import { UserCredentialsSub } from '@/app/models/IUser'
import { styles } from '@/app/styles/styles'
import { DatePicker } from '@fluentui/react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useContext, useRef, useState } from 'react'
import { toast } from 'sonner'

type Props = {}

const CreateBlogPage = (props: Props) => {

    const router = useRouter()
    const createBlogPost = useCreateBlogPost()
    const { fetchUserCredentials } = useContext(AdminUserContext) || {};

    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)

    const [formValues, setFormValues] = useState<BlogRequest>();
    const [isCreatingBlogPost, setIsCreatingBlogPost] = useState(false);

    const [titleErrorMsg, setTitleErrorMsg] = useState(false);
    const [urlErrorMsg, setUrlErrorMsg] = useState(false);
    const [imageUrlErrorMsg, setImageUrlErrorMsg] = useState(false);
    const [authorErrorMsg, setAuthorErrorMsg] = useState(false);
    const [datePublishErrorMsg, setDatePublishErrorMsg] = useState(false);

    const publishDateRef = useRef<HTMLDivElement>(null);

    // Function to handle form value change
    function onFormValueChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        stateFunction?: (value: React.SetStateAction<boolean>) => void
    ) {
        const { name, value } = e.target;

        setFormValues({ ...formValues as BlogRequest, [name]: value });

        stateFunction && stateFunction(false)
    };

    /**
     * Function to validate form fields
     * @returns boolean depicting form validation status
     */
    function validateFields() {

        if (formValues &&
            formValues.title &&
            formValues.url &&
            formValues.imageUrl &&
            formValues.author &&
            formValues.publishDate
        ) {
            return true;
        } else {

            if (!formValues?.title) {
                setTitleErrorMsg(true);
            } else {
                setTitleErrorMsg(false);
            }
            if (!formValues?.url) {
                setUrlErrorMsg(true);
            } else {
                setUrlErrorMsg(false);
            }
            if (!formValues?.imageUrl) {
                setImageUrlErrorMsg(true);
            } else {
                setImageUrlErrorMsg(false);
            }
            if (!formValues?.author) {
                setAuthorErrorMsg(true);
            } else {
                setAuthorErrorMsg(false);
            }
            if (!formValues?.publishDate) {
                setDatePublishErrorMsg(true);
            } else {
                setDatePublishErrorMsg(false);
            }

            return false;
        }
    };

    // Function to create blog post
    async function handleCreateBlogPost(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateFields()) return;

        // Show laoder 
        setIsCreatingBlogPost(true);

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

        await createBlogPost(userCredentials?.accessToken as string, formValues as BlogRequest)
            .then((response) => {

                // Display success modal
                setIsSuccessModalVisible(true)

                router.push('/blog')
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
                setIsCreatingBlogPost(false);
            })
    }

    return (
        <>

            <SuccessModalComponent
                setVisibility={setIsSuccessModalVisible}
                visibility={isSuccessModalVisible}
                messageTitle='Blog post Added'
                description='The blog post has been successfully added.'
            />
            <div className='flex flex-col'>
                <PageTitle
                    title='Add Blog Post'
                    complimentaryButton={
                        <Link href={ApplicationRoutes.Blog}
                            className='w-10 h-10 rounded-full grid place-items-center cursor-pointer hover:bg-white'>
                            <Icons.ArrowLeft />
                        </Link>
                    }
                />
                <form className="flex flex-col gap-8 max-w-[380px]" onSubmit={(e) => handleCreateBlogPost(e)}>
                    <div className='bg-mcNiff-light-gray-2 rounded-[10px] flex items-center flex-col justify-center min-h-[200px] gap-3 relative '>
                        {formValues?.imageUrl ?
                            <Image src={formValues?.imageUrl as string} alt="Blog image url" fill className='object-cover object-center absolute rounded-[10px]' /> :
                            <div className='flex flex-col items-center justify-center'>
                                <Icons.Image />
                                <p className='text-mcNiff-gray-3 text-sm'>Image preview show here</p>
                            </div>
                        }
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label text={<label>Image URL</label>} />
                        <Input
                            type='text'
                            name='imageUrl'
                            value={formValues?.imageUrl ?? ''}
                            placeholder='Paste image URL here'
                            className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e, setImageUrlErrorMsg)}
                        />
                        {imageUrlErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter image url</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label text={<label>Blog Title</label>} />
                        <Input
                            type='text'
                            name='title'
                            value={formValues?.title ?? ''}
                            placeholder='Enter the blog title'
                            className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e, setTitleErrorMsg)}
                        />
                        {titleErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter blog title</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label text={<label>Blog URL</label>} />
                        <Input
                            type='text'
                            name='url'
                            value={formValues?.url ?? ''}
                            placeholder='Paste Blog URL here'
                            className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e, setUrlErrorMsg)}
                        />
                        {urlErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter blog url</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label text={<label>Date</label>} />
                        <div className={styles.date} ref={publishDateRef}>
                            <DatePicker
                                calendarProps={{
                                    navigationIcons: {
                                        leftNavigation: "ChevronLeft",
                                        rightNavigation: "ChevronRight",
                                    }
                                }}
                                textField={{
                                    style: {
                                        background: '#efeeee',
                                        color: '#000'
                                    },
                                    borderless: true,
                                }}
                                calloutProps={{
                                    gapSpace: 8,
                                    target: publishDateRef
                                }}
                                placeholder="Date"
                                ariaLabel="Select a date"
                                onSelectDate={(date) => {

                                    // Set the form value
                                    setFormValues({ ...formValues as BlogRequest, publishDate: `${moment(date).format('YYYY-MM-DD')}` });
                                    // Unset error message 
                                    setDatePublishErrorMsg(false)
                                }}
                                onKeyDown={(e) => {

                                    // If forward was tab was pressed...
                                    if (e.key === 'Tab') {
                                        // If shit key was enabled...
                                        if (e.shiftKey)
                                            // Exit to aviod backward tab
                                            return;
                                    }
                                }}
                                underlined={false}
                                showGoToToday={false}
                                isMonthPickerVisible={false}
                            />
                        </div>
                        {datePublishErrorMsg && <span className='text-mcNiff-red text-sm'>Please select publish date</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label text={<label>Blog Author</label>} />
                        <Input
                            type='text'
                            name='author'
                            value={formValues?.author ?? ''}
                            placeholder='Enter author&apos;s name'
                            className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e, setAuthorErrorMsg)}
                        />
                        {authorErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter author name</span>}
                    </div>

                    <div className="flex items-center ml-auto text-sm gap-5">
                        <Link href={ApplicationRoutes.Blog}
                            className='!bg-transparent !text-primary cursor-pointer transition-all ease-in duration-300'>
                            Cancel
                        </Link>
                        <Button
                            type='submit'
                            disabled={isCreatingBlogPost}
                            className='px-10 cursor-pointer disabled:pointer-events-none disabled:opacity-60 relative overflow-hidden'>
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </>

    )
}

export default CreateBlogPage