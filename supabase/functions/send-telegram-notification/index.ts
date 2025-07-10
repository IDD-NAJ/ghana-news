import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TelegramNotification {
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

    const notificationData: TelegramNotification = await req.json();
    
    console.log("Sending Telegram notification:", notificationData);

    // Get notification settings
    const { data: settings, error: settingsError } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("active", true)
      .single();

    if (settingsError || !settings?.telegram_bot_token) {
      console.log("No active Telegram bot configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Telegram bot not configured" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!settings.telegram_chat_ids || settings.telegram_chat_ids.length === 0) {
      console.log("No Telegram chat IDs configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No Telegram chat IDs configured" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prepare Telegram message
    const statusEmoji = notificationData.action === "approved" ? "✅" : "❌";
    const actionText = notificationData.action === "approved" ? "APPROVED & PUBLISHED" : "REJECTED";
    
    const message = `${statusEmoji} *Article ${actionText}*

📰 *Title:* ${notificationData.title}
📂 *Category:* ${notificationData.category}
👤 *Reviewer:* ${notificationData.reviewer_name || "System"}
🕒 *Time:* ${new Date().toLocaleString()}

${notificationData.action === "approved" ? "🎉 The article has been published to the website!" : "📝 The article requires revision before publication."}`;

    // Send Telegram notifications to all chat IDs
    const telegramPromises = settings.telegram_chat_ids.map(async (chatId: string) => {
      const telegramUrl = `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown"
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Telegram API failed for chat ${chatId}:`, errorText);
        throw new Error(`Telegram API failed for chat ${chatId}: ${errorText}`);
      }

      console.log(`Telegram notification sent successfully to chat ${chatId}`);
      return response.json();
    });

    // Wait for all Telegram messages to be sent
    await Promise.all(telegramPromises);

    console.log("All Telegram notifications sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Telegram notifications sent successfully",
        sent_to: settings.telegram_chat_ids.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-telegram-notification function:", error);
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