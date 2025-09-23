export interface HyperPayResult {
  id: string;
  timestamp: string;
  paymentType: string;
  amount: string;
  currency: string;
  result: {
    code: string;
    description: string;
    type?: string;
    extendedDescription?: string;
  };
  // any additional top-level fields you intend to use:
  [key: string]: unknown;
}
