import { EnquiryStatus } from "../enums/EnquiryStatus";

export type EnquiryStatusUpdateRequest = {
  status: EnquiryStatus;
  id: string;
};
