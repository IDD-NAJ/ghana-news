export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ad_interactions: {
        Row: {
          ad_id: string
          created_at: string
          id: string
          interaction_type: string
          ip_address: unknown | null
          page_url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ad_id: string
          created_at?: string
          id?: string
          interaction_type: string
          ip_address?: unknown | null
          page_url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ad_id?: string
          created_at?: string
          id?: string
          interaction_type?: string
          ip_address?: unknown | null
          page_url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_interactions_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisements: {
        Row: {
          active: boolean | null
          ad_type: string
          budget_spent: number | null
          click_count: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          impression_count: number | null
          link_text: string | null
          link_url: string | null
          max_budget: number | null
          placement_position: string | null
          priority: number | null
          start_date: string | null
          target_categories: string[] | null
          target_pages: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          ad_type: string
          budget_spent?: number | null
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          impression_count?: number | null
          link_text?: string | null
          link_url?: string | null
          max_budget?: number | null
          placement_position?: string | null
          priority?: number | null
          start_date?: string | null
          target_categories?: string[] | null
          target_pages?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          ad_type?: string
          budget_spent?: number | null
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          impression_count?: number | null
          link_text?: string | null
          link_url?: string | null
          max_budget?: number | null
          placement_position?: string | null
          priority?: number | null
          start_date?: string | null
          target_categories?: string[] | null
          target_pages?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      advertising_inquiries: {
        Row: {
          budget_range: string | null
          company: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          package_type: string
          phone: string | null
        }
        Insert: {
          budget_range?: string | null
          company: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          package_type: string
          phone?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          package_type?: string
          phone?: string | null
        }
        Relationships: []
      }
      article_images: {
        Row: {
          article_id: string | null
          caption: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
        }
        Insert: {
          article_id?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
        }
        Update: {
          article_id?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_images_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_images_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tags: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          tag_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      article_views: {
        Row: {
          article_id: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          article_id: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          article_id?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          image_url: string | null
          publication_date: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          publication_date?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          publication_date?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      banner_items: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          link: string | null
          link_text: string | null
          message: string
          priority: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          link?: string | null
          link_text?: string | null
          message: string
          priority: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          link?: string | null
          link_text?: string | null
          message?: string
          priority?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          approved: boolean | null
          article_id: string
          author_email: string
          author_name: string
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          article_id: string
          author_email: string
          author_name: string
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          article_id?: string
          author_email?: string
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      draft_articles: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          original_content: string
          original_title: string
          original_url: string | null
          paraphrased_content: string
          paraphrased_excerpt: string | null
          paraphrased_title: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_id: string | null
          status: string
          suggested_category: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          original_content: string
          original_title: string
          original_url?: string | null
          paraphrased_content: string
          paraphrased_excerpt?: string | null
          paraphrased_title: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_id?: string | null
          status?: string
          suggested_category: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          original_content?: string
          original_title?: string
          original_url?: string | null
          paraphrased_content?: string
          paraphrased_excerpt?: string | null
          paraphrased_title?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_id?: string | null
          status?: string
          suggested_category?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "draft_articles_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_articles_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_actions: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          moderator_id: string | null
          notes: string | null
          reason: string | null
          report_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          notes?: string | null
          reason?: string | null
          report_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          notes?: string | null
          reason?: string | null
          report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_actions_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "moderation_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_reports: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reporter_email: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reporter_email?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reporter_email?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news_sources: {
        Row: {
          active: boolean
          api_endpoint: string | null
          created_at: string
          id: string
          name: string
          rss_feed_url: string | null
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          api_endpoint?: string | null
          created_at?: string
          id?: string
          name: string
          rss_feed_url?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          api_endpoint?: string | null
          created_at?: string
          id?: string
          name?: string
          rss_feed_url?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          subscribed: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          subscribed?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          subscribed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          active: boolean
          created_at: string
          id: string
          notification_recipients: string[] | null
          updated_at: string
          whatsapp_webhook_url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          notification_recipients?: string[] | null
          updated_at?: string
          whatsapp_webhook_url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          notification_recipients?: string[] | null
          updated_at?: string
          whatsapp_webhook_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean
          avatar_url: string | null
          bio: string | null
          company_name: string | null
          created_at: string
          email: string
          expertise_areas: string[] | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          expertise_areas?: string[] | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          expertise_areas?: string[] | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          slug: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          newsletter_frequency: string | null
          preferred_categories: string[] | null
          push_notifications: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          newsletter_frequency?: string | null
          preferred_categories?: string[] | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          newsletter_frequency?: string | null
          preferred_categories?: string[] | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      article_analytics: {
        Row: {
          bookmark_count: number | null
          category: string | null
          comment_count: number | null
          created_at: string | null
          featured: boolean | null
          id: string | null
          publication_date: string | null
          published: boolean | null
          title: string | null
          total_views: number | null
          unique_ip_views: number | null
          unique_user_views: number | null
        }
        Relationships: []
      }
      article_view_counts: {
        Row: {
          article_id: string | null
          total_views: number | null
          unique_ip_views: number | null
          unique_user_views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      category_performance: {
        Row: {
          article_count: number | null
          avg_views_per_article: number | null
          category: string | null
          featured_count: number | null
          latest_article_date: string | null
          published_count: number | null
          total_views: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_popular_categories: {
        Args: { limit_count?: number }
        Returns: {
          category: string
          article_count: number
          total_views: number
          avg_views: number
        }[]
      }
      get_trending_articles: {
        Args: { time_period?: unknown; limit_count?: number }
        Returns: {
          id: string
          title: string
          category: string
          total_views: number
          publication_date: string
          trend_score: number
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      promote_to_chief_author: {
        Args: { user_email: string }
        Returns: undefined
      }
      promote_to_news_anchor: {
        Args: { user_email: string }
        Returns: undefined
      }
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
      search_articles: {
        Args: { search_query: string }
        Returns: {
          id: string
          title: string
          excerpt: string
          content: string
          category: string
          image_url: string
          slug: string
          created_at: string
          publication_date: string
          rank: number
        }[]
      }
      user_has_role: {
        Args: { check_role: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
