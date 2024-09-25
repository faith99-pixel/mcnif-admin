"use client"
import React, { FormEvent, useContext, useState } from 'react'
import { Icons } from '@/app/components/ui/icons';
import ModalWrapper from '../components/modal/ModalWrapper';
import { FoodRequest } from '../models/IFood';
import { useCreateFood } from '../api/apiClients';
import { UserCredentialsSub } from '../models/IUser';
import { AdminUserContext, AdminUserContextData } from '../context/AdminUserContext';
import { toast } from 'sonner';
import { catchError } from '../constants/catchError';
import { FoodContext, FoodContextData } from '../context/FoodContext';
import CreateFoodFormValue from '../components/food/CreateFoodFormValue';

type Props = {
    visibility: boolean
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateFood = ({ visibility, setVisibility }: Props) => {

    const createFood = useCreateFood();

    const { fetchUserCredentials, userCredentials } = useContext(AdminUserContext) as AdminUserContextData;
    console.log("🚀 ~ CreateFood ~ userCredentials:", userCredentials)
    const { handleFetchFoods, foods } = useContext(FoodContext) as FoodContextData;

    const [formValues, setFormValues] = useState<FoodRequest>();

    const [userPhoto, setUserPhoto] = useState<string>();

    const [imageUrlErrorMsg, setImageUrlErrorMsg] = useState<string | boolean>(false);
    const [nameErrorMsg, setNameErrorMsg] = useState(false);
    const [isCreatingFood, setIsCreatingFood] = useState(false);
    const [textErrorMsg, setTextErrorMsg] = useState(false);

    function validateFields() {

        if (formValues &&
            formValues.name &&
            formValues.recipes &&
            formValues.base64ImageUrl
        ) {
            return true;
        } else {

            if (!formValues?.name) {
                setNameErrorMsg(true);
            } else {
                setNameErrorMsg(false);
            }
            if (!formValues?.recipes) {
                setTextErrorMsg(true);
            } else {
                setTextErrorMsg(false);
            }
            if (!formValues?.base64ImageUrl) {
                setImageUrlErrorMsg(true);
            } else {
                setImageUrlErrorMsg(false);
            }

            return false;
        }
    };

    /**
  * Function to handle image file upload and update form values
  * @param e is the event handler
  * @returns void
  */
    const handleFileUpload = (e: any) => {

        // Get the selected file
        const selectedFile: File = e.target.files[0];

        // If a valid file was selected...
        if (selectedFile.type === "image/jpg" ||
            selectedFile.type === "image/png" ||
            selectedFile.type === 'image/jpeg' ||
            selectedFile.type === 'image/webp') {

            // Unset validation message
            setImageUrlErrorMsg(false);

            const file = e.target.files[0]; // Get the selected file

            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

                    if (base64URL) {
                        // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
                        const base64String = base64URL.split(',')[1];

                        // Update form values 
                        setFormValues({ ...formValues as FoodRequest, base64ImageUrl: base64String });
                    }
                };

                // Read the file as a data URL (base64-encoded)
                reader.readAsDataURL(file);
            }
        }
        // Otherwise...
        else {
            // Set appropriate validation message
            setImageUrlErrorMsg('Please select a valid photo');

            // Exit this method
            return;
        }

        // Set the image url
        const imgURL = URL.createObjectURL(selectedFile);

        // Update the image url state
        setUserPhoto(imgURL);
    };

    // Function which handles food creation
    async function handleCreateFood(e: FormEvent<HTMLFormElement | HTMLButtonElement>) {

        e.preventDefault();

        if (!validateFields()) return;

        // Check if the food name already exists
        const foodNameExist = foods?.some(food => food.name.toLowerCase() === formValues?.name.toLowerCase());

        if (foodNameExist) {
            toast.error('The food with this name already exist');
            return;
        }

        setIsCreatingFood(true);

        let userCredentials: UserCredentialsSub | null | undefined;

        // if user credentials does not exist, do nothing
        if (!fetchUserCredentials) return;

        // Fetch user credentials if they exist
        await fetchUserCredentials(true)
            .then((response) => {
                userCredentials = response;
            })
            .catch((error) => {
            })

        await createFood(userCredentials?.accessToken as string, formValues as FoodRequest)
            .then(async (response) => {
                // Close modal and clear form values
                setVisibility(false)

                // Open success modal...
                toast.success("Food created successfully!");


                // Fetch Foods
                await handleFetchFoods({ clearPreviousFoods: true });

                // Clear form values
                setFormValues(undefined)

            })
            .catch((error) => {
                // Display error
                toast.error("An error occured. Please try again");

                // Catch error 
                catchError(error);
            })
            .finally(() => {
                setIsCreatingFood(false)
            })

    }

    return (

        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div className={`bg-white w-full max-h-[90vh]  overflow-y-auto overflow-x-hidden hideScrollbar rounded-xl p-6 transition-all duration-500 ${visibility ? 'modal-slide-up' : 'opacity-0'}`}>
                <div className="flex items-center justify-between p-6">
                    <h3 className="text-mcNiff-gray-2 text-2xl">Create Food</h3>
                    <Icons.Close className="cursor-pointer" onClick={() => setVisibility(false)} />
                </div>
                <div className="border-[#F0F2F5] border w-[95%] m-auto"></div>
                <CreateFoodFormValue
                    handleCreateFood={handleCreateFood}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    userPhoto={userPhoto}
                    handleFileUpload={handleFileUpload}
                    imageUrlErrorMsg={imageUrlErrorMsg}
                    setImageUrlErrorMsg={setImageUrlErrorMsg}
                    setNameErrorMsg={setNameErrorMsg}
                    nameErrorMsg={nameErrorMsg}
                    setVisibility={setVisibility}
                    textErrorMsg={textErrorMsg}
                    isCreatingFood={isCreatingFood}
                    setTextErrorMsg={setTextErrorMsg}
                />
            </div>
        </ModalWrapper>
    );
}

export default CreateFood;
