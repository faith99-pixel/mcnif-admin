import BuffetSession from '@/app/components/buffet/BuffetSession';
import FoodDropdown from '@/app/components/buffet/FoodDropdown';
import SelectedFoods from '@/app/components/buffet/SelectedFoods';
import Button from '@/app/components/ui/button';
import Input from '@/app/components/ui/input';
import Label from '@/app/components/ui/label';
import { BuffetDiscount, BuffetRequest, BuffetSessionRequest, BuffetSessionResponse, CompleteBuffetRequest } from '@/app/models/IBuffet';
import { styles } from '@/app/styles/styles';
import { DatePicker } from '@fluentui/react';
import moment from 'moment';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import { ApplicationRoutes } from '@/app/constants/applicationRoutes';
import { AdminUserContext, AdminUserContextData } from '@/app/context/AdminUserContext';
import { useAddFoodToBuffet, useCreateBuffet, useCreateBuffetSession, useCreateDiscount } from '@/app/api/apiClients';
import { catchError } from '@/app/constants/catchError';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import BuffetImageUpload from './BuffetImageUpload';
import { FoodResponse } from '@/app/models/IFood';
import { FoodContext, FoodContextData } from '@/app/context/FoodContext';
import { AxiosResponse } from 'axios';
import { numberRegex } from '@/app/constants/PhoneNumberRegex';
import TextArea from '../ui/textarea';
import CreateFood from '@/app/foods/CreateFoodModal';

