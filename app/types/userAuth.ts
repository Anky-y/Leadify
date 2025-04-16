export default interface AuthUser {
  id: string;
  email: string | undefined;
  created_at: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    [key: string]: any; // To allow additional metadata fields
  };
}
