import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppNotification {
  draft_id: string;
  action: "approved" | "rejected";
  title: string;
  category: string;
  reviewer_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const notificationData: WhatsAppNotification = await req.json();
    
    console.log("Sending WhatsApp notification:", notificationData);

    // Get notification settings
    const { data: settings, error: settingsError } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("active", true)
      .single();

    if (settingsError || !settings?.whatsapp_webhook_url) {
      console.log("No active WhatsApp webhook configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "WhatsApp webhook not configured" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prepare WhatsApp message
    const statusEmoji = notificationData.action === "approved" ? "✅" : "❌";
    const actionText = notificationData.action === "approved" ? "APPROVED & PUBLISHED" : "REJECTED";
    
    const message = `${statusEmoji} *Article ${actionText}*

📰 *Title:* ${notificationData.title}
📂 *Category:* ${notificationData.category}
👤 *Reviewer:* ${notificationData.reviewer_name || "System"}
🕒 *Time:* ${new Date().toLocaleString()}

${notificationData.action === "approved" ? "🎉 The article has been published to the website!" : "📝 The article requires revision before publication."}`;

    // Send WhatsApp notification
    const whatsappResponse = await fetch(settings.whatsapp_webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        recipients: settings.notification_recipients,
        timestamp: new Date().toISOString(),
        metadata: {
          draft_id: notificationData.draft_id,
          action: notificationData.action
        }
      }),
    });

    if (!whatsappResponse.ok) {
      const errorText = await whatsappResponse.text();
      console.error("WhatsApp webhook failed:", errorText);
      throw new Error(`WhatsApp webhook failed: ${errorText}`);
    }

    console.log("WhatsApp notification sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "WhatsApp notification sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-whatsapp-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);