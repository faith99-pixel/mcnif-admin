import axios, { AxiosInstance } from 'axios';
import ApiRoutes from './apiRoutes';
import { ForgotPasswordRequest, LoginRequest, ResetPasswordRequest } from '../models/ILogin';
import { TestimonialRequest } from '../models/ITestimonial';
import { BlogRequest } from '../models/IBlog';
import { BuffetDiscount, BuffetRequest, BuffetSessionRequest } from '../models/IBuffet';
import { FoodRequest } from '../models/IFood';
import { EnquiryStatusUpdateRequest } from '../models/IEnquiryStatusUpdate';
import { UserProfileUpdateRequest } from '../models/IUserProfileResponse';
import { PaymentStatusUpdateRequest } from '../models/IPaymentStatusUpdate';

export const API = axios.create({
    baseURL: ApiRoutes.BASE_URL_TEST
});

const headers = (token?: string) => {
    if (!token) {
        return {
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY
        }
    }

    return {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
        Authorization: `Bearer ${token}`,
    }
}

// Function to login
export function useLogin() {
    async function login(data: LoginRequest) {

        // Fire the request
        const response = await API.post(ApiRoutes.LoginAdminUser, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            }
        });

        // Return the response
        return response;
    }

    return login;
}
// Function that runs forgot password
export function useForgotPassword() {
    async function forgotPassword(data: ForgotPasswordRequest) {

        // Fire the request
        const response = await API.post(ApiRoutes.ForgotPassword, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            }
        });

        // Return the response
        return response;
    }

    return forgotPassword;
}
// Function to reset password
export function useResetPassword() {
    async function resetPassword(data: ResetPasswordRequest) {

        // Fire the request
        const response = await API.post(ApiRoutes.ResetPassword, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            }
        });

        // Return the response
        return response;
    }

    return resetPassword;
}

