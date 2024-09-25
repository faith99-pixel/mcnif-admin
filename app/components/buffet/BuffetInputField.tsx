import React from 'react'
import Label from '../ui/label'
import Input from '../ui/input'
import { onFormValueChange } from '@/app/constants/formRegulator'
import { CompleteBuffetRequest } from '@/app/models/IBuffet'
import TextArea from '../ui/textarea'

type Props = {
    value: string | number | undefined
    formHasError: boolean
    setErrorMsg: () => void
    formValues: CompleteBuffetRequest | undefined
    setFormValues: React.Dispatch<React.SetStateAction<CompleteBuffetRequest | undefined>>
    label: JSX.Element
    name: keyof CompleteBuffetRequest
    errorMsgText: string
    textarea?: boolean
    placeholder: string
}

const BuffetInputField = (props: Props) => {
    return (
        <div className='w-full'>
            <Label
                text={props.label}
                htmlFor={props.name}
                className='mcNiff-primary-dark-4 mb-2'
            />
            {
                props.textarea ?
                    <TextArea
                        placeholder={props.placeholder}
                        name={props.name}
                        value={props.value ?? ''}
                        className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                        onChange={(e) => onFormValueChange<CompleteBuffetRequest>({
                            e: e,
                            setFormValues: props.setFormValues,
                            formValues: props.formValues,
                            clearErrorMessages: props.setErrorMsg
                        })}
                    />
                    :
                    <Input
                        placeholder={props.placeholder}
                        type='text'
                        name={props.name}
                        value={props.value ?? ''}
                        className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                        onChange={(e) => onFormValueChange<CompleteBuffetRequest>({
                            e: e,
                            setFormValues: props.setFormValues,
                            formValues: props.formValues,
                            clearErrorMessages: props.setErrorMsg
                        })}
                    />
            }
            {props.formHasError && <span className='text-error text-sm'>{props.errorMsgText}</span>}
        </div>
    )
}

export default BuffetInputField