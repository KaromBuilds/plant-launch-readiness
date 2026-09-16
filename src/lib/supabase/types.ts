export type OwnerRole = "program" | "operational" | "training_safety";

export interface Database {
  public: {
    Tables: {
      plants: {
        Row: {
          id: string;
          name: string;
          lat: number;
          lng: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          lat: number;
          lng: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["plants"]["Insert"]>;
        Relationships: [];
      };
      plant_managers: {
        Row: {
          id: string;
          user_id: string;
          plant_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plant_id: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["plant_managers"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "plant_managers_plant_id_fkey";
            columns: ["plant_id"];
            isOneToOne: false;
            referencedRelation: "plants";
            referencedColumns: ["id"];
          },
        ];
      };
      owner_assignments: {
        Row: {
          id: string;
          plant_id: string;
          role: OwnerRole;
          person_name: string;
          assigned_at: string;
          assigned_by: string | null;
        };
        Insert: {
          id?: string;
          plant_id: string;
          role: OwnerRole;
          person_name: string;
          assigned_at?: string;
          assigned_by?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["owner_assignments"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "owner_assignments_plant_id_fkey";
            columns: ["plant_id"];
            isOneToOne: false;
            referencedRelation: "plants";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      owner_role: OwnerRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
