export default interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  credits: number;
  subscription_status: boolean;
  created_at: string;
}
