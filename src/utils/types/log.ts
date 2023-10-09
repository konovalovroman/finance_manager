import { PaymentType } from "./paymentType";

export type PaymentLog = {
    type: PaymentType;
    category: string;
    date: Date;
    amount: number;
    action: PaymentLogAction;
};

export type PaymentLogAction = "CREATE" | "UPDATE" | "DELETE";
