/* eslint-disable react/jsx-key */
import React, { useContext } from 'react'
import DrawerWrapper from './DrawerWrapper'
import moment from 'moment'
import { Icons } from '../ui/icons'
import { AdminUserContext, AdminUserContextData } from '@/app/context/AdminUserContext'
import { ComponentLoader } from '@/app/Loader/ComponentLoader'
import Button from '../ui/button'
import Table from '../ui/table'
import { useCreateDiscount } from '@/app/api/apiClients'
import { catchError } from '@/app/constants/catchError'
import { UserCredentialsSub } from '@/app/models/IUser'
import { BuffetDiscount } from '@/app/models/IBuffet'
import Input from '../ui/input'

type Props = {
    settingsDrawerVisibility: boolean
    setSettingsDrawerVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsDrawer = ({ setSettingsDrawerVisibility, settingsDrawerVisibility }: Props) => {

    const createDiscount = useCreateDiscount();

    const allowedKeys = [
        'Backspace',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'Delete',
        'Enter',
        '.',
        'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];

    const { buffetDiscounts, isFetchingBuffetDiscounts, fetchUserCredentials, updateBuffetDiscounts } = useContext(AdminUserContext) as AdminUserContextData;

    const [isCreatingDiscount, setIsCreatingDiscount] = React.useState(false);
    const [selectedBuffetDiscount, setSelectedBuffetDiscount] = React.useState<BuffetDiscount | null>(null);
    const [newDiscountValue, setNewDiscountValue] = React.useState<string | null>(null);

    /**
     * Function to get the number of decimal places in a value
     * @param value is the value you want to get the number of decimal places from
     * @returns the number of decimal places in the value
     */
    function getNumberAfterNewDiscountValue(value: string | null) {
        // if the value is null, return 0
        if (!value) return 0;
        // Get the index of the decimal in the value
        const decimalIndex = value.indexOf('.');
        // if the decimal index is -1, return 0. This means there is no decimal in the value
        if (decimalIndex === -1) return 0;
        // return the length of the value minus the decimal index minus 1
        return value.length - decimalIndex - 1;
    };

    const generalBuffetDiscount = buffetDiscounts?.find((discount) => discount.buffetName == "All Buffets");

    /**
     * Function to handle the creation of a discount
     * Note that this function works for updating a buffet discount as well
     */
    const handleCreateDiscount = async ({ forGeneralBuffets }: { forGeneralBuffets?: boolean }) => {

        // Set the loader
        setIsCreatingDiscount(true);

        let userCredentials: UserCredentialsSub | null | undefined;

        // if user credentials does not exist, do nothing
        if (!fetchUserCredentials) return;

        // Fetch user credentials if they exist
        await fetchUserCredentials(true)
            .then((response) => {
                userCredentials = response;
            })
            .catch((error) => {
                catchError(error);
            })

        const discountData: BuffetDiscount = {
            buffetId: forGeneralBuffets ? null : selectedBuffetDiscount?.buffetId as string,
            discountPercentage: Number(newDiscountValue as string)
        }

        // Create the discount
        await createDiscount(userCredentials?.accessToken as string, discountData)
            .then((response) => {
                setSelectedBuffetDiscount(null);
                setNewDiscountValue(null);
                updateBuffetDiscounts && updateBuffetDiscounts(true);
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                // Remove the loader
                setIsCreatingDiscount(false);
            })
    };

    return (
        <DrawerWrapper
            visibility={settingsDrawerVisibility}
            setVisibility={setSettingsDrawerVisibility}
            drawerContainerClass="!w-[40%]"
        >
            {
                buffetDiscounts && !isFetchingBuffetDiscounts &&
                <div className='h-full'>
                    <div className='flex items-center justify-between p-6'>
                        <h3 className='text-mcNiff-gray-2 text-2xl'>Settings</h3>
                        <span
                            className='cursor-pointer w-10 h-10 rounded-full grid place-items-center hover:bg-mcNiff-light-gray'
                            onClick={() => setSettingsDrawerVisibility(false)}>
                            <Icons.Close />
                        </span>
                    </div>
                    <div className='border-[#F0F2F5] border w-[95%] m-auto'></div>
                    <p className='flex items-center justify-start mt-8 p-2 text-[#B1883D] text-xl font-semibold'>
                        Buffet Discounts
                    </p>
                    <div className='overflow-y-auto thinScrollbar scroll h-[calc(100vh-80px)] text-white w-full my-8 flex flex-col px-2 gap-4 overflow-y-auto rounded-2xl max-h-full hideScrollBar'>
                        {
                            buffetDiscounts &&
                            <>
                                <Table
                                    tableHeaderStyle='!bg-[#272727] !text-white'
                                    tableHeaders={[
                                        <div className='flex w-full text-[15px] items-center font-normal w-[140px]'>
                                            <span className='ml-2'>Name</span>
                                        </div>,
                                        // <div className='flex w-full text-[15px] items-center font-normal'>
                                        //     <span className='ml-2'>Adult</span>
                                        // </div>,
                                        // <div className='flex w-full text-[15px] items-center font-normal'>
                                        //     <span className='ml-2'>Children</span>
                                        // </div>,
                                        <div className='flex w-full text-[15px] items-center font-normal'>
                                            <span className='ml-2'>Discount</span>
                                        </div>,
                                        <>
                                        </>,
                                    ]}
                                    tableRowsData={buffetDiscounts.map(buffet => {
                                        if (!buffet.buffetName || buffet.buffetName == "All Buffets") return []
                                        return ([
                                            <div className='flex items-center text-[#666666]' key={buffet.buffetName}>
                                                <span className='ml-2 text-[15px]'>{buffet.buffetName}</span>
                                            </div>,
                                            <>
                                                {
                                                    selectedBuffetDiscount?.buffetId != buffet.buffetId ?
                                                        <span className='text-mcNiff-gray-3'>{buffet.discountPercentage}%</span> :
                                                        <Input
                                                            type='text'
                                                            name='imageUrl'
                                                            value={newDiscountValue ?? buffet.discountPercentage}
                                                            placeholder='New Discount'
                                                            className='py-[10px] !text-black px-2 placeholder:text-sm text-base !w-[70%] !rounded-[10px]'
                                                            onChange={(e) => {
                                                                setNewDiscountValue(e.target.value)
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleCreateDiscount({})
                                                                }
                                                            }}
                                                        />
                                                }
                                            </>,
                                            <div className='flex flex-row items-center gap-2'>
                                                <Button
                                                    disabled={isCreatingDiscount && selectedBuffetDiscount?.buffetId == buffet.buffetId}
                                                    onClick={() => {
                                                        selectedBuffetDiscount && selectedBuffetDiscount.buffetId == buffet.buffetId
                                                            ? handleCreateDiscount({}) :
                                                            setSelectedBuffetDiscount(buffet)
                                                    }}
                                                    className='!px-3 py-[2px] rounded-full bg-transparent !text-primary whitespace-nowrap'>
                                                    {selectedBuffetDiscount?.buffetId == buffet.buffetId ? 'Update' : 'Edit'}
                                                </Button>
                                                {
                                                    selectedBuffetDiscount?.buffetId == buffet.buffetId &&
                                                    <Button
                                                        onClick={() => setSelectedBuffetDiscount(null)}
                                                        className='!px-3 py-[2px] rounded-full bg-transparent !text-primary whitespace-nowrap'>
                                                        Cancel
                                                    </Button>
                                                }
                                            </div>
                                        ])
                                    })}
                                    isLoading={isFetchingBuffetDiscounts}
                                />
                                {
                                    generalBuffetDiscount &&
                                    <>
                                        <div className='text-mcNiff-dark-grey flex flex-row gap-3 text-lg'>
                                            <h1 className='opacity-70'>General discount on every other buffet:</h1>
                                            <span className='font-bold text-primary'>{generalBuffetDiscount.discountPercentage}%</span>
                                            {
                                                selectedBuffetDiscount?.buffetId !== generalBuffetDiscount.buffetId &&
                                                <Button
                                                    onClick={() =>
                                                        setSelectedBuffetDiscount(generalBuffetDiscount)
                                                    }
                                                    className='!px-3 !py-0 rounded-full bg-transparent !text-primary whitespace-nowrap'>
                                                    Edit
                                                </Button>
                                            }
                                        </div>
                                        {
                                            selectedBuffetDiscount && selectedBuffetDiscount?.buffetId == generalBuffetDiscount.buffetId &&
                                            <div>
                                                <Input
                                                    type='text'
                                                    name='imageUrl'
                                                    value={newDiscountValue ?? generalBuffetDiscount.discountPercentage}
                                                    placeholder='New General Discount'
                                                    className='py-[10px] !text-black px-2 placeholder:text-sm text-base !w-[50%] !rounded-[10px]'
                                                    onChange={(e) => {
                                                        setNewDiscountValue(e.target.value)
                                                    }}
                                                    onKeyDown={(e) => {
                                                        // if the key pressed is not a number, or . or backspace, do nothing
                                                        if (!allowedKeys.includes(e.key) || (e.key === '.' && newDiscountValue?.includes('.'))) {
                                                            e.preventDefault();
                                                        }
                                                        // if the key pressed is enter, create the discount
                                                        if (e.key === 'Enter') {
                                                            handleCreateDiscount({ forGeneralBuffets: true })
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    disabled={isCreatingDiscount}
                                                    onClick={() => handleCreateDiscount({ forGeneralBuffets: true })}
                                                    className='!px-3 py-[2px] rounded-full bg-transparent !text-primary whitespace-nowrap'>
                                                    Update
                                                </Button>
                                                <Button
                                                    onClick={() => setSelectedBuffetDiscount(null)}
                                                    className='!px-3 py-[2px] rounded-full bg-transparent !text-primary whitespace-nowrap'>
                                                    Cancel
                                                </Button>
                                            </div>
                                        }
                                    </>
                                }
                            </>
                        }

                    </div>
                </div>
            }
            {
                isFetchingBuffetDiscounts &&
                <div className="fixed z-50 bottom-0 top-0  flex items-center justify-center w-full">
                    <ComponentLoader />
                </div>
            }
        </DrawerWrapper>
    )
}

export default SettingsDrawer