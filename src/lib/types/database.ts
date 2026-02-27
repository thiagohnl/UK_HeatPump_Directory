export type Database = {
  public: {
    Tables: {
      verticals: {
        Row: Vertical;
        Insert: Omit<Vertical, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Vertical, 'id'>>;
        Relationships: [];
      };
      installers: {
        Row: Installer;
        Insert: Omit<Installer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Installer, 'id'>>;
        Relationships: [];
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status' | 'is_unlocked'>;
        Update: Partial<Omit<Lead, 'id'>>;
        Relationships: [];
      };
      cities: {
        Row: City;
        Insert: Omit<City, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<City, 'id'>>;
        Relationships: [];
      };
      content_pages: {
        Row: ContentPage;
        Insert: Omit<ContentPage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContentPage, 'id'>>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Vertical = {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Installer = {
  id: string;
  vertical_id: string;
  company_name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address_line_1: string | null;
  address_city: string | null;
  address_county: string | null;
  address_postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  mcs_number: string | null;
  mcs_certified: boolean;
  coverage_postcodes: string[];
  coverage_regions: string[];
  coverage_radius_km: number | null;
  logo_url: string | null;
  has_ashp: boolean;
  has_gshp: boolean;
  has_wshp: boolean;
  has_eahp: boolean;
  has_sahp: boolean;
  has_solar_pv: boolean;
  has_battery: boolean;
  certification_body: string | null;
  boiler_upgrade_scheme: boolean;
  trustmark: boolean;
  source: string | null;
  is_claimed: boolean;
  claimed_by: string | null;
  is_verified: boolean;
  is_active: boolean;
  subscription_tier: 'free' | 'basic' | 'premium';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  vertical_id: string;
  installer_id: string | null;
  homeowner_name: string;
  homeowner_email: string;
  homeowner_phone: string | null;
  postcode: string;
  property_type: 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'bungalow' | 'other' | null;
  property_age: string | null;
  has_epc: boolean | null;
  epc_rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null;
  current_heating: 'gas_boiler' | 'oil_boiler' | 'electric' | 'lpg' | 'coal' | 'none' | 'other' | null;
  timeline: 'asap' | '1-3months' | '3-6months' | '6-12months' | 'researching' | null;
  message: string | null;
  status: 'new' | 'viewed' | 'contacted' | 'converted' | 'expired';
  is_unlocked: boolean;
  created_at: string;
  updated_at: string;
};

export type City = {
  id: string;
  vertical_id: string;
  name: string;
  slug: string;
  county: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  meta_title: string | null;
  meta_description: string | null;
  content: string | null;
  installer_count: number;
  created_at: string;
  updated_at: string;
};

export type ContentPage = {
  id: string;
  vertical_id: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  category: 'guide' | 'faq' | 'page';
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};
