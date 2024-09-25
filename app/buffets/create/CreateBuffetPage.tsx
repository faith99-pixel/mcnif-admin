"use client"
import { SuccessModalComponent } from '@/app/components/modal/ModalComponent'
import PageTitle from '@/app/components/reusable/PageTitle'
import { Icons } from '@/app/components/ui/icons'
import { ApplicationRoutes } from '@/app/constants/applicationRoutes'
import { CompleteBuffetRequest } from '@/app/models/IBuffet'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import BuffetFormValues from '../../components/buffet/BuffetFormValues'

type Props = {}

const CreateBuffetPage = (props: Props) => {

    const [formValues, setFormValues] = useState<CompleteBuffetRequest>();
    const [successModalIsVisible, setSuccessModalIsVisible] = useState(false);

    // Event handler to toggle the isVisible property
    const toggleVisibility = () => {
        setFormValues(prevFormValues => ({
            ...prevFormValues,
            isVisible: !prevFormValues?.isVisible
        } as CompleteBuffetRequest));
    };

    useEffect(() => {
        // update isVisible state
        setFormValues({ ...formValues as CompleteBuffetRequest, isVisible: formValues?.isVisible === undefined ? false : formValues.isVisible });
    }, []);

    return (
        <>
            <SuccessModalComponent
                setVisibility={setSuccessModalIsVisible}
                visibility={successModalIsVisible}
                messageTitle='Buffet Added'
                description='The buffet has been successfully added.'
            />

            <div>
                <PageTitle
                    title='Add Buffet'
                    complimentaryButton={
                        <Link href={ApplicationRoutes.Buffets}
                            className='w-10 h-10 rounded-full grid place-items-center cursor-pointer hover:bg-white'>
                            <Icons.ArrowLeft />
                        </Link>
                    }
                    additonalContent={
                        <div className='flex flex-row items-center gap-3'>
                            <p>Set Status:</p>
                            <button
                                onClick={toggleVisibility}
                                className={`flex flex-row items-center justify-between gap-2 ${formValues?.isVisible ? 'bg-green-500' : 'bg-gray-200'} rounded-full p-1 inner-shadow w-28`}>
                                <span className={`${formValues?.isVisible ? "w-0 h-0 opacity-0" : "w-7 h-7 opacity-100"} rounded-full bg-white bg-gradient-to-b from-white to-gray-100 transition-all duration-300`} />
                                <p className={formValues?.isVisible ? 'text-white' : 'text-gray-500'}>{formValues?.isVisible ? "Active" : "Inactive"}</p>
                                <span className={`${!formValues?.isVisible ? "w-0 h-0 opacity-0" : "w-7 h-7 opacity-100"} rounded-full bg-white bg-gradient-to-b from-white to-gray-100 transition-all duration-300`} />
                            </button>
                        </div>
                    }
                />
                <BuffetFormValues
                    formValues={formValues}
                    setFormValues={setFormValues}
                    setSuccessModalIsVisible={setSuccessModalIsVisible}
                />
            </div>
        </>
    )
}

export default CreateBuffetPage