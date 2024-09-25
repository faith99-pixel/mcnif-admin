import { EnquiryStatus } from "../enums/EnquiryStatus";

export type EnquiryResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  message: string;
  service: string | null;
  status: EnquiryStatus;
  createdAt: string;
};
