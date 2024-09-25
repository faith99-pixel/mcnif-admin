'use client'
import { useFetchBlogPost, useUpdateBlogPost } from '@/app/api/apiClients'
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
import { useRouter, useSearchParams } from 'next/navigation'
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Props = {}

const EditBlogPage = (props: Props) => {

    const router = useRouter();
    const fetchBlogPost = useFetchBlogPost();
    const updateBlogPost = useUpdateBlogPost();
    const { fetchUserCredentials } = useContext(AdminUserContext) || {};
    const searchParams = useSearchParams()

    const [blogPost, setBlogPost] = useState<BlogResponse>();
    const [formValues, setFormValues] = useState<BlogRequest>();


    const [isUpdating, setIsUpdating] = useState(false);
    const [isFetchingBlogPost, setIsFetchingBlogPost] = useState(false);

    const publishDateRef = useRef<HTMLDivElement>(null);

    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)

    async function handleFetchBlogPost() {

        // Show loader 
        setIsFetchingBlogPost(true);

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

        await fetchBlogPost(userCredentials?.accessToken as string, searchParams.get('id') as string)
            .then((response) => {

                setBlogPost(response.data);
            })
            .catch((error) => {
                // Display error
                toast.error(`An error occured. Please try again`);

                // If we have a response error
                catchError(error)
            })
            .finally(() => {

                // Close loader 
                setIsFetchingBlogPost(false);
            })
    };

    async function handleUpdateBlogPost(e: FormEvent<HTMLFormElement>) {

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
            data: formValues as BlogRequest
        }

        await updateBlogPost(data)
            .then((response) => {

                // Display success
                setIsSuccessModalVisible(true)

                //BloupdateBlogPosts page
                router.push('/blog');
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
            handleFetchBlogPost();
        }
    }, [router]);

    return (
        <div className='flex flex-col'>
            <PageTitle
                title='Edit Blog Post'
                complimentaryButton={
                    <Link href={ApplicationRoutes.Blog}
                        className='w-10 h-10 rounded-full grid place-items-center cursor-pointer hover:bg-white'>
                        <Icons.ArrowLeft />
                    </Link>
                }
            />
            <form className="flex flex-col gap-8 max-w-[380px]" onSubmit={(e) => handleUpdateBlogPost(e)}>
                <div className='bg-mcNiff-light-gray-2 rounded-[10px] flex items-center flex-col justify-center min-h-[200px] gap-3 relative '>
                    {blogPost?.imageUrl && blogPost?.imageUrl.startsWith('https' || 'www' || 'http') ?
                        <Image src={blogPost.imageUrl} alt="Blog image url" fill className='object-cover object-center absolute rounded-[10px]' /> :
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
                        value={blogPost?.imageUrl}
                        placeholder='Paste image URL here'
                        className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        onChange={(e) => {
                            setBlogPost({ ...blogPost as BlogResponse, imageUrl: e.target.value });
                            setFormValues({ ...formValues as BlogRequest, imageUrl: e.target.value });
                        }}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label text={<label>Blog Title</label>} />
                    <Input
                        type='text'
                        name='title'
                        value={blogPost?.title}
                        placeholder='Enter the blog title'
                        className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        onChange={(e) => {
                            setBlogPost({ ...blogPost as BlogResponse, title: e.target.value });
                            setFormValues({ ...formValues as BlogRequest, title: e.target.value });
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label text={<label>Blog URL</label>} />
                    <Input
                        type='text'
                        name='url'
                        value={blogPost?.url}
                        placeholder='Paste Blog URL here'
                        className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        onChange={(e) => {
                            setBlogPost({ ...blogPost as BlogResponse, url: e.target.value });
                            setFormValues({ ...formValues as BlogRequest, url: e.target.value });
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label text={<label>Date</label>} />
                    <div className={styles.date} ref={publishDateRef}>
                        <DatePicker
                            textField={{
                                style: {
                                    background: 'transparent',
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
                            value={blogPost ? moment(blogPost.publishDate).toDate() : undefined}
                            onSelectDate={(date) => {
                                // Set the state with the selected date as string in ISO format (YYYY-MM-DD)
                                setBlogPost({ ...blogPost as BlogResponse, publishDate: `${moment(date).format('YYYY-MM-DD')}` });
                                // Set the form value
                                setFormValues({ ...formValues as BlogRequest, publishDate: `${moment(date).format('YYYY-MM-DD')}` });
                            }}
                            onKeyDown={(e) => {

                                // If backward tab was pressed...
                                if (e.shiftKey && e.key === 'Tab') {
                                    return;
                                }

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
                </div>
                <div className="flex flex-col gap-1">
                    <Label text={<label>Blog Author</label>} />
                    <Input
                        type='text'
                        name='author'
                        value={blogPost?.author}
                        placeholder='Enter author&apos;s name'
                        className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        onChange={(e) => {
                            setBlogPost({ ...blogPost as BlogResponse, author: e.target.value });
                            setFormValues({ ...formValues as BlogRequest, author: e.target.value });
                        }}
                    />
                </div>

                <div className="flex items-center ml-auto text-sm gap-5">
                    <Link href={ApplicationRoutes.Blog}
                        className='!bg-transparent !text-primary cursor-pointer transition-all ease-in duration-300'>
                        Cancel
                    </Link>
                    <Button
                        type='submit'
                        disabled={isUpdating}
                        className='px-10 cursor-pointer relative overflow-hidden disabled:pointer-events-none disabled:opacity-60'>
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default EditBlogPage