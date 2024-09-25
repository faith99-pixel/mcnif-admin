"use client"
import React, { useContext, useEffect, useState } from 'react'
import CustomImage from '../components/ui/image'
import { Icons } from '../components/ui/icons'
import { FoodContext, FoodContextData } from '../context/FoodContext'
import { FullPageLoader } from '../Loader/ComponentLoader'
import { useDeleteFood } from '../api/apiClients'
import { AdminUserContext, AdminUserContextData } from '../context/AdminUserContext'
import { UserCredentialsSub } from '../models/IUser'
import { FoodResponse } from '../models/IFood'
import { toast } from 'sonner'
import { catchError } from '../constants/catchError'
import { DeleteModalComponent, DeleteSuccessModalComponent } from '../components/modal/ModalComponent'
import EditFoodDrawer from './EditFoodDrawer'

type Props = {}

const FoodContent = (props: Props) => {

    const deleteFood = useDeleteFood();

    const { foods, handleFetchFoods, isFetchingFoods } = useContext(FoodContext) as FoodContextData;
    const { fetchUserCredentials } = useContext(AdminUserContext) as AdminUserContextData;

    const [selectedFood, setSelectedFood] = useState<FoodResponse>();

    const [showRecipe, setShowRecipe] = useState<boolean>(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)

    const toggleRecipe = (index: number) => {
        if (selectedMenuIndex === index) {
            setSelectedMenuIndex(null);
            setShowRecipe(false);
        } else {
            setSelectedMenuIndex(index);
            setShowRecipe(true);
        }
    };

    const closeRecipe = () => {
        setSelectedMenuIndex(null);
        setShowRecipe(false);
    };

    /**
     * Function to handle food deletion
     * @returns void
     */
    async function handleDeleteFood() {
        // show loader
        setIsDeleting(true)

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

        await deleteFood(userCredentials?.accessToken as string, selectedFood?.id as string)
            .then(async (response) => {

                // Fetch foods
                await handleFetchFoods({ clearPreviousFoods: true });

                // Close modal after deleting...
                setIsDeleteModalVisible(false)

                // Open success modal...
                setIsDeleteSuccessModalVisible(true)
            })
            .catch((error) => {
                // Display error
                toast.error('An error occured.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsDeleting(false);
            })
    };

    useEffect(() => {
        // Fetch Foods
        handleFetchFoods({ clearPreviousFoods: true });
    }, [])

    return (
        <>
            {
                isEditModalOpen &&
                <EditFoodDrawer
                    visibility={isEditModalOpen}
                    setVisibility={setIsEditModalOpen}
                    selectedFood={selectedFood}
                />
            }

            <DeleteModalComponent
                setVisibility={setIsDeleteModalVisible}
                visibility={isDeleteModalVisible}
                contentType='Food'
                isLoading={isDeleting}
                rightActionButton={{ visibility: true, text: 'Delete', function: handleDeleteFood }}
                leftActionButton={{ visibility: true, text: 'Cancel' }}
            />

            <DeleteSuccessModalComponent
                setVisibility={setIsDeleteSuccessModalVisible}
                visibility={isDeleteSuccessModalVisible}
                contentType='Food'
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                {foods?.map((food, foodIndex) => (
                    <div className="h-full w-full relative" key={foodIndex}>
                        <div className="relative h-[200px]">
                            <CustomImage src={food.imageUrl} alt='user image' className='object-cover rounded-2xl' />
                            <div className="absolute top-0 left-0 w-full h-full bg-black/50 rounded-2xl"></div>
                            <div className='relative flex flex-col mb-10'>
                                {
                                    selectedMenuIndex != foodIndex && (
                                        <>
                                            <div className='relative flex items'>
                                                {
                                                    food.isFeatured &&
                                                    <div className="absolute flex items-center justify-between top-4 left-2 w-full">
                                                        <div className={`${food.isFeatured && 'bg-[#EBA00E]'} text-black px-4 py-1 rounded-2xl cursor-none`}>Featured Food</div>
                                                    </div>
                                                }
                                                <div className='flex items-center ml-auto gap-2 p-4 z-20'>
                                                    <Icons.PenIcon className='cursor-pointer' onClick={() => {
                                                        setSelectedFood(food)
                                                        setIsEditModalOpen(true)
                                                    }} />
                                                    <Icons.EraseIcon className='!cursor-pointer'
                                                        onClick={() => {
                                                            setSelectedFood(food)
                                                            setIsDeleteModalVisible(true)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex items-center mt-24 gap-3 p-4'>
                                                <Icons.Eye />
                                                <button className='text-[#fff]' onClick={() => toggleRecipe(foodIndex)}>View Recipe</button>
                                            </div>
                                        </>
                                    )
                                }

                            </div>
                            {showRecipe && selectedMenuIndex === foodIndex && (
                                // absolute w-full h-full bg-black/50 flex flex-col p-7 overflow-y-auto hideScrollBar items-start z-10 translate-y-80 group-hover:translate-y-0 transition duration-500
                                <div className={`absolute top-0 left-0 rounded-2xl w-full h-full backdrop-blur-sm bg-black/50 flex flex-col p-5 hideScrollBar items-start  translate-y-0 transition duration-500 `}>
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className='bg-primary text-white py-2 px-4 rounded-[8px] text-base font-semibold mb-3 w-fit'>Recipes</h3>
                                        <button className="text-white z-10 -translate-y-4" onClick={closeRecipe}>
                                            <Icons.Close className='!stroke-white !w-3 !h-3' />
                                        </button>
                                    </div>

                                    {/* <ul className='text-white text-sm flex flex-col gap-2 overflow-y-auto w-full hideScrollbar'>
                                        {food.recipes.map((recipe, index) => (
                                            <li key={index}>{recipe}</li>
                                        ))}
                                    </ul> */}
                                    <div className='flex flex-row flex-wrap overflow-y-auto'>
                                        {food.recipes.map((recipe, index) => (
                                            <p key={index} className='text-white'>{recipe}{index != food.recipes.length - 1 &&<>&nbsp;||&nbsp;</>}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className='mt-4 font-md text-xl'>{food.name}</p>
                    </div>
                ))}
            </div>

            {!foods && isFetchingFoods && (
                <FullPageLoader />
            )}

            {!foods || foods?.length == 0 && !isFetchingFoods && (
                <p className='text-mcNiff-gray-3 text-sm text-center'>There is no food available</p>
            )}
        </>
    )
}

export default FoodContent;
