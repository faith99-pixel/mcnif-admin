import { styles } from "@/app/styles/styles";
import { Icons } from "@/app/components/ui/icons";
import CustomImage from "@/app/components/ui/image";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FunctionComponent, ReactElement } from "react";
import { BlogResponse } from "@/app/models/IBlog";

interface BlogCardProps {
    setIsDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    blog: BlogResponse
    setSelectedBlogPost: React.Dispatch<React.SetStateAction<BlogResponse | undefined>>
}

const BlogCard: FunctionComponent<BlogCardProps> = ({ setIsDeleteModalVisible, blog, setSelectedBlogPost }): ReactElement => {

    return (
        <div className="flex flex-col">
            <div className="relative h-[186px] mb-4">
                <CustomImage src={blog.imageUrl} fill alt='blog image' className='rounded-xl object-cover' />
                <div className='absolute flex flex-col items-center gap-1 rounded-[8px] bg-white -top-[55px] right-0 m-5 px-4 py-2'>
                    <p className='text-sm text-[#0A0A0A]'>{moment(blog.publishDate).format("MMM")}</p>
                    <p className='font-semibold text-base'>{moment(blog.publishDate).format("DD")}</p>
                </div>
            </div>
            <h2 className='text-mcNiff-gray-2 text-xl font-semibold mb-1'>{blog.title}</h2>
            <p className='flex gap-1 text-primary text-base'><Icons.User /> {blog.author}</p>
            <div className="flex items-center gap-4 justify-end text-black text-sm">
                <Link href={`blog/edit?id=${blog.id}`}
                    className={styles.cardLinkButton}>
                    <Icons.Edit />Edit
                </Link>
                <button
                    className={`${styles.cardLinkButton} text-mcNiff-red`}
                    onClick={() => {
                        setSelectedBlogPost(blog)
                        setIsDeleteModalVisible(true)
                    }}>
                    <Icons.Delete />Delete
                </button>
            </div>
        </div>
    );
}

export default BlogCard;