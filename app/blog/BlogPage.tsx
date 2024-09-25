'use client'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { Icons } from '../components/ui/icons'
import { DeleteModalComponent, DeleteSuccessModalComponent } from '../components/modal/ModalComponent'
import PageTitle from '../components/reusable/PageTitle'
import BlogCard from '../components/cards/BlogCard'
import { styles } from '../styles/styles'
import { useRouter } from 'next/navigation'
import { useDeleteBlogPost, useFetchBlogPosts } from '../api/apiClients'
import { AdminUserContext } from '../context/AdminUserContext'
import { BlogResponse } from '../models/IBlog'
import { toast } from 'sonner'
import { catchError } from '../constants/catchError'
import { UserCredentialsSub } from '../models/IUser'
import { FullPageLoader } from '../Loader/ComponentLoader'

type Props = {}

const BlogPage = (props: Props) => {

    const router = useRouter()
    const fetchBlogPosts = useFetchBlogPosts()
    const deleteBlogPost = useDeleteBlogPost()
    const { fetchUserCredentials } = useContext(AdminUserContext) || {};

    const [blogPosts, setBlogPosts] = useState<BlogResponse[]>()
    const [selectedBlogPost, setSelectedBlogPost] = useState<BlogResponse>();
    const [isFetchingBlogPosts, setIsFetchingBlogPosts] = useState(false)

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)

    // Function to fetch blog posts
    const handleFetchBlogPosts = async ({ clearPreviousBlogPosts = false }) => {

        if (clearPreviousBlogPosts) {
            // Clear previous configurations
            setBlogPosts(undefined);
            // Show loader
            setIsFetchingBlogPosts(true)
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

        await fetchBlogPosts(userCredentials?.accessToken as string)
            .then((response) => {
                // Set the blog posts
                setBlogPosts(response.data)
            })
            .catch((error) => {
                // Display error
                toast.error('An error occured.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsFetchingBlogPosts(false);
            })
    }

    // Function to delete blog post
    async function handleDeleteBlog() {
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

        await deleteBlogPost(userCredentials?.accessToken as string, selectedBlogPost?.id as string)
            .then((response) => {

                // Fetch blog posts
                handleFetchBlogPosts({ clearPreviousBlogPosts: true });

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
    };

    useEffect(() => {
        handleFetchBlogPosts({ clearPreviousBlogPosts: true })
    }, [])

    return (
        <>
            <DeleteModalComponent
                setVisibility={setIsDeleteModalVisible}
                visibility={isDeleteModalVisible}
                contentType='Blog Post'
                isLoading={isDeleting}
                rightActionButton={{ visibility: true, text: 'Delete', function: handleDeleteBlog }}
                leftActionButton={{ visibility: true, text: 'Cancel' }}
            />

            <DeleteSuccessModalComponent
                setVisibility={setIsDeleteSuccessModalVisible}
                visibility={isDeleteSuccessModalVisible}
                contentType='Blog Post'
            />

            <main className="flex flex-col">
                <PageTitle
                    title='Blog'
                    className='mb-20'
                    additonalContent={
                        <Link
                            href='/blog/create'
                            className={`${styles.linkButton} hover:shadow-md focus:bg-primary/60`}>
                            <Icons.Plus />
                            <p>Add Blog post</p>
                        </Link>
                    }
                />

                <div className="grid grid-cols-3 gap-x-8 gap-y-16">
                    {
                        blogPosts?.map((blog, index) => {
                            return <BlogCard
                                key={index}
                                blog={blog}
                                setIsDeleteModalVisible={setIsDeleteModalVisible}
                                setSelectedBlogPost={setSelectedBlogPost}
                            />
                        })
                    }
                </div>
                {!blogPosts && isFetchingBlogPosts && (
                    <FullPageLoader />
                )}

                {!blogPosts || blogPosts?.length == 0 && !isFetchingBlogPosts && (
                    <p className='text-mcNiff-gray-3 text-sm text-center'>There are no data available</p>
                )}
            </main>
        </>

    )
}

export default BlogPage