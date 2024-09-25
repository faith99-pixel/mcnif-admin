import React from 'react'
import { Icons } from '../ui/icons'

type Props = {
    selectedFoods: string[]
    setSelectedFoods: React.Dispatch<React.SetStateAction<string[]>>
}

const SelectedFoods = ({ selectedFoods, setSelectedFoods }: Props) => {
    return (
        <div className='flex gap-2 flex-wrap'>
            {
                selectedFoods.map((food, index) => {
                    return (
                        <div className='flex items-center gap-2 bg-primary text-white p-1 px-3 rounded-full' key={index}>
                            <p className='whitespace-nowrap text-sm'>{food}</p>
                            <button
                                type='button'
                                onClick={() => {
                                    setSelectedFoods(selectedFoods.filter(selectedFood => selectedFood !== food));
                                }}
                                className='p-1 rounded-full hover:opacity-70'>
                                <Icons.Close className='stroke-white w-3 h-3' />
                            </button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SelectedFoods