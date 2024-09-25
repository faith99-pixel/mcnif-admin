export default class ApiRoutes {
    static BASE_URL_TEST: string = "https://test.api.mcnifcuisine.co.uk/";

    static BASE_URL_LIVE: string = "https://api.mcnifcuisine.co.uk";

    // Api route to login
    static LoginAdminUser: string = "api/auth/login";
    
    // Api route for forgot password
    static ForgotPassword: string = "api/auth/forgot-password";

    // Api route to reset password
    static ResetPassword: string = "api/auth/reset-password";

    // Api route to fetch user profile
    static FetchUserProfile: string = "api/auth/users/me";

    // Api route to fetch dashboard kpis
    static FetchAdminKpis: string = "api/admin/kpis";

    // Api route to update user profile
    static UpdateUserProfile: string = "api/auth/users/me";

    // Api route to create a user
    static CreateUser: string = "api/auth/users";

    // Api route to create buffet
    static CreateBuffet: string = "api/buffets";

    // Api route for fetching buffets
    static FetchBuffets: string = "api/buffets";

    // Api route for fetching buffet
    static FetchBuffet: string = "api/buffets";

    // Api route for updating buffet
    static UpdateBuffet: string = "api/buffets";

    // Api route to archive buffet
    static ArchiveBuffet: (id: string) => string = (id: string) => `api/buffets/${id}/archive`;

    /**
     * Api route for testimonials
     */
    static Testimonial: string = "api/testimonials";

    /**
     * Api route for blog posts
     */
    static BlogPost: string = "api/blogposts";

    /**
     * Api route to fetch all reservations
     */
    static FetchPayments: string = "api/buffet/reservations";

    /**
     * Api route to fetch payment details
     */
    static FetchPaymentDetails: string = "api/buffet/reservations";

    /**
     * Api route to update payment status
     */
    static UpdatePaymentStatus: string = "api/buffet/reservations";

    /**
     * Api route to verify cash payment
     */
    static VerifyCashPayment: string = 'api/cash/verify';

    /**
     * Api route to create food
     */
    static CreateFood: string = "api/buffet/foods";

    /**
     * Api route to add food to buffet
     * @param buffetId is the id of the buffet to add a food to 
     * @param foodId is the id of the food to add to the buffet
     * @returns the api route to add food to buffet
     */
    static AddFoodToBuffet: (buffetId: string, foodId: string) => string = (buffetId: string, foodId: string) => `api/buffet/${buffetId}/foods/${foodId}`;

    /**
     * Api route to fetch foods
     */
    static FetchFoods: string = "api/buffet/foods";

    /**
     * Api route to delete food
     */
    static DeleteFood: string = "api/buffet/foods";

    /**
     * Api route to update food
     */
    static UpdateFood: string = "api/buffet/foods";

    /**
     * Api route to create discount
     */
    static CreateDiscount: string = "api/buffet/discounts";

    /**
     * Api route to fetch all discounts
     */
    static FetchDiscounts: string = "api/buffet/discounts";

    /**
     * Api route to fetch all featured foods
     */
    static FetchFeaturedFoods: string = "api/buffet/featured-foods";

    /**
     * Api route to create buffet session
     * @param buffetId is the id of the buffet to create a buffet session for
     * @returns the api route to create a buffet session
     */
    static CreateBuffetSession: (buffetId: string) => string = (buffetId: string) => `api/buffet/${buffetId}/buffet-sessions`;

    /**
     * Api route for fetching enquiries
     */
    static FetchEnquiries: string = "api/enquiries";

    /**
     * Api route for fetching an enquiry
     */
    static FetchEnquiry: string = "api/enquiries";

    /**
     * Api route for fetching service enquiry
     */
    static FetchServiceEnquiries: string = "api/enquiries/service";

    /**
     * Api route to update enquiry status
     */
    static updateEnquiryStatus: string = "api/enquiries/toggle";

    /**
     * Api route to fetch all notifications
     */
    static FetchNotifications: string = "api/admin/recent-activities";

    /**
     * Api route to fetch all subscriptions
     */
    static FetchSubscriptions: string = "api/subscriptions";
}
