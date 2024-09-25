import { EnquiryStatus } from "../enums/EnquiryStatus";
import { PaymentMethod } from "../enums/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";

export function serializeEnquiryStatus(status: EnquiryStatus) {
    switch (status) {
        case EnquiryStatus.Pending:
            return "Pending";
        case EnquiryStatus.Resolved:
            return "Resolved";
        case EnquiryStatus.Unresolved:
            return "Unresolved";
        default:
            return "";
    }
}

export function serializePaymentStatus(status: PaymentStatus) {
    switch (status) {
        case PaymentStatus.Pending:
            return "Pending";
        case PaymentStatus.Unverified:
            return "Unverified";
        case PaymentStatus.Verified:
            return "Verified";
        default:
            return "";
    }
}

export function serializePaymentMethod(status: PaymentMethod) {
    switch (status) {
        case PaymentMethod.Barclay:
            return "Online payment";
        case PaymentMethod.Cash:
            return "Cash";
        case PaymentMethod.Transfer:
            return "Transfer";
        default:
            return "Unavailable";
    }
}