"use client"
import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import { Icons } from '@/app/components/ui/icons'
import Link from 'next/link'
import React from 'react'
import images from '@/public/images'
import { usePathname, useRouter } from 'next/navigation'
import CustomImage from '@/app/components/ui/image'
import { signOut, useSession } from 'next-auth/react'

type Props = {}

const Sidebar = (props: Props) => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const sidebar = [
        {
            icon: <Icons.DashboardIcon />,
            title: 'Dashboard',
            paths: [ApplicationRoutes.Dashboard],
        },
        {
            icon: <Icons.BuffetIcon />,
            title: 'Buffets',
            paths: [ApplicationRoutes.Buffets, ApplicationRoutes.CreateBuffet, ApplicationRoutes.EditBuffet],
        },
        {
            icon: <Icons.FoodMenuIcon />,
            title: 'Food Menu',
            paths: [ApplicationRoutes.Food,],
        },
        {
            icon: <Icons.PaymentIcon />,
            title: 'Payments',
            paths: [ApplicationRoutes.Payments],
        },
        {
            icon: <Icons.EnquiryIcon />,
            title: 'Enquiries',
            paths: [ApplicationRoutes.Enquiries],
        },
        {
            icon: <Icons.TestimonialsIcon />,
            title: 'Testimonials',
            paths: [ApplicationRoutes.Testimonials, ApplicationRoutes.CreateTestimonials, ApplicationRoutes.EditTestimonials],
        },
        {
            icon: <Icons.BlogIcon />,
            title: 'Blog',
            paths: [ApplicationRoutes.Blog, ApplicationRoutes.CreateBlog, ApplicationRoutes.EditBlog],
        },

    ]

    const pathname = usePathname();

    return (
        <aside className='bg-[#0A0A0A] rounded-xl overflow-hidden w-[20%]'>
            <div className='h-[calc(100vh_-_16px)] min-w-fit py-8 px-6 flex flex-col overflow-y-auto overflow-x-hidden thinScrollbar'>
                <div className='mb-16 mt-3 min-w-24 min-h-12 relative'>
                    <CustomImage src={images.logo} alt='Logo' className='object-contain' />
                </div>
                <ul className='flex flex-col gap-6 mb-32 w-fit'>
                    {
                        sidebar.map((navLink) => {

                            const isActiveLink = pathname == navLink.paths[0] || navLink.paths.includes(pathname);

                            return (
                                <li
                                    key={navLink.title}
                                    className={`flex items-center justify-between text-white opacity-70 hover:opacity-100 ${isActiveLink ? "!opacity-100" : ""}`}>
                                    <Link
                                        href={navLink.paths[0]}
                                        className={`flex items-center gap-4 px-2 ${isActiveLink ? "bg-primary text-white font-normal p-2  pr-4 rounded-xl w-[150px]" : "bg-transparent"} `}>
                                        {navLink.icon}
                                        <span> {navLink.title}</span>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className='mt-auto flex flex-col'>
                    <span className='w-full h-[0.5px] border border-white/20' />
                    <ul className=' flex flex-col gap-4 mt-7'>
                        <li className='flex text-white opacity-70 hover:opacity-100'>
                            <Link href={ApplicationRoutes.Subscribe} className='flex items-center justify-center gap-4'>
                                <Icons.SubscriptionIcon />
                                <span>Subscriptions</span>
                            </Link>
                        </li>
                        <li className='flex text-white opacity-70 hover:opacity-100'>
                            <button className='flex items-center justify-center gap-4'
                                onClick={() => {
                                    signOut({
                                        callbackUrl: window.location.origin,
                                    });
                                    if (status == 'unauthenticated' && !session) {
                                        router.push('/login')
                                    }
                                }}
                            >
                                <Icons.LogoutIcon />
                                Log out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
