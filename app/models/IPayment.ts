import { PaymentMethod } from "../enums/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";

export type Payment = {
  id: string;
  paymentMethod: PaymentMethod ; 
  buffetId: string;
  buffetName: string;
  buffetImageUrl: string;
  buffetSessionId: string;
  buffetSession: string;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  priceForAdult: number;
  priceForChildren: number;
  totalAmount: number;
  totalAmountWithDiscount: number;
  discountApplied: number;
  dietaryRestrictions: string | null;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  paymentStatus: PaymentStatus;
  reservationDate: string;
  paymentDate: string;
};
