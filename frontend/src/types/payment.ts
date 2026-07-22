export type PaymentGatewayKey = "stripe" | "jazzcash" | "easypaisa" | "cod";

export interface PaymentMethodOption {
  key: PaymentGatewayKey;
  label: string;
  configured: boolean;
}

export interface PaymentInitiationResponse {
  status: "succeeded" | "pending" | "failed";
  redirectUrl: string | null;
  transactionId: string | null;
}
