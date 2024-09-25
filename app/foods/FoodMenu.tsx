"use client"
import React, { useState } from 'react'
import PageTitle from '../components/reusable/PageTitle'
import { styles } from '../styles/styles'
import { Icons } from '../components/ui/icons'
import FoodContent from './FoodContent'
import CreateFood from './CreateFoodModal'

type Props = {}

const FoodMenu = (props: Props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main>
            <PageTitle title='Food Menu'
                additonalContent={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`${styles.linkButton} hover:shadow-md focus:bg-primary/60`}>
                        <Icons.Plus />
                        <p>Add new food</p>
                    </button>
                }
            />

            <FoodContent />

            {
                isModalOpen &&
                <CreateFood
                    visibility={isModalOpen}
                    setVisibility={setIsModalOpen}
                />
            }
        </main>
    )
}

export default FoodMenu
