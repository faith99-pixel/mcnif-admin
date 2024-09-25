import React, { createContext, ReactNode, FunctionComponent, useState, useContext } from "react";
import { catchError } from "../constants/catchError";
import { useFetchFoods, useFetchUserProfile } from "../api/apiClients";
import { FoodResponse } from "../models/IFood";
import { AdminUserContext, AdminUserContextData } from "./AdminUserContext";
import { UserCredentialsSub } from "../models/IUser";

// Define the type for the context data
export type FoodContextData = {
    foods: FoodResponse[] | undefined;
    handleFetchFoods: ({ clearPreviousFoods }: {
        clearPreviousFoods?: boolean | undefined;
    }) => Promise<void>
    isFetchingFoods: boolean
};

// Create a context with the specified data type
const FoodContext = createContext<FoodContextData | undefined>(undefined);

// Create a provider component that takes children as props
type FoodProviderProps = {
    children: ReactNode;
};

const FoodProvider: FunctionComponent<FoodProviderProps> = ({ children }) => {

    // Hook to fetch customer 
    const fetchFoods = useFetchFoods();
    const { fetchUserCredentials } = useContext(AdminUserContext) as AdminUserContextData;

    // Define state for customer data
    const [foods, setFoods] = useState<FoodResponse[]>();
    const [isFetchingFoods, setIsFetchingFoods] = useState(true);

    /**
     * Function to fetch foods
     */
    const handleFetchFoods = async ({ clearPreviousFoods = false }) => {

        if (clearPreviousFoods) {
            // Clear previous configurations
            setFoods(undefined);

            // Show loader

            setIsFetchingFoods(true);
        }

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

        await fetchFoods(userCredentials?.accessToken as string)
            .then((response) => {
                
                // Set the result
                setFoods(response.data);
            })
            .catch((error) => {

                // Log the error
                console.error(error);

                catchError(error);
            })
    };

    // Define the values you want to share
    const sharedData: FoodContextData = {
        foods,
        handleFetchFoods,
        isFetchingFoods
    };

    return (
        <FoodContext.Provider value={sharedData}>
            {children}
        </FoodContext.Provider>
    );
};

export { FoodProvider, FoodContext };
