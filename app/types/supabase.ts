export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      fruits: {
        Row: {
          id: number; // bigint
          created_at: string; // timestamp with time zone
          name: string;
        };
        Insert: {
          id?: number; // optional if auto-generated
          created_at?: string; // optional if default now()
          name: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
