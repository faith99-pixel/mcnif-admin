'use client'
import React, { useState } from 'react'
import Button from '../components/ui/button';
import CustomImage from '../components/ui/image';
import images from '@/public/images';
import Label from '../components/ui/label';
import Input from '../components/ui/input';
import { Icons } from '../components/ui/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPassword } from '../api/apiClients';
import { ForgotPasswordRequest, ResetPasswordRequest } from '../models/ILogin';
import { catchError } from '../constants/catchError';
import { toast } from 'sonner';

type Props = {}

const ResetPasswordPage = (props: Props) => {

    const resetPassword = useResetPassword()

    const searchParams = useSearchParams();

    const router = useRouter()

    const token = searchParams.get('token');
    // Re-encode the token to match the original URL-encoded form
    const encodedToken = token ? encodeURIComponent(token) : '';
    
    const userId = searchParams.get('userId');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const [formValues, setFormValues] = useState<ResetPasswordRequest>({ password: '' } as ResetPasswordRequest);

    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent the default form submission
        e.preventDefault();
        setError(''); // Clear any previous errors

        if (formValues.password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Start loader
        setIsLoading(true)

        const data: ResetPasswordRequest = {
            password: formValues?.password as string,
            token: encodedToken as string,
            userId: userId as string
        }

        await resetPassword(data)
            .then((response) => {
                setFormValues({ password: '' } as ResetPasswordRequest);
                toast.success('Password reset successfully');
                router.push('/login')
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
                        <h2 className='text-2xl font-bold text-mcNiff-gray-2'>Set New Password</h2>
                        <p className='text-mcNiff-gray-3 text-base'>Enter a new password for your account.</p>
                    </div>

                    <div className="w-full h-fit">
                        <Label htmlFor='password' className='mb-1' text={<>New Password</>} />
                        <div className="flex items-center justify-between bg-white !rounded-lg  border border-primary overflow-hidden">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                placeholder='************'
                                className='!rounded-none !border-none !bg-transparent py-2 pl-4'
                                id="password"
                                onChange={(e) => setFormValues({
                                    ...formValues, password: e.target.value
                                } as ResetPasswordRequest
                                )}
                            />
                            <span className='cursor-pointer px-2' onClick={() => setShowPassword(!showPassword)} >
                                {showPassword ? <Icons.EyeOpen /> : <Icons.EyeClosed />}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-fit">
                        <Label htmlFor='confirmPassword' className='mb-1' text={<>Confirm Password</>} />
                        <div className="flex items-center justify-between bg-white !rounded-lg  border border-primary overflow-hidden">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name='confirmPassword'
                                placeholder='************'
                                className='!rounded-none !border-none !bg-transparent py-2 pl-4'
                                id="confirmPassword"

                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    setError('')
                                }}
                            />
                            <span className='cursor-pointer px-2' onClick={() => setShowPassword(!showPassword)} >
                                {showPassword ? <Icons.EyeOpen /> : <Icons.EyeClosed />}
                            </span>
                        </div>
                        {error && <span className='text-error text-sm'>{error}</span>}
                    </div>

                    <Button
                        type='submit'
                        //   disabled={isLoading}
                        className={`relative overflow-hidden text-sm ${isLoading ? "disabled" : ""}`}
                    >
                        Change Password
                    </Button>
                    <p className='text-center text-mcNiff-gray-3 text-sm'>You&apos;ll be redirected to the login screen</p>
                </form>
            </div>
        </main>
    )
}

export default ResetPasswordPage