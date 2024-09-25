import useOuterClick from '@/app/hooks/useOuterClick';
import { FoodResponse } from '@/app/models/IFood';
import React, { useRef } from 'react'

type Props = {
    setIsFoodsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
    filteredFoods: FoodResponse[] | undefined
    selectedFoods: string[]
    setSelectedFoods: React.Dispatch<React.SetStateAction<string[]>>
    foodSearchKeyword: string
}

const FoodDropdown = ({ setIsFoodsDropdownOpen, filteredFoods, selectedFoods,
    setSelectedFoods, foodSearchKeyword }: Props) => {

    const foodDropdownRef = useRef<HTMLDivElement>(null);

    useOuterClick(foodDropdownRef, setIsFoodsDropdownOpen);

    return (
        <div className='absolute bottom-12 flex flex-col bg-white w-1/2 rounded-lg overflow-y-auto max-h-52 thinScrollbar shadow-lg' ref={foodDropdownRef}>
            {
                filteredFoods?.map((food, index) => {
                    return (
                        <span
                            className={`p-3 hover:bg-mcNiff-light-gray1 cursor-pointer ${selectedFoods.includes(food.name) ? 'bg-primary/20 pointer-events-none' : ''}`}
                            onClick={() => {
                                if (!selectedFoods.includes(food.name)) {
                                    setSelectedFoods([...selectedFoods, food.name]);
                                }
                                setIsFoodsDropdownOpen(false);
                            }}
                            key={food.id}>
                            {food.name}
                        </span>
                    )
                })
            }
            {
                filteredFoods?.length === 0 && (
                    <p className='p-3'>
                        No food based on keyword <span className='text-primary'>&quot;{foodSearchKeyword}&quot;</span> found.<br />
                        You can add a new food to the list.
                    </p>
                )
            }
        </div>
    )
}

export default FoodDropdown