import React, { ChangeEvent, useState } from 'react'
import { Icons } from '../components/ui/icons'
import ModalWrapper from '../components/modal/ModalWrapper'
import { FoodRequest, FoodResponse } from '../models/IFood'
import UpdateFoodFormValue from './UpdateFoodFormValue'

type Props = {
    visibility: boolean
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
    selectedFood: FoodResponse | undefined
}

const EditFoodDrawer = ({ visibility, setVisibility, selectedFood }: Props) => {

    const [formValues, setFormValues] = useState<FoodRequest>()

    const [photo, setPhoto] = useState<string>();

    function onFormValueChange(e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) {

        const { name, value } = e.target;

        setFormValues({ ...formValues as FoodRequest, [name]: value });
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
        if (selectedFile.type === "image/jpg" || selectedFile.type === "image/png" || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/webp') {

            const file = e.target.files[0]; // Get the selected file

            if (file) {

                // Unset validation message
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

        // Set the image url
        const imgURL = URL.createObjectURL(selectedFile);

        // Update the image url state
        setPhoto(imgURL);
    };

    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            <div className={`bg-white w-full max-h-[90vh] overflow-y-auto overflow-x-hidden hideScrollbar rounded-xl p-6 transition-all duration-500 ${visibility ? 'modal-slide-up' : 'opacity-0'}`}>
                <div className="flex items-center justify-between p-6">
                    <h3 className="text-mcNiff-gray-2 text-2xl">Edit Food</h3>
                    <Icons.Close className="cursor-pointer" onClick={() => setVisibility(false)} />
                </div>
                <div className="border-[#F0F2F5] border w-[95%] m-auto"></div>
                <UpdateFoodFormValue
                    selectedFood={selectedFood}
                    setFormValues={setFormValues}
                    formValues={formValues}
                    handleFileUpload={handleFileUpload}
                    photo={photo}
                    setVisibility={setVisibility}
                    onFormValueChange={onFormValueChange}
                    setPhoto={setPhoto}
                />
            </div>
        </ModalWrapper>
    )
}

export default EditFoodDrawer