import { PaymentStatus } from "../enums/PaymentStatus";

export type PaymentStatusUpdateRequest = {
    status: PaymentStatus;
    id: string;
  };