// Function to fetch user profile
export function useFetchUserProfile() {
    /**
     * @returns the response for the api request
     */
    async function fetchUserProfile(accessToken: string) {
        //Fetch message
        const response = await API.get(ApiRoutes.FetchUserProfile, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchUserProfile;
}

export function useFetchAdminKpis() {
    /**
     * @returns the response for the api request
     */
    async function fetchAdminKpis(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.FetchAdminKpis, {
            headers: headers(accessToken),
        })
        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchAdminKpis;
}

export function useUpdateUser() {
    /**
     * @returns the response for the api request
     */
    async function updateUser({ accessToken, data }: { accessToken: string, data: UserProfileUpdateRequest }) {

        //Fetch message
        const response = await API.put(ApiRoutes.UpdateUserProfile, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return updateUser;
}

//#region Buffet
// Function to create buffet
export function useCreateBuffet() {
    /**
     * @returns the response for the api request
     */
    async function createBuffet(accessToken: string, data: BuffetRequest) {

        //Fetch message
        const response = await API.post(ApiRoutes.CreateBuffet, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return createBuffet;
}

// Function to fetch buffets
export function useFetchBuffets() {
    /**
     * @returns the response for the api request
     */
    async function fetchBuffets(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.FetchBuffets, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchBuffets;
}

// Function to fetch buffet
export function useFetchBuffet() {
    /**
     * @returns the response for the api request
     */
    async function fetchBuffet(accessToken: string, id: string) {

        //Fetch message
        const response = await API.get(`${ApiRoutes.FetchBuffet}/${id}`, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchBuffet;
}

// FUnction to update buffet
export function useUpdateBuffet() {
    /**
     * @returns the response for the api request
     */
    async function updateBuffet({ id, accessToken, data }: { id: string, accessToken: string, data: BuffetRequest }) {

        //Fetch message
        const response = await API.put(`${ApiRoutes.UpdateBuffet}/${id}`, data, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return updateBuffet;
}

// FUnction to archive buffet
export function useArchiveBuffet() {
    /**
     * @returns the response for the api request
     */
    async function archiveBuffet(accessToken: string, id: string) {

        //Fetch message
        const response = await API.patch(ApiRoutes.ArchiveBuffet(id), {}, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            }
        })
        //Return response
        return response;
    }
    //return function to archive buffet
    return archiveBuffet;
}

//#endregion

//#region Enquiries
// Function to get enquiries
export function useFetchContactEnquiries() {
    /**
    * @returns the response for the api request
    */
    async function fetchContactEnquiries(accessToken: string) {
        //make api call to get info
        let result = await API.get(ApiRoutes.FetchEnquiries, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //return result
        return result;
    }

    //return function that get the info
    return fetchContactEnquiries;
}

// function to get an enquiry
export function useFetchEnquiry() {
    /**
     * @returns the response for the api request
     */
    async function fetchEnquiry(accessToken: string, id: string) {

        //Fetch message
        const response = await API.get(`${ApiRoutes.FetchEnquiry}/${id}`, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message

    return fetchEnquiry;
}

// function to update a service enquiry
export function useFetchServiceEnquiries() {
    /**
     * @returns the response for the api request
     */
    async function fetchServiceEnquiries(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.FetchServiceEnquiries, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchServiceEnquiries;
}

// function to update an enquiry status
export function useUpdateEnquiryStatus() {
    /**
     * @returns the response for the api request
     */
    async function updateEnquiryStatus(accessToken: string, enquiry: EnquiryStatusUpdateRequest) {

        // Construct data
        const data = {
            status: enquiry.status
        }

        // Fetch message
        const response = await API.put(`${ApiRoutes.updateEnquiryStatus}/${enquiry.id}`, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return response
        return response;
    }
    // Return function to fetch new message
    return updateEnquiryStatus;
}

//#endregion

//#region Testimonial

// Function to create testimonial
export function useCreateTestimonial() {
    /**
     * @returns the response for the api request
     */
    async function createTestimonial(accessToken: string, data: TestimonialRequest) {

        //Fetch message
        const response = await API.post(ApiRoutes.Testimonial, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return createTestimonial;
}

// Function to fetch testimonials
export function useFetchTestimonials() {
    /**
     * @returns the response for the api request
     */
    async function fetchTestimonials(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.Testimonial, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchTestimonials;
}

// Function to fetch testimonial
export function useFetchTestimonial() {
    /**
     * @returns the response for the api request
     */
    async function fetchTestimonial(accessToken: string, id: string) {

        //Fetch message
        const response = await API.get(`${ApiRoutes.Testimonial}/${id}`, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchTestimonial;
}

// FUnction to update testimonial
export function useUpdateTestimonial() {
    /**
     * @returns the response for the api request
     */
    async function updateTestimonial({ id, accessToken, data }: { id: string, accessToken: string, data: TestimonialRequest }) {

        //Fetch message
        const response = await API.put(`${ApiRoutes.Testimonial}/${id}`, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return updateTestimonial;
}

// Function to delete testimonial
export function useDeleteTestimonial() {
    /**
     * @returns the response for the api request
     */
    async function deleteTestimonial(accessToken: string, id: string) {

        //Fetch message
        const response = await API.delete(`${ApiRoutes.Testimonial}/${id}`, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return deleteTestimonial;
}

//#endregion

//#region Blog Post

// Function to create blog post
export function useCreateBlogPost() {
    /**
     * @returns the response for the api request
     */
    async function createBlogPost(accessToken: string, data: BlogRequest) {

        //Fetch message
        const response = await API.post(ApiRoutes.BlogPost, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return createBlogPost;
}

// Function to fetch blog posts
export function useFetchBlogPosts() {
    /**
     * @returns the response for the api request
     */
    async function fetchBlogPosts(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.BlogPost, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchBlogPosts;
}

// Function to fetch blog post
export function useFetchBlogPost() {
    /**
     * @returns the response for the api request
     */
    async function fetchBlogPost(accessToken: string, id: string) {

        //Fetch message
        const response = await API.get(`${ApiRoutes.BlogPost}/${id}`, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchBlogPost;
}

// FUnction to update blog post
export function useUpdateBlogPost() {
    /**
     * @returns the response for the api request
     */
    async function updateBlogPost({ id, accessToken, data }: { id: string, accessToken: string, data: BlogRequest }) {

        //Fetch message
        const response = await API.put(`${ApiRoutes.BlogPost}/${id}`, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return updateBlogPost;
}

// Function to delete blog post
export function useDeleteBlogPost() {
    /**
     * @returns the response for the api request
     */
    async function deleteBlogPost(accessToken: string, id: string) {

        //Fetch message
        const response = await API.delete(`${ApiRoutes.BlogPost}/${id}`, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return deleteBlogPost;
}

export function useVerifyCashPayment() {
    /**
     * @returns the response for the api request
     */
    async function verifyCashPayment(accessToken: string, reservationId: string) {
        //Fetch message
        const response = await API.post(`${ApiRoutes.VerifyCashPayment}/${reservationId}`, {}, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        }
        );

        //Return response
        return response;
    }
    //return function to fetch new message
    return verifyCashPayment;
}

//#endregion

//#region Payments

export function useFetchPayments() {

    /**
     * @returns the response for the api request
     */
    async function fetchPayments(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.FetchPayments, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchPayments;
}

export function useFetchPaymentDetails() {
    /**
     * @returns the response for the api request
     */
    async function FetchPaymentDetails(accessToken: string, id: string) {

        //Fetch message
        const response = await API.get(`${ApiRoutes.FetchPaymentDetails}/${id}`, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }
    //return function to fetch new message

    return FetchPaymentDetails;
}

export function useUpdatePaymentStatus() {
    /**
     * @returns the response for the api request
     */
    async function updatePaymentStatus(accessToken: string, paymentDetails: PaymentStatusUpdateRequest) {

        // Construct data
        const data = {
            status: paymentDetails.status
        }

        // Fetch message
        const response = await API.put(`${ApiRoutes.UpdatePaymentStatus}/${paymentDetails.id}`, data, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Return response
        return response;
    }
    // Return function to fetch new message
    return updatePaymentStatus;
}


//#endregion

//#region Food

// Function to create food
export function useCreateFood() {
    /**
     * @returns the response for the api request
     */
    async function createFood(accessToken: string, data: FoodRequest) {

        //Fetch message
        const response = await API.post(ApiRoutes.CreateFood, data, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    }

    //return function to fetch new message
    return createFood;
}

// Function to add food to buffet
export function useAddFoodToBuffet() {
    /**
     * @returns the response for the api request
     */
    async function addFoodToBuffet(accessToken: string, buffetId: string, foodId: string) {

        // Send request
        const response = await API.post(ApiRoutes.AddFoodToBuffet(buffetId, foodId), {}, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    }

    //return function to fetch new message
    return addFoodToBuffet;
}

// Function to fetch foods
export function useFetchFoods() {

    /**
     * @returns the response for the api request
     */
    async function fetchFoods(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.FetchFoods, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchFoods;
}
// Function to fetch featured foods
export function useFetchFeaturedFoods() {

    /**
     * @returns the response for the api request
     */
    async function fetchFeaturedFoods(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.FetchFeaturedFoods, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchFeaturedFoods;
}

// Function to fetch food
export function useFetchFood() {
    /**
     * @returns the response for the api request
     */
    async function fetchFood(accessToken: string, id: string) {

        //Fetch message
        const response = await API.get(`${ApiRoutes.FetchFoods}/${id}`, {
            headers: headers(accessToken)
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchFood;
}

// FUnction to update food
export function useUpdateFood() {
    /**
     * @returns the response for the api request
     */
    async function updateFood({ id, accessToken, data }: { id: string, accessToken: string, data: FoodRequest }) {

        //Fetch message
        const response = await API.put(`${ApiRoutes.UpdateFood}/${id}`, data, {
            headers: headers(accessToken)
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return updateFood;
}

// Function to delete food
export function useDeleteFood() {
    /**
     * @returns the response for the api request
     */
    async function deleteFood(accessToken: string, id: string) {

        //Fetch message
        const response = await API.delete(`${ApiRoutes.DeleteFood}/${id}`, {
            headers: headers(accessToken)
        });

        //Return response
        return response;
    }
    //return function to fetch new message
    return deleteFood;
}

//#endregion

//#region Buffet Discount

// Function to create buffet discount
export function useCreateDiscount() {
    /**
     * @returns the response for the api request
     */
    async function createDiscount(accessToken: string, data: BuffetDiscount) {

        //Fetch message
        const response = await API.post(ApiRoutes.CreateDiscount, data, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    };

    //return function to fetch new message
    return createDiscount;
}

// Function to fetch buffet discounts
export function useFetchBuffetDiscounts() {

    /**
     * @returns the response for the api request
     */
    async function fetchBuffetDiscounts(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.FetchDiscounts, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    }

    //return function to fetch new message
    return fetchBuffetDiscounts;
}

//#endregion

//#region Buffet Session

// Function to create buffet session
export function useCreateBuffetSession() {
    /**
     * @returns the response for the api request
     */
    async function createBuffetSession(accessToken: string, buffetId: string, data: BuffetSessionRequest) {

        // Send request
        const response = await API.post(ApiRoutes.CreateBuffetSession(buffetId), data, {
            headers: headers(accessToken),
        });

        //Return response
        return response;
    }

    //return function to fetch new message
    return createBuffetSession;
}

//#endregion

//#region Notifications

// Function to fetch notifications
export function useFetchNotifications() {
    /**
     * @returns the response for the api request
     */
    async function fetchNotifications(accessToken: string) {

        // Send request
        const response = await API.get(ApiRoutes.FetchNotifications, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //Return response
        return response;
    }

    //return function to fetch new message
    return fetchNotifications;
}
//#endregion

//#region Subscriptions
export function useFetchSubscriptions() {
    /**
     * @returns the response for the api request
     */
    async function fetchSubscriptions(accessToken: string) {

        //Fetch message
        const response = await API.get(ApiRoutes.FetchSubscriptions, {
            headers: {
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                Authorization: `Bearer ${accessToken}`,
            },
        });
        //Return response
        return response;
    }
    //return function to fetch new message
    return fetchSubscriptions;
}

//#endregion