import React, { createContext, ReactNode, FunctionComponent, useState, useEffect } from "react";
import { catchError } from "../constants/catchError";
import { fetchUserFromDb } from "../api/services/fetchUserFromDb";
import { useFetchBuffetDiscounts, useFetchNotifications, useFetchUserProfile } from "../api/apiClients";
import { UserCredentialsSub } from "../models/IUser";
import { UserProfileResponse } from "../models/IUserProfileResponse";
import { NotificationResponse } from "../models/INotifications";
import { BuffetDiscounts } from "../models/IBuffet";

/**
 * The data type for the application context
 */
export type AdminUserContextData = {
    userProfileInformation: UserProfileResponse | null;
    userCredentials: UserCredentialsSub | null;
    fetchUserCredentials: (getUserInfo: boolean) => Promise<UserCredentialsSub | null>;
    fetchUserProfileInformation: () => void;
    notifications?: NotificationResponse[] | null;
    isFetchingNotifications?: boolean;
    buffetDiscounts?: BuffetDiscounts[] | null;
    isFetchingBuffetDiscounts?: boolean;
    updateBuffetDiscounts?: (refetch?: boolean) => void;
};

/**
 * The context for the application
 */
const AdminUserContext = createContext<AdminUserContextData | undefined>(undefined);

// Create a provider component that takes children as props
type AdminUserProviderProps = {
    children: ReactNode;
};

const AdminUserProvider: FunctionComponent<AdminUserProviderProps> = ({ children }) => {

    // Hook to fetch customer 
    const fetchUserProfile = useFetchUserProfile();
    const fetchNotifications = useFetchNotifications();
    const fetchBuffetDiscounts = useFetchBuffetDiscounts();

    // Define state for customer data
    const [userProfileInformation, setUserProfileInformation] = useState<UserProfileResponse | null>(null);
    const [userCredentials, setUserCredentials] = useState<UserCredentialsSub | null>(null);

    const [notifications, setNotifications] = useState<NotificationResponse[] | null>(null);
    const [buffetDiscounts, setBuffetDiscounts] = useState<BuffetDiscounts[] | null>(null);

    const [isFetchingNotifications, setIsFetchingNotifications] = useState(false);
    const [isFetchingBuffetDiscounts, setIsFetchingBuffetDiscounts] = useState(false);

    /**
     * Function to fetch user credentials from the prisma database
     * @param getUserInfo is the flag to determine if the user information should be fetched
     * @returns the user credentials
     */
    const fetchUser = async (getUserInfo: boolean) => {

        if (!getUserInfo) {
            return null;
        }

        const user = await fetchUserFromDb();

        // Set the user credentials
        setUserCredentials(user);

        return user as unknown as UserCredentialsSub;
    };

    /**
     * Function to fetch user's profile information
     */
    const fetchUserInformation = async () => {

        const userInfo = await fetchUser(true);
        // Retrieve customer
        await fetchUserProfile(userInfo?.accessToken as string)
            .then((response) => {

                // Set the result
                setUserProfileInformation(response.data);
            })
            .catch((error) => {

                // Set customer to null
                setUserProfileInformation(null);

                // Log the error
                // console.error("Error fetching customer data:", error);

                catchError(error);
            })
    };

    /**
     * Function to fetch notifications
     */
    const handleFetchNotifications = async () => {

        const userInfo = await fetchUser(true);

        await fetchNotifications(userInfo?.accessToken as string)
            .then((response) => {
                // Set the testimonials
                setNotifications(response.data)
            })
            .catch((error) => {
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsFetchingNotifications(false);
            })
    };

    /**
     * Function to fetch buffet discounts
     * @returns the buffet discounts
     */
    const handleBuffetDiscounts = async (refetch?: boolean) => {
        // Set the loader if refetch is true
        if (refetch) {
            setIsFetchingBuffetDiscounts(true);
        }

        const userInfo = await fetchUser(true);

        await fetchBuffetDiscounts(userInfo?.accessToken as string)
            .then((response) => {
                // Set the testimonials
                setBuffetDiscounts(response.data);
            })
            .catch((error) => {
                catchError(error);
            })
            .finally(() => {
                // Close loader 
                setIsFetchingBuffetDiscounts(false);
            })
    };

    // Hook to fetch notifications on component mount
    useEffect(() => {
        if (notifications === null) {
            handleFetchNotifications();
        }
        if (buffetDiscounts === null) {
            handleBuffetDiscounts();
        }
    }, [notifications, buffetDiscounts, fetchUser]);

    useEffect(() => {
        if (userCredentials === null) {
            // Fetch user information
            fetchUser(true);
        }
    }, [userCredentials]);

    // Define the values you want to share
    const sharedData: AdminUserContextData = {
        userProfileInformation,
        userCredentials,
        fetchUserProfileInformation: fetchUserInformation,
        fetchUserCredentials: fetchUser,
        notifications,
        isFetchingNotifications,
        buffetDiscounts,
        isFetchingBuffetDiscounts,
        updateBuffetDiscounts: handleBuffetDiscounts
    };

    return (
        <AdminUserContext.Provider value={sharedData}>
            {children}
        </AdminUserContext.Provider>
    );
};

export { AdminUserProvider, AdminUserContext };
