"use client"
import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/reusable/PageTitle';
import EnquiryContent from './EnquiryContent';
import { EnquiryResponse } from '../models/IEnquiry';
import EnquiryModal from '../components/modal/EnquiryModal';
import { useFetchContactEnquiries, useFetchEnquiry, useFetchServiceEnquiries } from '../api/apiClients';
import { AdminUserContext } from '../context/AdminUserContext';
import { UserCredentialsSub } from '../models/IUser';
import { toast } from 'sonner';
import { catchError } from '../constants/catchError';
import ServiceEnquiriesContentPage from './ServiceEnquiriesContent';
import { EnquiryStatus } from '../enums/EnquiryStatus';

type Props = {
   status: string | EnquiryStatus
}

enum Tab {
   Contact = "contact",
   Services = "services",
}

const EnquiriesPage = (props: Props) => {

   const fetchContactEnquiries = useFetchContactEnquiries()
   const fetchServicesEnquiries = useFetchServiceEnquiries()
   const fetchEnquiry = useFetchEnquiry()

   const { fetchUserCredentials } = useContext(AdminUserContext) || {};

   const [filteredEnquiries, setFilteredEnquiries] = useState<EnquiryResponse[]>([]);
   const [isFetchingEnquiries, setIsFetchingEnquiries] = useState(false)

   const [enquiry, setEnquiry] = useState<EnquiryResponse>();
   const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryResponse>();
   const [isFetchingEnquiry, setIsFetchingEnquiry] = useState(false)

   const [activeTab, setActiveTab] = useState(Tab.Contact);
   const [isEnquiryModalVisible, setIsEnquiryModalVisible] = useState(false);

   const getStyles = (tab: string) =>
      `font-semibold text-xl cursor-pointer pb-2 text-mcNiff-primary-grey3 ${activeTab === tab
         ? "border-b-2 border-primary text-primary transition duration-300"
         : ""
      }`;

   const handleFetchEnquiries = async () => {

      // Fetch user credentials
      let userCredentials: UserCredentialsSub | null | undefined;

      if (!fetchUserCredentials) return;

      setIsFetchingEnquiries(true);

      await fetchUserCredentials(true)
         .then((response) => {
            userCredentials = response;
         })
         .catch((error) => {
         })

      if (activeTab == Tab.Contact) {
         await fetchContactEnquiries(userCredentials?.accessToken as string)
            .then((response) => {
               // Log the response
               setFilteredEnquiries(response.data)
            })
            .catch((error) => {
               // Display error
               toast.error('An error occured, please try again.')
               catchError(error)
            })
            .finally(() => {
               // Close loader 
               setIsFetchingEnquiries(false);

            })
      } else {
         await fetchServicesEnquiries(userCredentials?.accessToken as string)
            .then((response) => {
               // Log the response
               setFilteredEnquiries(response.data)
            })
            .catch((error) => {
               // Display error
               toast.error('An error occured, please try again.')
               catchError(error)
            })
            .finally(() => {
               // Close loader 
               setIsFetchingEnquiries(false);

            })
      }
   }

   const handleFetchEnquiry = async (enquiry: EnquiryResponse) => {

      let userCredentials: UserCredentialsSub | null | undefined;

      if (!fetchUserCredentials) return;

      setIsFetchingEnquiry(true);

      await fetchUserCredentials(true)
         .then((response) => {
            userCredentials = response;
         })
         .catch((error) => {
         })

      await fetchEnquiry(userCredentials?.accessToken as string, enquiry.id)

         .then((response) => {
            // Log the response
            // Set the Enquiry
            setEnquiry(response.data)
            setIsEnquiryModalVisible(true);
         })
         .catch((error) => {
            // Display error
            toast.error('An error occured, please try again.')
            catchError(error)
         })
         .finally(() => {

            // Close loader 
            setIsFetchingEnquiry(false);
         })
   };

   useEffect(() => {
      handleFetchEnquiries();
   }, [activeTab])

   return (
      <>
         {
            enquiry &&
            <EnquiryModal
               visibility={isEnquiryModalVisible}
               setVisibility={setIsEnquiryModalVisible}
               enquiry={enquiry}
               setEnquiry={setEnquiry}
               handleFetchEnquiries={handleFetchEnquiries}

            />
         }

         <main className="w-full h-full">
            <PageTitle title="Enquiries" className='mb-5' />

            <div className="flex items-center justify-start gap-4 mb-6">
               <span
                  onClick={() => setActiveTab(Tab.Contact)}
                  className={getStyles(Tab.Contact)}
               >
                  Contact Enquiries
               </span>
               <span
                  onClick={() => setActiveTab(Tab.Services)}
                  className={getStyles(Tab.Services)}
               >
                  Services Enquiries
               </span>
            </div>

            <div className={`transition-transform duration-500 ${activeTab === Tab.Services ? "translate-x-0" : "-translate-x-0"}`}>
               {
                  activeTab === Tab.Contact && (
                     <EnquiryContent
                        enquiries={filteredEnquiries}
                        showEnquiryDetails={handleFetchEnquiry}
                        isFetchingEnquiry={isFetchingEnquiry}
                        setEnquiry={setEnquiry}
                        setSelectedEnquiry={setSelectedEnquiry}
                        selectedEnquiry={selectedEnquiry}
                        setFilteredEnquiries={setFilteredEnquiries}
                        handleFetchEnquiries={handleFetchEnquiries}
                        isFetchingEnquiries={isFetchingEnquiries}
                     />
                  )
               }

               {
                  activeTab === Tab.Services && (
                     <ServiceEnquiriesContentPage
                        enquiries={filteredEnquiries}
                        showEnquiryDetails={handleFetchEnquiry}
                        isFetchingEnquiry={isFetchingEnquiry}
                        selectedEnquiry={selectedEnquiry}
                        setSelectedEnquiry={setSelectedEnquiry}
                        isFetchingEnquiries={isFetchingEnquiries}
                     />
                  )
               }
            </div>
         </main>
      </>
   );
}

export default EnquiriesPage
