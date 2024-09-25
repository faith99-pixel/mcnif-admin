import React, { FormEvent, useRef } from 'react'
import Button from '../ui/button';
import Input from '../ui/input';
import Label from '../ui/label';
import { Icons } from '../ui/icons';
import Image from 'next/image';
import { BuffetRequest, BuffetResponse } from '@/app/models/IBuffet';
import { styles } from '@/app/styles/styles';
import { DatePicker } from '@fluentui/react';
import moment from 'moment';
import TextArea from '../ui/textarea';
import { ApplicationRoutes } from '@/app/constants/applicationRoutes';
import Link from 'next/link';

type Props = {
    handleUpdateBuffet: (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => Promise<void>
    buffet: BuffetResponse | undefined
    handleFileUpload: (e: any) => void
    setBuffet: React.Dispatch<React.SetStateAction<BuffetResponse | undefined>>
    isUpdating: boolean
    setFormValues: React.Dispatch<React.SetStateAction<BuffetRequest | undefined>>
    formValues: BuffetRequest | undefined
}

const UpdateBuffetFormValues = ({ handleUpdateBuffet, buffet, handleFileUpload, setBuffet, isUpdating, setFormValues, formValues }: Props) => {

    const buffetDateRef = useRef<HTMLDivElement>(null);

    return (
        <form className="flex flex-col gap-8 w-[60%] max-w-[60%]">
            <div className='relative h-[200px] bg-mcNiff-light-gray-2 overflow-hidden w-full flex flex-col rounded-lg items-center justify-center gap-3'>
                {buffet?.imageUrl ?
                    <Image src={buffet?.imageUrl} alt="buffet image" fill className='object-cover w-full h-full rounded-lg' /> :
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <Icons.Image />
                        <p className='text-mcNiff-gray-3 text-sm'>Only JPG or PNG are allowed. Max size of 1MB</p>
                    </div>
                }

                {buffet?.imageUrl &&
                    <button type='button' className='text-white text-sm font-medium cursor-pointer bg-primary '>
                        <input type="file" onChange={(e) => handleFileUpload(e)} className='absolute w-full h-full top-0 left-0 cursor-pointer opacity-0' />
                        Update Image
                    </button>
                }
            </div>
            <div className="flex w-full gap-4">
                <div className='w-full'>
                    <Label
                        text={<>Name</>}
                        htmlFor='name'
                        className='mcNiff-primary-dark-4 mb-2'
                    />
                    <Input
                        placeholder='Enter buffet name'
                        type='text'
                        name='name'
                        className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                        value={buffet?.name}
                        onChange={(e) => {
                            setBuffet({ ...buffet as BuffetResponse, name: e.target.value });
                            setFormValues({ ...formValues as BuffetRequest, name: e.target.value });
                        }}
                    />
                </div>
                <div className='w-full'>
                    <Label
                        text={<>Location</>}
                        htmlFor='location'
                        className='mcNiff-primary-dark-4 mb-2'
                    />
                    <Input
                        placeholder='Enter buffet location'
                        type='text'
                        name='location'
                        className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                        value={buffet?.location}
                        onChange={(e) => {
                            setBuffet({ ...buffet as BuffetResponse, location: e.target.value });
                            setFormValues({ ...formValues as BuffetRequest, location: e.target.value });
                        }}
                    />
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <div className="w-full">
                    <Label text={<label>Date</label>} />
                    <div className={`${styles.date} !px-3`} ref={buffetDateRef}>
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
                                target: buffetDateRef
                            }}
                            minDate={new Date()}
                            placeholder="Buffet Date"
                            ariaLabel="Select a date"
                            value={buffet ? moment(buffet.buffetDate).toDate() : undefined}
                            onSelectDate={(date) => {
                                setBuffet({ ...buffet as BuffetResponse, buffetDate: `${moment(date).format('YYYY-MM-DD')}` });
                                setFormValues({ ...formValues as BuffetRequest, buffetDate: `${moment(date).format('YYYY-MM-DD')}` });
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
                <div className="w-full flex flow-row gap-4">
                    <div className="w-full">
                        <Label
                            htmlFor='pricePerAdult'
                            text={<label>Adults&apos; Price</label>}
                            className='mcNiff-primary-dark-4 mb-2'
                        />
                        <Input
                            placeholder='Enter price per adult'
                            name='pricePerAdult'
                            className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                            value={buffet?.pricePerAdult}
                            onChange={(e) => {
                                setBuffet({ ...buffet as BuffetResponse, pricePerAdult: Number(e.target.value) });
                                setFormValues({ ...formValues as BuffetRequest, pricePerAdult: Number(e.target.value) });
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <Label
                            htmlFor='pricePerChild'
                            text={<label>Children&apos;s Price</label>}
                            className='mcNiff-primary-dark-4 mb-2'
                        />
                        <Input
                            placeholder='Enter price per child'
                            name='pricePerChild'
                            className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                            value={buffet?.pricePerChild}
                            onChange={(e) => {
                                setBuffet({ ...buffet as BuffetResponse, pricePerChild: Number(e.target.value) });
                                setFormValues({ ...formValues as BuffetRequest, pricePerChild: Number(e.target.value) });
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* <div>
                        <p className='text-mcNiff-gray-2 mb-4'>Set buffet time</p>
                        <div className='flex items-end gap-3 w-full'>
                            <BuffetSession session='Morning' />
                            <span className='h-10 w-1 bg-primary' />
                            <BuffetSession session='Noon' />
                            <span className='h-10 w-1 bg-primary' />
                            <BuffetSession session='Evening' />
                        </div>
                    </div> */}

            {/* <div>
                        <p className='text-mcNiff-gray-2 mb-4'>Set number of slots</p>
                        <div className='flex items-center gap-3'>
                            <BuffetSlot slotPeriod='Morning' />
                            <BuffetSlot slotPeriod='Noon' />
                            <BuffetSlot slotPeriod='Evening' />
                        </div>
                    </div> */}

            {/* <div>
                <p className='text-mcNiff-gray-2 mb-4'>Buffet Menu</p>
                <div className="flex flex-col items-start gap-3">
                    <div className="flex items-center ml-auto text-sm gap-5 w-full relative">
                        <Input
                          placeholder='Enter food name'
                          className='py-3 px-6 placeholder:text-sm text-base rounded-lg'
                          onClick={() => setIsFoodsDropdownOpen(!isFoodsDropdownOpen)}
                          onChange={(e) => {
                              setFoodSearchKeyword(e.target.value);
                              setFilteredFoods(foods.filter(food => food.toLowerCase().includes(e.target.value.toLowerCase())));
                          }}
                      />
                      <Button className='rounded-full !p-2 !px-4 whitespace-nowrap cursor-pointer '>Add new food</Button>

                        {
                                    isFoodsDropdownOpen &&
                                    <FoodDropdown
                                        setIsFoodsDropdownOpen={setIsFoodsDropdownOpen}
                                        filteredFoods={filteredFoods}
                                        selectedFoods={selectedFoods}
                                        setSelectedFoods={setSelectedFoods}
                                        foodSearchKeyword={foodSearchKeyword}
                                    />
                                }
                    </div>

                    <SelectedFoods
                      selectedFoods={selectedFoods}
                      setSelectedFoods={setSelectedFoods}
                  />
                </div>
            </div> */}

            <div className='flex items-center gap-4'>
                {/* <div className="w-1/2">
                    <Label
                        htmlFor='discountPercentage'
                        text={<>Add Discount</>}
                        className='mcNiff-primary-dark-4 mb-2'
                    />
                    <Input
                        placeholder='Enter discount (eg. 30)'
                        name='discountPercentage'
                        className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                        value={buffet?.discountPercentage}
                        onChange={(e) => {
                            setBuffet({ ...buffet as BuffetResponse, discountPercentage: Number(e.target.value) });
                        }}
                    />
                </div> */}

                <div className="w-1/2">
                    <Label
                        htmlFor='maxGuests'
                        text={<>Add Max Guest</>}
                        className='mcNiff-primary-dark-4 mb-2'
                    />
                    <Input
                        placeholder='Enter max guests'
                        name='maxGuests'
                        className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                        value={buffet?.maxGuests}
                        onChange={(e) => {
                            setBuffet({ ...buffet as BuffetResponse, maxGuests: Number(e.target.value) });
                            setFormValues({ ...formValues as BuffetRequest, maxGuests: Number(e.target.value) });
                        }}
                    />
                </div>

                <div className="w-1/2">
                    <Label
                        htmlFor='contactPhone'
                        text={<>Add Contact Number</>}
                        className='mcNiff-primary-dark-4 mb-2'
                    />
                    <Input
                        placeholder='Enter contact number'
                        name='contactPhone'
                        className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                        value={buffet?.contactPhone}
                        onChange={(e) => {
                            setBuffet({ ...buffet as BuffetResponse, contactPhone: e.target.value });
                            setFormValues({ ...formValues as BuffetRequest, contactPhone: e.target.value });
                        }}
                    />
                </div>
            </div>
            <div className="w-full">
                <Label
                    htmlFor='description'
                    text={<>Description</>}
                    className='mcNiff-primary-dark-4 mb-2'
                />
                <TextArea
                    placeholder='Enter description'
                    name='description'
                    className='py-[10px] px-3 placeholder:text-sm text-base w-full !rounded-[10px]'
                    value={buffet?.description}
                    onChange={(e) => {
                        setBuffet({ ...buffet as BuffetResponse, description: e.target.value });
                    }}
                />
            </div>

            <div className='ml-auto mt-6 flex gap-3'>
                <Link href={ApplicationRoutes.Buffets}
                    className='!py-2 !px-4 bg-transparent !text-primary hover:opacity-70'>
                    Cancel
                </Link>
                <Button
                    disabled={isUpdating}
                    className='!py-2 !px-4 text-sm hover:shadow-md relative overflow-hidden disabled:pointer-events-none disabled:opacity-60'
                    onClick={(e) => handleUpdateBuffet(e)}
                >
                    Update Buffet
                </Button>
            </div>
        </form>
    )
}

export default UpdateBuffetFormValues