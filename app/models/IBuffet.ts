import { FoodRequest } from './IFood';

export type BaseBuffet = {
  name: string;
  description: string;
  pricePerAdult: number;
  pricePerChild: number;
  maxGuests: number;
  buffetDate: string;
  location: string;
  contactPhone: string;
  maxNumberPerBooking: number | null;
  isVisible: boolean;
};

export type BuffetRequest = BaseBuffet & {
  imageBase64Url: string | undefined;
};

export type BuffetResponse = BaseBuffet & {
  id: string;
  imageUrl: string;
  discountPercentage: number;
  expectedGuests: number;
  dietaryRestrictions: string[];
  isArchived: boolean;
};

export type BuffetSessionRequest = {
  startTime: string;
  endTime: string;
  slots: number;
};
export type BuffetSessionResponse = {
  id: string;
  buffetId: string;
  startTime: string;
  endTime: string;
  slots: number;
  slotsTaken: number;
  createdAt: string;
};

export type BuffetDiscounts = {
  id: string,
  buffetId: string,
  discountPercentage: number,
  buffetName: string | null,
  adultPrice: number | null,
  childPrice: number | null,
  imageUrl: string | null,
  description: string | null,
  isGeneral: boolean
}
export type BuffetDiscount = {
  buffetId: string | null;
  discountPercentage: number;
};

export type CompleteBuffetRequest = BuffetRequest &
  BuffetDiscount &
  FoodRequest & {
    buffetSessions: BuffetSessionRequest[];
  };
