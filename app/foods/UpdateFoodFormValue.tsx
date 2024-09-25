import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import Button from '../components/ui/button';
import Image from 'next/image';
import { Icons } from '../components/ui/icons';
import Label from '../components/ui/label';
import Input from '../components/ui/input';
import { FoodRequest, FoodResponse } from '../models/IFood';
import { useUpdateFood } from '../api/apiClients';
import { AdminUserContext, AdminUserContextData } from '../context/AdminUserContext';
import { FoodContext, FoodContextData } from '../context/FoodContext';
import { UserCredentialsSub } from '../models/IUser';
import { toast } from 'sonner';
import { catchError } from '../constants/catchError';
import FoodRadioButton from '../components/food/FoodRadioButton';

type Props = {
    formValues: FoodRequest | undefined,
    setFormValues: React.Dispatch<React.SetStateAction<FoodRequest | undefined>>,
    selectedFood: FoodResponse | undefined,
    handleFileUpload: (e: any) => void,
    photo: string | undefined,
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>,
    setPhoto: React.Dispatch<React.SetStateAction<string | undefined>>,
    onFormValueChange: (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => void
};

const UpdateFoodFormValue = ({ formValues, setFormValues, selectedFood, handleFileUpload, photo, setVisibility, setPhoto, onFormValueChange }: Props) => {

    const updateFood = useUpdateFood();

    const { fetchUserCredentials } = useContext(AdminUserContext) as AdminUserContextData;
    const { handleFetchFoods } = useContext(FoodContext) as FoodContextData;

    const [isUpdatingFood, setIsUpdatingFood] = useState(false);

    const [recipeInput, setRecipeInput] = useState('');
    const [recipes, setRecipes] = useState<string[]>([]);

    const [isFeatured, setIsFeatured] = useState<string>(selectedFood?.isFeatured ? 'yes' : 'no');

    
    async function handleUpdateFood(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Show loader
        setIsUpdatingFood(true);

        let userCredentials: UserCredentialsSub | null | undefined;

        // if user credentials do not exist, do nothing
        if (!fetchUserCredentials) return;

        // Fetch user credentials if they exist
        await fetchUserCredentials(true)
            .then((response) => {
                userCredentials = response;
            })
            .catch((error) => {
            });

        // construct the data
        const data = {
            id: selectedFood?.id as string,
            accessToken: userCredentials?.accessToken as string,
            data: { ...formValues, recipes } as FoodRequest,
        };

        await updateFood(data)
            .then((response) => {
                // Close modal
                setVisibility(false);

                // Display success message
                toast.success("Food updated successfully!");

                // fetch foods
                handleFetchFoods({ clearPreviousFoods: true });
            })
            .catch((error) => {
                // Display error
                toast.error("An error occurred. Please try again");

                // Catch error 
                catchError(error);
            })
            .finally(() => {
                setIsUpdatingFood(false);
            });
    }

    const handleOptionChange = (value: string) => {
        setIsFeatured(value);
        setFormValues({ ...formValues as FoodRequest, isFeatured: value === 'yes' });
    };

    const addRecipe = () => {
        if (recipeInput.trim()) {
            setRecipes(prevRecipes => [...prevRecipes, recipeInput.trim()]);
            setRecipeInput('');
        }
    };

    const removeRecipe = (index: number) => {
        setRecipes(prevRecipes => prevRecipes.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (selectedFood) {
            setPhoto(selectedFood.imageUrl);
            setFormValues(selectedFood);
            setRecipes(selectedFood.recipes || []);
        }
    }, [selectedFood]);

    return (
        <form className='flex flex-col gap-8 w-[400px] m-auto p-4' onSubmit={(e) => handleUpdateFood(e)}>
            <div className='relative h-[200px] bg-mcNiff-light-gray-2 overflow-hidden w-full flex flex-col rounded-lg items-center justify-center gap-3'>
                {photo && <Image src={photo} alt="Food photo" fill />}
                <div className='flex flex-col gap-1 items-center justify-center'>
                    <Icons.Image />
                    <p className='text-mcNiff-gray-3 text-sm'>Only JPG or PNG are allowed. Max size of 1MB</p>
                </div>
                <button type='button' className='text-white text-sm font-medium cursor-pointer bg-primary'>
                    <input type="file" onChange={handleFileUpload} className='absolute w-full h-full top-0 left-0 cursor-pointer opacity-0' />
                    {photo && " Update Image"}
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <Label text={<label>Food Name</label>} />
                <Input
                    type='text'
                    name='name'
                    placeholder='Enter food name'
                    value={formValues?.name ?? ''}
                    onChange={onFormValueChange}
                    className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                />
            </div>

            <div>
                <Label text={<label>Food Recipe</label>} />
                <div className='flex gap-2'>
                    <Input
                        name='recipeInput'
                        value={recipeInput}
                        placeholder='List food recipes here'
                        className='max-w-full py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                        onChange={(e) => setRecipeInput(e.target.value)}
                    />
                    <button
                        type="button"
                        className='!px-4 !py-1 !text-xs !whitespace-nowrap rounded-full text-white bg-mcNiff-primary text-center grid place-items-center'
                        onClick={addRecipe}
                    >
                        Add recipe
                    </button>
                </div>

                <ul className='mt-2 list-disc list-inside flex flex-col gap-2 max-h-[150px] hideScrollBar overflow-y-auto'>
                    {recipes.map((recipe, index) => (
                        <li key={index} className='text-mcNiff-gray-2 text-sm flex items-center justify-between w-1/2'>
                            {recipe} <span className='cursor-pointer' onClick={() => removeRecipe(index)}><Icons.Close className='w-[10px] h-[10px]' /></span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='flex flex-col -mt-4'>
                <span className='text-mcNiff-gray-2 text-sm mb-1'>Set as featured food?</span>
                <span className='text-[#A9A1A1] text-sm'>(Featured food are displayed on the homepage)</span>
                <FoodRadioButton selectedOption={isFeatured} onOptionChange={handleOptionChange} />
            </div>
            <div className='flex justify-end gap-3'>
                <Button type='button' className='!py-2 !px-4 !bg-transparent !text-primary hover:opacity-70' onClick={() => setVisibility(false)}>Cancel</Button>
                <Button type='submit' disabled={isUpdatingFood} className='!py-2 !px-8 text-sm hover:shadow-md relative overflow-hidden disabled:pointer-events-none disabled:opacity-60'>Save</Button>
            </div>
        </form>
    );
};

export default UpdateFoodFormValue;
