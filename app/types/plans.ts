export interface PlanConfig {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  variantId: string | null;
  checkoutUrl: string;
}
