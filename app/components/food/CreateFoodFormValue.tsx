import { FoodRequest } from '@/app/models/IFood'
import Image from 'next/image'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Icons } from '../ui/icons'
import Button from '../ui/button'
import Label from '../ui/label'
import Input from '../ui/input'
import FoodRadioButton from './FoodRadioButton'

type Props = {
    formValues: FoodRequest | undefined
    setFormValues: React.Dispatch<React.SetStateAction<FoodRequest | undefined>>
    userPhoto: string | undefined
    handleFileUpload: (e: any) => void
    setImageUrlErrorMsg: React.Dispatch<React.SetStateAction<string | boolean>>
    imageUrlErrorMsg: string | boolean
    setNameErrorMsg: React.Dispatch<React.SetStateAction<boolean>>
    nameErrorMsg: boolean
    setTextErrorMsg: React.Dispatch<React.SetStateAction<boolean>>
    textErrorMsg: boolean
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>
    handleCreateFood: (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => Promise<void>
    isCreatingFood: boolean
}

const CreateFoodFormValue = ({
    formValues,
    setFormValues,
    userPhoto,
    setVisibility,
    handleFileUpload,
    textErrorMsg,
    setImageUrlErrorMsg,
    imageUrlErrorMsg,
    setNameErrorMsg,
    setTextErrorMsg,
    nameErrorMsg,
    handleCreateFood,
    isCreatingFood
}: Props) => {
    const [recipeInput, setRecipeInput] = useState<string>('');

    const [recipes, setRecipes] = useState<string[]>(formValues?.recipes || []);

    const [isFeatured, setIsFeatured] = useState<string>(formValues?.isFeatured ? 'yes' : 'no');

    // Function to handle form value change
    function onFormValueChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, stateFunction?: (value: React.SetStateAction<boolean>) => void) {
        const { name, value } = e.target;

        setFormValues({ ...formValues as FoodRequest, [name]: value });
        stateFunction && stateFunction(false);
    };

    // Function to handle adding recipes
    function addRecipe() {
        if (recipeInput.trim() !== '') {
            setRecipes([...recipes, recipeInput]);
            setRecipeInput('');
            setFormValues({ ...formValues as FoodRequest, recipes: [...recipes, recipeInput] });
            setTextErrorMsg(false);
        }
    }

       // Function to handle removing recipes
       function removeRecipe(index: number) {
        const updatedRecipes = recipes.filter((_, i) => i !== index);
        setRecipes(updatedRecipes);
        setFormValues({ ...formValues as FoodRequest, recipes: updatedRecipes });
    }

    const handleOptionChange = (value: string) => {
        setIsFeatured(value);
        setFormValues({ ...formValues as FoodRequest, isFeatured: value === 'yes' });
      };

    return (
        <form className='flex flex-col gap-8 w-[400px] m-auto p-4' onSubmit={(e) => handleCreateFood(e)}>
            <div className='bg-mcNiff-light-gray-2 rounded-lg w-full flex flex-col items-center justify-center h-[200px] gap-3 relative'>
                {userPhoto && <Image src={userPhoto} alt="Blog image url" fill className='object-cover object-center absolute rounded-[10px]' />}
                <div className='flex flex-col gap-1 items-center justify-center'>
                    <Icons.Image />
                    <p className='text-mcNiff-gray-3 text-sm'>Only JPG or PNG are allowed. Max size of 1MB</p>
                </div>
                <Button type='button' className='!py-2 text-sm'>
                    <input
                        type="file"
                        onChange={(e) => {
                            handleFileUpload(e);
                            setImageUrlErrorMsg(false);
                        }}
                        className='absolute w-full h-full top-0 left-0 cursor-pointer opacity-0'
                    />
                    {userPhoto ? 'Change Image' : 'Choose an Image'}
                </Button>
            </div>
            {imageUrlErrorMsg && <span className='text-error text-sm'>Please select an image</span>}

            <div className="flex flex-col gap-1">
                <Label text={<label>Food Name</label>} />
                <Input
                    type='text'
                    name='name'
                    placeholder='Enter food name'
                    value={formValues?.name ?? ''}
                    className='py-[10px] px-4 placeholder:text-sm text-base !rounded-[10px]'
                    onChange={(e) => onFormValueChange(e, setNameErrorMsg)}
                />
                {nameErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter at least one food recipe</span>}
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
                {textErrorMsg && <span className='text-mcNiff-red text-sm'>Please enter food recipe</span>}
                <ul className='mt-4 list-disc list-inside flex flex-col gap-2 max-h-[150px] hideScrollBar overflow-y-auto'>
                    {recipes.map((recipe, index) => (
                        <li key={index} className='text-mcNiff-gray-2 text-sm flex items-center justify-between w-1/2'>{recipe} <span className='cursor-pointer' onClick={() => removeRecipe(index)}><Icons.Close className='w-[10px] h-[10px]'/></span></li>
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
                <Button type='submit' disabled={isCreatingFood} className='!py-2 !px-8 text-sm hover:shadow-md relative overflow-hidden disabled:pointer-events-none disabled:opacity-60'>Save</Button>
            </div>
        </form>
    );
};

export default CreateFoodFormValue;
