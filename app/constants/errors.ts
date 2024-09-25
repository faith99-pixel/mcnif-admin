  interface responseData {
    errors: { message: string }[];
    errorCode: number;
    status: boolean;
    message: string;
  }
  export const createCustomErrorMessages = (response: responseData) => {
    if (!response) {
      return 'An error occurred. Please try again';
    }

    let message;
    const { errorCode } = response;

    switch (errorCode) {
      case 3000:
        message = "Missing API Key";
        break;
      case 3001:
        message = "Invalid API Key";
        break;
      case 1001:
        message = "Buffet Not Found";
        break;
      case 1003:
        message = "Buffet Session Not Found";
        break;
      case 1004:
        message =  "Buffet Reservation Not Found";
        break;
      case 1005:
        message = "Discount Not Found";
        break;
      case 1006:
        message = "Enquiry Not Found";
        break;
        case 2009:
          message="Buffet session has no more free slots"
      case 1007:
        message = "Food Not Found";
        break;
      case 1008:
        message = "Subscription Not Found";
        break;
      case 1009:
        message = "Testimonial Not Found";
        break;
      case 1010:
        message = "User Not Found";
        break;
      case 1012:
        message =  "Blog Post Not Found Exception";
        break;
      case 2002:
        message = "Buffet Archive Bad Request";
        break;
      case 2011:
        message = "Buffet Booking Limit Exceeded";
        break;
      case 2015:
        message =  "Buffet Discount Already Exists";
        break;
      case 2010:
        message =  "Buffet Fully Booked";
        break;
      case 2013:
        message =  "Buffet Reservation Already Verified";
        break;
      case 2009:
        message =  "Buffet Session Full";
        break;
      case 2012:
        message = "Buffet Session Has Insufficient Space";
        break;
      case 2003:
        message =  "Clashing Buffet Session";
        break;
      case 2008:
        message =  "No adult added to the reservation";
        break;
      case 2016:
        message =  "Food Already Added";
        break;
      case 2017:
        message =  "Food Not Added";
        break;
      case 2014:
        message = "Global Discount Already Exists";
        break;
      case 2001:
        message = "Invalid Max Guest";
        break;
      case 2007:
        message = "Invalid Start Time";
        break;
      case 2006:
        message =  "Invalid Time";
        break;
      case 2004:
        message = "Max Guest Exceeded";
        break;
      case 2005:
        message = "Slot too tight";
        break;
      case 2018:
        message =  "Subscription Already Exists";
        break;
      case 2019:
        message =  "User Already Exists";
        break;
      case 1001:
        message = "Failed to update password";
        break;
      default:
        message = response.message;
    }
    return message;
  };
