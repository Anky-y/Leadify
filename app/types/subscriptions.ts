interface Subscription {
  id: number;
  user_id: string;
  subscription_id: string;
  plan_id: string;
  status: string;
  renews_at: string | null; // ISO timestamp or null
  ends_at: string | null;
  plan_name: string | null;
  product_id: number | null;
  product_name: string | null;
  billing_anchor: string | null;
  created_at: string | null;
  card_brand: string | null;
  card_last_four: string | null;
}
