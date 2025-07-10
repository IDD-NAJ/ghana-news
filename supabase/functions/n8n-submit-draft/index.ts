import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DraftSubmission {
  source_name: string;
  source_url: string;
  original_url: string;
  original_title: string;
  original_content: string;
  paraphrased_title: string;
  paraphrased_content: string;
  paraphrased_excerpt?: string;
  suggested_category: string;
  image_url?: string;
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

    const draftData: DraftSubmission = await req.json();
    
    console.log("Received draft submission:", { 
      title: draftData.paraphrased_title,
      source: draftData.source_name 
    });

    // Find or create news source
    let sourceId: string;
    const { data: existingSource } = await supabase
      .from("news_sources")
      .select("id")
      .eq("url", draftData.source_url)
      .single();

    if (existingSource) {
      sourceId = existingSource.id;
    } else {
      const { data: newSource, error: sourceError } = await supabase
        .from("news_sources")
        .insert({
          name: draftData.source_name,
          url: draftData.source_url,
          active: true
        })
        .select("id")
        .single();

      if (sourceError) {
        console.error("Error creating news source:", sourceError);
        throw sourceError;
      }
      
      sourceId = newSource.id;
    }

    // Create draft article
    const { data: draft, error: draftError } = await supabase
      .from("draft_articles")
      .insert({
        source_id: sourceId,
        original_url: draftData.original_url,
        original_title: draftData.original_title,
        original_content: draftData.original_content,
        paraphrased_title: draftData.paraphrased_title,
        paraphrased_content: draftData.paraphrased_content,
        paraphrased_excerpt: draftData.paraphrased_excerpt,
        suggested_category: draftData.suggested_category,
        image_url: draftData.image_url,
        status: "pending"
      })
      .select()
      .single();

    if (draftError) {
      console.error("Error creating draft article:", draftError);
      throw draftError;
    }

    console.log("Draft article created successfully:", draft.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        draft_id: draft.id,
        message: "Draft article submitted for review"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in n8n-submit-draft function:", error);
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