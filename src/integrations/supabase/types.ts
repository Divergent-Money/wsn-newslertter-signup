export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      article_engagement: {
        Row: {
          article_id: string
          bookmarked: boolean | null
          created_at: string
          feedback: string | null
          id: string
          read_at: string | null
          read_percentage: number | null
          shared: boolean | null
          time_spent_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          bookmarked?: boolean | null
          created_at?: string
          feedback?: string | null
          id?: string
          read_at?: string | null
          read_percentage?: number | null
          shared?: boolean | null
          time_spent_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          bookmarked?: boolean | null
          created_at?: string
          feedback?: string | null
          id?: string
          read_at?: string | null
          read_percentage?: number | null
          shared?: boolean | null
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_engagement_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "newsletter_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_articles: {
        Row: {
          author: string
          category: string | null
          content: string
          created_at: string
          feature_image_url: string | null
          id: string
          is_featured: boolean | null
          min_tier: Database["public"]["Enums"]["subscription_tier"]
          publish_date: string
          read_time_minutes: number
          slug: string
          summary: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category?: string | null
          content: string
          created_at?: string
          feature_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          min_tier?: Database["public"]["Enums"]["subscription_tier"]
          publish_date?: string
          read_time_minutes?: number
          slug: string
          summary: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string | null
          content?: string
          created_at?: string
          feature_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          min_tier?: Database["public"]["Enums"]["subscription_tier"]
          publish_date?: string
          read_time_minutes?: number
          slug?: string
          summary?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          access_code: string | null
          confirmation_sent_at: string | null
          created_at: string
          email: string
          id: string
          interests: string[] | null
          investment_level: string | null
          is_confirmed: boolean | null
          name: string
          page_location: string | null
          referral_source: string | null
          source: string | null
        }
        Insert: {
          access_code?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          email: string
          id?: string
          interests?: string[] | null
          investment_level?: string | null
          is_confirmed?: boolean | null
          name: string
          page_location?: string | null
          referral_source?: string | null
          source?: string | null
        }
        Update: {
          access_code?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          email?: string
          id?: string
          interests?: string[] | null
          investment_level?: string | null
          is_confirmed?: boolean | null
          name?: string
          page_location?: string | null
          referral_source?: string | null
          source?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_market_alerts: boolean | null
          email_new_content: boolean | null
          email_weekly_digest: boolean | null
          id: string
          push_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_market_alerts?: boolean | null
          email_new_content?: boolean | null
          email_weekly_digest?: boolean | null
          id?: string
          push_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_market_alerts?: boolean | null
          email_new_content?: boolean | null
          email_weekly_digest?: boolean | null
          id?: string
          push_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "newsletter_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string
          id: string
          payment_provider: string | null
          payment_reference: string | null
          payment_status: string | null
          subscription_end_date: string | null
          subscription_start_date: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          tier_update_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          tier_update_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          tier_update_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: "free" | "blaze" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_tier: ["free", "blaze", "premium"],
    },
  },
} as const
