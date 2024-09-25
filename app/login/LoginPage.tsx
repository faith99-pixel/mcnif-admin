'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import CustomImage from '../components/ui/image'
import images from '@/public/images'
import Label from '../components/ui/label'
import Input from '../components/ui/input'
import { Icons } from '../components/ui/icons'
import { LoginRequest } from '../models/ILogin'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { catchError } from '../constants/catchError'
import { ButtonLoader } from '../Loader/ComponentLoader'
import Button from '../components/ui/button'
import Link from 'next/link'

type Props = {}

const LoginPage = (props: Props) => {
    const { data: session, status } = useSession();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [formValues, setFormValues] = useState<LoginRequest>()
    const [formMessage, setFormMessage] = useState<string>()

    const router = useRouter()

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        // Prevent default form submission
        e.preventDefault();

        // Validate user input
        if (!formValues?.email || !formValues.password) {
            setFormMessage('Please fill in all fields');
            return;
        }
        setFormMessage('');

        const email = formValues.email;
        const password = formValues.password;

        const userInformation = {
            email: email,
            password: password
        };
        // return;

        // Start loader
        setIsLoading(true);

        await signIn('credentials', { redirect: false, email: email, password: password })
            .then((response) => {

                if (response?.error) {
                    setFormMessage('Invalid email or password');
                    // Close loader
                    setIsLoading(false);
                }

                if (response && !response.error && session) {
                    router.push('/');
                }
            })
            .catch((error) => {
                catchError(error);
                setFormMessage(
                    "We couldn't sign you in. Please verify your credentials, and ensure you provided the right information."
                );
                // Close loader
                setIsLoading(false);
            })
    };

    useEffect(() => {
        if (formMessage) {
            // Close after 5 seconds
            setTimeout(() => {
                setFormMessage('');
            }, 5000);
        }
    }, [formMessage])

    useEffect(() => {
        if (status == 'authenticated') {
            router.push('/');
        }
    }, [status, session]);

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
                <form className='flex flex-col gap-6 w-[70%]' onSubmit={handleLogin}>
                    <div className='w-full'>
                        <h2 className='text-3xl font-bold text-mcNiff-gray-2'>Log in</h2>
                        <p className='text-mcNiff-gray-3 text-base'>Enter your details to access the admin console</p>
                    </div>

                    <div className="w-full">
                        <Label htmlFor='email' className='mb-1' text={<>Email Address</>} />
                        <Input
                            type='email'
                            placeholder='Enter email address'
                            className='!rounded-lg py-2 px-4'
                            name="email"
                            id="email"
                            onChange={(e) => {
                                setFormValues({ ...formValues, email: e.target.value } as LoginRequest);
                            }}
                        />
                    </div>

                    <div className="w-full h-fit">
                        <Label htmlFor='password' className='mb-1' text={<>Password</>} />
                        {/* flex items-center justify-between bg-white !rounded-lg py-2 px-4 border border-primary */}
                        <div className="flex items-center justify-between bg-white !rounded-lg  border border-primary overflow-hidden">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                placeholder='************'
                                className='!rounded-none !border-none !bg-transparent py-2 pl-4'
                                id="password"
                                onChange={(e) => setFormValues({
                                    ...formValues, password: e.target.value
                                } as LoginRequest
                                )}
                            />
                            <span className='cursor-pointer px-2' onClick={() => setShowPassword(!showPassword)} >
                                {showPassword ? <Icons.EyeOpen /> : <Icons.EyeClosed />}
                            </span>
                        </div>
                        <Link href="/forgot-password" className='flex items-end justify-end text-sm mt-1 text-primary cursor-pointer'>Forgot Password?</Link>
                    </div>

                    {formMessage && <p className='text-mcNiff-red text-sm -mt-5'>{formMessage}</p>}

                    <Button
                        type='submit'
                        disabled={isLoading}
                        className={`relative overflow-hidden text-sm ${isLoading ? "disabled" : ""}`}>
                        Continue
                    </Button>
                </form>
            </div>
        </main>
    )
}

export default LoginPage