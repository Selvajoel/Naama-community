import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          user_type: 'donor' | 'orphanage';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      orphanages: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string;
          district: string;
          city: string;
          capacity: number;
          contact_person: string;
          contact_email: string;
          contact_phone: string;
          description: string | null;
          current_needs: string | null;
          verification_status: 'pending' | 'approved' | 'rejected';
          verification_documents: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orphanages']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['orphanages']['Insert']>;
      };
      donations: {
        Row: {
          id: string;
          donor_id: string;
          orphanage_id: string;
          donation_type: 'food' | 'fund';
          food_type: string | null;
          quantity: string | null;
          amount: number | null;
          pickup_delivery_date: string | null;
          message: string | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donations']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['donations']['Insert']>;
      };
      testimonials: {
        Row: {
          id: string;
          donation_id: string | null;
          orphanage_id: string;
          content: string;
          author_name: string;
          is_featured: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      impact_metrics: {
        Row: {
          id: string;
          total_meals_donated: number;
          total_orphanages_served: number;
          total_donors: number;
          total_funds_raised: number;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['impact_metrics']['Row']>;
        Update: Partial<Database['public']['Tables']['impact_metrics']['Insert']>;
      };
    };
  };
};
