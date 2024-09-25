'use client'
import React, { FormEvent, useState } from 'react'
import Input from '../components/ui/input'
import Label from '../components/ui/label'
import CustomImage from '../components/ui/image'
import images from '@/public/images'
import Button from '../components/ui/button'
import Link from 'next/link'
import { Icons } from '../components/ui/icons'
import { useForgotPassword } from '../api/apiClients'
import { ForgotPasswordRequest } from '../models/ILogin'
import { toast } from 'sonner'
import { catchError } from '../constants/catchError'
import { validateEmail } from '../constants/emailRegex'

type Props = {}

const ForgotPasswordPage = (props: Props) => {
    const forgotPassword = useForgotPassword()
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState<string>('');

    const [formValues, setFormValues] = useState<ForgotPasswordRequest>({
        email: ''
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        // Prevent default form submission
        e.preventDefault();

        if (!formValues?.email) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(formValues?.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Start loader
        setIsLoading(true);

        await forgotPassword(formValues as ForgotPasswordRequest)
            .then((response) => {
                setFormValues({ email: '' });
                toast.success('Please check your email for further instructions');
            })
            .catch((error) => {

                catchError(error)
                toast.error('An error occurred. Please try again.');
            })
            .finally(() => {
                // Close loader
                setIsLoading(false);
            });
    }

    return (
        <main className='flex w-full h-full overflow-hidden gap-16'>
            <div className="relative h-screen flex-1">
                <CustomImage src={images.login_image} alt='login image' className='object-cover' />
                <div className="absolute top-0 left-0 w-full h-full bg-black/80"></div>
            </div>
            <div className="flex-1 flex flex-col p-4 mt-14 overflow-y-auto">
                <div className="relative h-[88px] w-[196px] mb-8">
                    <CustomImage src={images.logo_splash_screen} alt='logo' className='object-cover' />
                </div>
                <form className='flex flex-col gap-6 w-[70%]' onSubmit={(e) => handleSubmit(e)}>
                    <div className='w-full'>
                        <h2 className='text-2xl font-bold text-mcNiff-gray-2'>Forgot Password?</h2>
                        <p className='text-mcNiff-gray-3 text-base'>Please enter your email address and we&apos;ll send you reset instructions.</p>
                    </div>

                    <div className="w-full">
                        <Label htmlFor='email' className='mb-1' text={<>Email Address</>} />
                        <Input
                            type='email'
                            placeholder='Enter email address'
                            className='!rounded-lg py-2 px-4'
                            name="email"
                            id="email"
                            value={formValues?.email}
                            onChange={(e) => {
                                setFormValues({ ...formValues, email: e.target.value } as ForgotPasswordRequest);
                                setError('');
                            }}
                        />

                        {error && <span className='text-error text-sm'>{error}</span>}
                    </div>

                    <Button
                        type='submit'
                        disabled={isLoading}
                        className={`relative overflow-hidden text-sm ${isLoading ? "disabled" : ""}`}>
                        Continue
                    </Button>
                    <Link href="/login" className='flex items-center justify-center gap-2 text-sm mt-1 text-mcNiff-gray-3 hover:opacity-65 transition-all ease-in-out duration-200'><Icons.ArrowLeft /> Back to Log in</Link>
                </form>
            </div>
        </main>
    )
}

export default ForgotPasswordPage