type Props = {
    formValues: CompleteBuffetRequest | undefined
    setFormValues: React.Dispatch<React.SetStateAction<CompleteBuffetRequest | undefined>>
    setSuccessModalIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const BuffetFormValues = ({ formValues, setFormValues, setSuccessModalIsVisible }: Props) => {
    //#region hooks
    const createBuffet = useCreateBuffet();
    const createBuffetSession = useCreateBuffetSession();
    const createDiscount = useCreateDiscount();
    const addFoodToBuffet = useAddFoodToBuffet()
    const buffetRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { fetchUserCredentials } = useContext(AdminUserContext) as AdminUserContextData;
    const { foods, handleFetchFoods } = useContext(FoodContext) as FoodContextData;

    //#endregion

    //#region state variables
    const [isFoodsDropdownOpen, setIsFoodsDropdownOpen] = useState(false);
    const [foodSearchKeyword, setFoodSearchKeyword] = useState('');
    const [filteredFoods, setFilteredFoods] = useState<FoodResponse[] | undefined>(foods);
    const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
    const [isCreatingBuffet, setIsCreatingBuffet] = useState(false);
    const [photo, setPhoto] = useState<string>();
    const [sessionErrorMessages, setSessionErrorMessages] = useState<{
        [key: number]: {
            startTime?: string;
            endTime?: string;
            slots?: string;
        };
    }>({});
    const [dateErrorMsg, setDateErrorMsg] = useState<string | boolean>(false);
    const [imageUrlErrorMsg, setImageUrlErrorMsg] = useState<string | boolean>(false);
    const [nameErrorMsg, setNameErrorMsg] = useState(false);
    const [locationErrorMsg, setLocationErrorMsg] = useState(false);
    const [adultPriceErrorMsg, setAdultPriceErrorMsg] = useState(false);
    const [childPriceErrorMsg, setChildPriceErrorMsg] = useState(false);
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState(false);
    const [phoneErrorMsg, setPhoneErrorMsg] = useState(false);
    const [menuErrorMsg, setMenuErrorMsg] = useState<string | boolean>(false);
    // const [maxGuestErrorMsg, setMaxGuestErrorMsg] = useState(false);

    const [buffetSessions, setBuffetSessions] = useState<BuffetSessionRequest[]>([
        { startTime: '', endTime: '', slots: 0 }
    ]);

    const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);

    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    //#endregion

    //#region functions

    // Function to handle form value change
    function onFormValueChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        stateFunction?: (value: React.SetStateAction<boolean>) => void
    ) {
        const { name, value } = e.target;

        if ((name === 'pricePerAdult' || name === 'pricePerChild' || name === 'discountPercentage' || name === 'maxGuests' || name === 'contactPhone') && !numberRegex(value)) {
            return;
        }

        setFormValues({ ...formValues as CompleteBuffetRequest, [name]: value });

        stateFunction && stateFunction(false)
    };


    const handleFoodInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        stateFunction?: (value: React.SetStateAction<boolean | string>) => void
    ) => {
        setFoodSearchKeyword(e.target.value);
        if (!foods) {
            return;
        }
        setFilteredFoods(
            foods.filter(food =>
                food.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );

        selectedFoodIds.length > 0 && stateFunction && stateFunction(false);
    };

    // The function determines if two time intervals overlap. It first converts the given time strings into Date objects and then checks if there is an overlap between the two time intervals.
    const isTimeClashing = (
        currSessionStartTime: string,
        currSessionEndTime: string,
        nextSessionStartTime: string,
        nextSessionEndTime: string
    ): boolean => {

        // Helper function to parse a time string in 'HH:MM AM/PM' format into a Date object
        const parseTime = (timeStr: string) => {
            // Split the time string into time part and AM/PM modifier
            const [time, modifier] = timeStr.split(' ');

            // Split the time part into hours and minutes, and convert them to numbers
            let [hours, minutes] = time.split(':').map(Number);
            
            // Adjust hours based on AM/PM modifier
            if (modifier === 'PM' && hours !== 12) {
                // Convert PM hours to 24-hour format (except for 12 PM, which is already correct)
                hours += 12;
            }
            if (modifier === 'AM' && hours === 12) {
                // Convert 12 AM to 0 hours (midnight)
                hours = 0;
            }

            // Create and return a Date object for the time, using a fixed date (Jan 1, 2024)
            // The date is fixed because we only care about the time part
            return new Date(2024, 1, 1, hours, minutes);
        };

        // Parse the start and end times of both intervals
        const currentStartTime = parseTime(currSessionStartTime);
        const currentEndTime = parseTime(currSessionEndTime);
        const nextStartTime = parseTime(nextSessionStartTime);
        const nextEndTime = parseTime(nextSessionEndTime);

        // Check if the time intervals overlap
        // Two intervals overlap if:
        // - The start of the first interval is before the end of the second interval
        // - The end of the first interval is after the start of the second interval
        return (currentStartTime < nextEndTime && currentEndTime > nextStartTime);
    };

    const checkForTimeClashes = (sessions: BuffetSessionRequest[]): boolean => {
        for (let i = 0; i < sessions.length; i++) {
            for (let j = i + 1; j < sessions.length; j++) {
                const currSession = sessions[i];
                const nextSession = sessions[j];
                if (currSession.startTime && currSession.endTime && nextSession.startTime && nextSession.endTime) {
                    if (isTimeClashing(currSession.startTime, currSession.endTime, nextSession.startTime, nextSession.endTime)) {
                        toast.warning('A time overlap between sessions was detected. Please modify the time and try again.');
                        return true; // Clash found
                    }
                }
            }
        }
        return false;
    };


    // Function to calculate total slots
    const calculateTotalSlots = (sessions: BuffetSessionRequest[]): number => {
        return sessions.reduce((total, session) => total + Number(session.slots) || 0, 0);
    };

    /**
     * 
     * @param index  Specifies the index of the buffet session in the buffetSessions array that needs to be updated.
     * @param field  Indicates the field (property) of the buffet session object that should be updated.
     * @param value Represents the new value that field should be updated to.
     */
    // Function to handle input changes for buffet session fields
    const handleInputChange = (index: number, field: 'startTime' | 'endTime' | 'slots', value: string | number) => {
        // Map over the buffetSessions array to update the session at the specified index
        const updatedSessions = buffetSessions.map((session, i) =>
            // Check if the current index matches the specified index
            i === index
                // If true, create a new session object with updated field value using spread operator
                ? { ...session, [field]: value }
                // If false, return the current session object unchanged
                : session
        );

        
        if (field === 'startTime' || field === 'endTime') {
            if (checkForTimeClashes(updatedSessions)) {
                // Optionally handle cases where overlap was detected
                return; // Stop further processing if there's a clash
            }
        }

        // Initialize error messages for the specific session
        const currentSessionErrors = { ...sessionErrorMessages[index] };

        // Update the field value
        if (field === 'startTime') {
            currentSessionErrors.startTime = value ? '' : 'Please enter start time';
        } else if (field === 'endTime') {
            currentSessionErrors.endTime = value ? '' : 'Please enter end time';
        } else if (field === 'slots') {
            currentSessionErrors.slots = value ? '' : 'Please enter slots';
        }

        // Check conditions for combined errors
        const currentSession = updatedSessions[index];
        if (currentSession.startTime && !currentSession.endTime) {
            currentSessionErrors.endTime = 'Please enter end time';
        }
        if (currentSession.endTime && !currentSession.startTime) {
            currentSessionErrors.startTime = 'Please enter start time';
        }
        if (currentSession.startTime && currentSession.endTime && currentSession.slots === 0) {
            currentSessionErrors.slots = 'Please enter slots';
        }

        // Update state
        setBuffetSessions(updatedSessions);
        setSessionErrorMessages(prev => ({
            ...prev,
            [index]: currentSessionErrors
        }));
    };

    /**
    * Function to validate form fields
    * @returns boolean depicting form validation status
    */
    function validateFields() {
        const isAnyFieldSelected = buffetSessions.some(session =>
            (session.startTime && session.startTime.length > 0) ||
            (session.endTime && session.endTime.length > 0) ||
            (session.slots && session.slots > 0)
        );
        if (formValues &&
            formValues.name &&
            formValues.pricePerAdult &&
            formValues.pricePerChild &&
            formValues.buffetDate &&
            formValues.location &&
            formValues.imageBase64Url &&
            // formValues.maxGuests &&
            formValues.description &&
            formValues.contactPhone &&
            selectedFoodIds.length > 0 &&
            isAnyFieldSelected
        ) {
            return true;
        } else {
            if (!formValues?.imageBase64Url) {
                setImageUrlErrorMsg('Please upload buffet image');
            } else {
                setImageUrlErrorMsg(false);
            }
            if (!formValues?.buffetDate) {
                setDateErrorMsg('Please enter date');
            } else {
                setDateErrorMsg(false);
            }
            if (!formValues?.name) {
                setNameErrorMsg(true);
            } else {
                setNameErrorMsg(false);
            }
            if (!formValues?.pricePerAdult) {
                setAdultPriceErrorMsg(true);
            } else {
                setAdultPriceErrorMsg(false);
            }
            if (!formValues?.pricePerChild) {
                setChildPriceErrorMsg(true);
            } else {
                setChildPriceErrorMsg(false);
            }
            if (!formValues?.buffetDate) {
                setDateErrorMsg(true);
            } else {
                setDateErrorMsg(false);
            }
            if (!formValues?.location) {
                setLocationErrorMsg(true);
            } else {
                setLocationErrorMsg(false);
            }
            if (!formValues?.imageBase64Url) {
                setImageUrlErrorMsg(true);
            } else {
                setImageUrlErrorMsg(false);
            }
            // if (!formValues?.maxGuests) {
            //     setMaxGuestErrorMsg(true);
            // } else {
            //     setMaxGuestErrorMsg(false);
            // }
            if (!formValues?.description) {
                setDescriptionErrorMsg(true);
            } else {
                setDescriptionErrorMsg(false);
            }
            if (!formValues?.contactPhone) {
                setPhoneErrorMsg(true);
            } else {
                setPhoneErrorMsg(false);
            }

            if (selectedFoodIds.length === 0) {
                setMenuErrorMsg('Please select at least one food item');
            } else {
                setMenuErrorMsg(false);
            }
            if (!isAnyFieldSelected) {
                // Show toast message if none of the sessions have startTime, endTime, or slot filled
                toast.warning('Please select at least one buffet session');
            }
            return false;
        }
    };

    // Function which handles session creation
    async function handleCreateSession(token: string, buffetId: string) {

        // Filter sessions that are fully filled (e.g., startTime, endTime and slots are not empty)
        const filledSessions = buffetSessions.filter(session =>
            session.startTime !== '' && session.endTime !== '' && session.slots !== 0
        );

        const sessionPromises = filledSessions.map(session =>
            createBuffetSession(token, buffetId, session as BuffetSessionRequest)
        );

        Promise.all(sessionPromises)
            .then(responses => {
                // Handle successful responses
                responses.forEach((response: AxiosResponse<BuffetSessionResponse>, index) => {
                });
            })
            .catch(error => {
                // Catch error
                catchError(error);
                // const errorMessage = createCustomErrorMessages(error.response?.data)
                // toast.error(errorMessage);
            });
    }

    // Function which handles discount creation
    async function handleCreateDiscount(token: string, buffetId: string) {

        // construct buffet request data
        const data: BuffetDiscount = {
            buffetId: buffetId,
            discountPercentage: formValues?.discountPercentage as number
        };

        if (!data.discountPercentage) {
            return;
        }

        await createDiscount(token, data)
            .then((response) => {

            })
            .catch((error) => {
                // Display error
                toast.error("An error occured. Please try again");

                // Catch error 
                catchError(error);
            })
    }

    // Function to add food to buffet
    async function handleAddFoodToBuffet(token: string, buffetId: string, foodIds: string[]) {

        await Promise.all(foodIds.map(foodId =>
            addFoodToBuffet(token, buffetId, foodId)
        ))
            .then((responses) => {
                responses.forEach(response => {
                });
            })
            .catch((error) => {
                // Display error
                toast.error("An error occurred. Please try again");

                // Catch error 
                catchError(error);
            });
    }

    // Function to create buffet
    async function handleCreateBuffet(e: FormEvent<HTMLFormElement | HTMLButtonElement>) {
        e.preventDefault();

        if (!validateFields()) {
            return;
        };
        // Check for time clashes
        if (checkForTimeClashes(buffetSessions)) {
            return; // Exit function if clash is detected
        }

        const totalSlots = calculateTotalSlots(buffetSessions);

        if (formValues && totalSlots > formValues.maxGuests) {
            toast.error('The total number of slots cannot exceed max guests');
            return;
        }

        // construct buffet request data
        const data: BuffetRequest = {
            imageBase64Url: formValues?.imageBase64Url as string,
            name: formValues?.name as string,
            location: formValues?.location as string,
            buffetDate: formValues?.buffetDate as string,
            pricePerAdult: formValues?.pricePerAdult as number,
            pricePerChild: formValues?.pricePerChild as number,
            maxGuests: formValues?.maxGuests as number,
            description: formValues?.description as string,
            contactPhone: formValues?.contactPhone as string,
            isVisible: formValues?.isVisible as boolean,
            maxNumberPerBooking: null // we can update this later if needed,
        };

        // Show loader 
        setIsCreatingBuffet(true);

        // if user credentials does not exist, do nothing
        if (!fetchUserCredentials) return;
        // Function to create buffet
        async function handleCreateBuffet(token: string, data: BuffetRequest) {
            await createBuffet(token, data)
                .then(async (response) => {
                    await Promise.all([
                        handleCreateSession(token, response.data.id),
                        handleCreateDiscount(token, response.data.id),
                        handleAddFoodToBuffet(token, response.data.id, selectedFoodIds as string[]),
                    ])

                    // Display success modal
                    setSuccessModalIsVisible(true);

                    router.push('/buffets')
                })
                .catch((error) => {
                    // Display error
                    toast.error("An error occured. Please try again");
                    // // Catch error 
                    catchError(error);

                    setSuccessModalIsVisible(false)
                })
                .finally(() => {
                    // Close loader 
                    setIsCreatingBuffet(false);
                })
        };

        // Fetch user credentials if they exist
        await fetchUserCredentials(true)
            .then(async (response) => {
                // Invoke create buffet function
                await handleCreateBuffet(response?.accessToken as string, data);
            })
            .catch((error) => {
            })
    };

    // Function to add new session
    const addNewSession = () => {
        // Check if the current number of sessions is less than the maximum allowed
        if (buffetSessions.length >= 6) {
            toast.error('Maximum number of sessions (6) reached.');
            return;
        }

        // Get the last session from the buffetSessions array
        const lastSession = buffetSessions[buffetSessions.length - 1];

        // Check if the last session has all required fields filled
        if (lastSession.startTime && lastSession.endTime && lastSession.slots > 0) {
            // If all fields are filled, add a new session to the array
            setBuffetSessions([...buffetSessions, { startTime: '', endTime: '', slots: 0 }]);
        } else {
            // If any field is missing, show an error message
            toast.error('Please fill all the fields in the current session before adding a new one.');
        }
    };


    //#endregion

    //#region useeffect
    useEffect(() => {
        handleFetchFoods({ clearPreviousFoods: true });
    }, []);

    useEffect(() => {
        const idSelectedFoods = foods
            ?.filter(food => selectedFoods.includes(food.name))
            .map(food => food.id);
        setSelectedFoodIds(idSelectedFoods || []);
    }, [selectedFoods, foods]);

    useEffect(() => {
        if (!foodSearchKeyword) {
            setFilteredFoods(foods);
        }
    }, [foodSearchKeyword, foods]);

    //#endregion


    return (
        <>
            {isFoodModalOpen &&
                <CreateFood
                    visibility={isFoodModalOpen}
                    setVisibility={setIsFoodModalOpen}
                />
            }
            <form className="flex flex-col gap-8 w-[60%] max-w-[60%]">
                <BuffetImageUpload
                    imageUrlErrorMsg={imageUrlErrorMsg}
                    photo={photo}
                    setPhoto={setPhoto}
                    setImageUrlErrorMsg={setImageUrlErrorMsg}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />

                <div className="flex w-full gap-4">
                    <div className="w-full">
                        <Label
                            htmlFor='name'
                            text={<>Name</>}
                            className='mcNiff-primary-dark-4 mb-2'
                        />
                        <Input
                            placeholder='Enter buffet name'
                            name='name'
                            value={formValues?.name}
                            className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e, setNameErrorMsg)}
                        />
                        {nameErrorMsg && <span className='text-error text-sm'>Please enter buffet Name</span>}
                    </div>

                    <div className="w-full">
                        <Label
                            htmlFor='location'
                            text={<>Location</>}
                            className='mcNiff-primary-dark-4 mb-2'
                        />
                        <Input
                            placeholder='Enter buffet location'
                            name='location'
                            value={formValues?.location}
                            className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e, setLocationErrorMsg)}
                        />
                        {locationErrorMsg && <span className='text-error text-sm'>Please enter buffet location</span>}
                    </div>
                </div>

                <div className='flex items-center gap-4'>
                    <div className="w-full">
                        <Label
                            text={<>Date</>}
                            className='mcNiff-primary-dark-4 mb-2' />
                        <div className={styles.date} ref={buffetRef}>
                            <DatePicker
                                calendarProps={{
                                    navigationIcons: {
                                        leftNavigation: "ChevronLeft",
                                        rightNavigation: "ChevronRight",
                                    }
                                }}
                                textField={{
                                    style: {
                                        background: '#efeeee',
                                        color: '#000'
                                    },
                                    borderless: true,
                                }}
                                calloutProps={{
                                    gapSpace: 8,
                                    target: buffetRef
                                }}
                                minDate={new Date()}
                                placeholder="DD/MM/YYYY"
                                ariaLabel="Select a date"
                                onSelectDate={(date) => {

                                    // Set the form value
                                    setFormValues({ ...formValues as CompleteBuffetRequest, buffetDate: `${moment(date).format('YYYY-MM-DD')}` });
                                    // Unset error message 
                                    setDateErrorMsg(false)
                                }}
                                onKeyDown={(e) => {

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
                        {dateErrorMsg && <span className='text-error text-sm'>Please select buffet date</span>}
                    </div>
                    <div className="w-full flex flow-row gap-4">
                        <div className="w-full">
                            <Label
                                htmlFor='pricePerAdult'
                                text={<>Adult&apos;s Price</>}
                                className='mcNiff-primary-dark-4 mb-2'
                            />
                            <Input
                                placeholder='Enter adult price'
                                name='pricePerAdult'
                                value={formValues?.pricePerAdult}
                                className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                                onChange={(e) => onFormValueChange(e, setAdultPriceErrorMsg)}
                            />
                            {adultPriceErrorMsg && <span className='text-error text-sm'>Please enter adult price</span>}
                        </div>
                        <div className="w-full">
                            <Label
                                htmlFor='pricePerChild'
                                text={<>Children&apos;s Price</>}
                                className='mcNiff-primary-dark-4 mb-2'
                            />
                            <Input
                                placeholder='Enter children price'
                                name='pricePerChild'
                                value={formValues?.pricePerChild}
                                className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                                onChange={(e) => onFormValueChange(e, setChildPriceErrorMsg)}
                            />
                            {childPriceErrorMsg && <span className='text-error text-sm'>Please enter children price</span>}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex w-full items-center justify-between">
                        <p className='text-mcNiff-gray-2 mb-4 text-sm'>Set buffet sessions</p>
                        <button type='button' onClick={addNewSession} className='text-primary text-sm' >Add New Session</button>
                    </div>
                    <div className='flex items-end gap-4 w-full flex-wrap'>
                        {buffetSessions.map((session, index) => (
                            <BuffetSession
                                key={index}
                                session={session}
                                index={index}
                                handleInputChange={handleInputChange}
                                sessionErrorMessages={sessionErrorMessages}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <p className='text-mcNiff-gray-2 mb-4'>Buffet Menu</p>
                    <div className="flex flex-col items-start gap-3">
                        <div className="flex items-center ml-auto text-sm gap-5 w-full relative">
                            <Input
                                name='name'
                                placeholder='Enter food name'
                                className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                                onClick={() => setIsFoodsDropdownOpen(true)}
                                onChange={(e) => handleFoodInputChange(e, setMenuErrorMsg)}
                            />
                            <button type='button' onClick={() => setIsFoodModalOpen(true)} className='rounded-full bg-primary px-4 py-2 text-white text-sm whitespace-nowrap cursor-pointer '>Add new food</button>
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
                        {menuErrorMsg && selectedFoods.length === 0 && <span className='text-error text-sm'>{menuErrorMsg}</span>}
                        <SelectedFoods
                            selectedFoods={selectedFoods}
                            setSelectedFoods={setSelectedFoods}
                        />
                    </div>
                </div>

                <div className='flex items-center gap-4'>
                    <div className="w-full">
                        <Label
                            htmlFor='discountPercentage'
                            text={<>Add Discount (e.g 30)</>}
                            className='mcNiff-primary-dark-4 mb-2'
                        />
                        <Input
                            placeholder='Enter discount percentage'
                            name='discountPercentage'
                            value={formValues?.discountPercentage}
                            className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e)}
                        />
                    </div>

                    <div className="w-full">
                        <Label
                            htmlFor='contactPhone'
                            text={<>Phone Number</>}
                            className='mcNiff-primary-dark-4 mb-2'
                        />
                        <Input
                            placeholder='Enter phone number'
                            name='contactPhone'
                            value={formValues?.contactPhone}
                            className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e, setPhoneErrorMsg)}
                        />
                        {phoneErrorMsg && <span className='text-error text-sm'>Please enter phone number</span>}
                    </div>
                    {/* <div className="w-full">
                        <Label
                            htmlFor='maxGuests'
                            text={<>Add Max Guest</>}
                            className='mcNiff-primary-dark-4 mb-2'
                        />
                        <Input
                            placeholder='Enter maximum number of guests'
                            name='maxGuests'
                            value={formValues?.maxGuests}
                            className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                            onChange={(e) => onFormValueChange(e, setMaxGuestErrorMsg)}
                        />
                        {maxGuestErrorMsg && <span className='text-error text-sm'>Please enter max guest</span>}
                    </div> */}
                </div>

                <div className="w-full">
                    <Label
                        htmlFor='description'
                        text={<>Enter description</>}
                        className='mcNiff-primary-dark-4 mb-2'
                    />
                    <TextArea
                        placeholder='Enter description'
                        name='description'
                        value={formValues?.description}
                        className='py-[10px] px-3 placeholder:text-sm text-base !rounded-[10px]'
                        onChange={(e) => onFormValueChange(e, setDescriptionErrorMsg)}
                    />
                    {descriptionErrorMsg && <span className='text-error text-sm'>Please enter description</span>}
                </div>

                <div className='ml-auto mt-6 flex gap-3'>
                    <Link href={ApplicationRoutes.Buffets}
                        className='!py-2 !px-4 bg-transparent !text-primary hover:opacity-70'>
                        Cancel
                    </Link>
                    <Button
                        disabled={isCreatingBuffet}
                        className='!py-2 !px-4 text-sm hover:shadow-md relative overflow-hidden disabled:pointer-events-none disabled:opacity-60'
                        onClick={(e) => handleCreateBuffet(e)}
                    >
                        Create Buffet
                    </Button>
                </div>
            </form>
        </>

    )
}

export default BuffetFormValues