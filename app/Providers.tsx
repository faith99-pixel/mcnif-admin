"use client"
import React, { ReactNode } from 'react'
import { SessionProviders } from './components/Providers'
import { AdminUserProvider } from './context/AdminUserContext'
import { FoodProvider } from './context/FoodContext'

type Props = {
    children: ReactNode
}

const Providers = (props: Props) => {
    return (
        <SessionProviders>
            <AdminUserProvider>
                <FoodProvider>
                    {props.children}
                </FoodProvider>
            </AdminUserProvider>
        </SessionProviders>
    )
}

export default Providers