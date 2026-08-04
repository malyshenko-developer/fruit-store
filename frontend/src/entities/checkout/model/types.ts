export interface CreatePaymentIntentInput {
    email: string;
    fullName: string;
    shippingAddress: string;
}

export interface CreatePaymentIntentResponse {
    client_secret: string;
}