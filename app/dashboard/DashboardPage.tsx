'use client'
import React, { useContext, useEffect, useState } from 'react'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import PageTitle from '../components/reusable/PageTitle'
import UpcomingBuffets from '../components/dashboard/UpcomingBuffets'
import { useFetchAdminKpis, useFetchBuffets } from '../api/apiClients'
import { BuffetResponse } from '../models/IBuffet'
import { KpiResponse } from '../models/IKpis'
import { AdminUserContext } from '../context/AdminUserContext'
import { UserCredentialsSub } from '../models/IUser'
import { toast } from 'sonner'
import { catchError } from '../constants/catchError'
import moment from 'moment'
import { FullPageLoader } from '../Loader/ComponentLoader'

type Props = {}

const DashboardPage = (props: Props) => {

    const fetchBuffets = useFetchBuffets();
    const fetchAdminKpis = useFetchAdminKpis()

    const { fetchUserCredentials } = useContext(AdminUserContext) || {};

    const [buffets, setBuffets] = useState<BuffetResponse[]>()
    const [kpis, setKpis] = useState<KpiResponse>()

    const [isFetchingBuffets, setIsFetchingBuffets] = useState(true);
    const [isFetchingKpis, setIsFetchingKpis] = useState(true)

    // Function to filter and sort buffets by date
    const filterAndSortBuffets = (buffets: BuffetResponse[]): BuffetResponse[] => {
        return buffets
            .filter(buffet => moment(buffet.buffetDate).isAfter(moment())) // Filter to show only buffets after today
            .sort((a, b) => moment(a.buffetDate).diff(moment(b.buffetDate))); // Sort by date in ascending order
    };

    // Function to fetch kpis
    const handleFetchKpis = async () => {

        // Show loader
        setIsFetchingKpis(true)


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

        await fetchAdminKpis(userCredentials?.accessToken as string)
            .then((response) => {
                // Set the Kpis
                setKpis(response.data)
            })
            .catch((error) => {
                // Display error
                toast.error('An error occured.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsFetchingKpis(false);
            })
    }

    // Function to fetch upcoming buffets
    const handleFetchBuffets = async () => {

        // Show loader
        setIsFetchingBuffets(true)

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

        await fetchBuffets(userCredentials?.accessToken as string)
            .then((response) => {

                // Filter and sort the buffets
                const upcomingBuffets = filterAndSortBuffets(response.data);

                // Set the buffets
                setBuffets(upcomingBuffets);
            })
            .catch((error) => {
                // Display error
                toast.error('An error occured.')
                catchError(error)
            })
            .finally(() => {
                // Close loader 
                setIsFetchingBuffets(false);
            })
    };

    useEffect(() => {
        handleFetchBuffets()
        handleFetchKpis()
    }, []);

    return (
        <main className=''>
            <PageTitle title='Dashboard' />
            {isFetchingKpis && isFetchingBuffets ? <FullPageLoader /> : (
                <>
                    <DashboardOverview kpis={kpis} isFetchingKpis={isFetchingKpis} />
                    <UpcomingBuffets buffets={buffets} isFetchingBuffets={isFetchingBuffets} />
                </>
            )
            }
        </main>
    )
}

export default DashboardPage