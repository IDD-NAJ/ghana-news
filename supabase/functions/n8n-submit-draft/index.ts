import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
  // Optional - if paraphrasing is done externally
  paraphrased_title?: string;
  paraphrased_content?: string;
  paraphrased_excerpt?: string;
  suggested_category: string;
  image_url?: string;
}

async function paraphraseContent(title: string, content: string, category: string): Promise<{
  paraphrased_title: string
  paraphrased_content: string
  paraphrased_excerpt: string
}> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  console.log("Starting paraphrasing for:", title);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional news editor. Your task is to paraphrase news articles while maintaining accuracy and journalistic integrity. 

Rules:
1. Rewrite the content completely in your own words
2. Maintain all key facts, dates, names, and important details
3. Keep the same tone and style appropriate for the "${category}" category
4. Make the content engaging and readable
5. Ensure the paraphrased version is substantially different from the original but conveys the same information
6. Create a compelling excerpt that summarizes the main points in 2-3 sentences

Return your response as a JSON object with these exact keys:
- paraphrased_title: A rewritten headline that captures the essence of the story
- paraphrased_content: The full article rewritten in your own words
- paraphrased_excerpt: A 2-3 sentence summary of the main points`
        },
        {
          role: 'user',
          content: `Please paraphrase this news article:

Title: ${title}

Content: ${content}

Category: ${category}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', errorText);
    throw new Error('Failed to paraphrase content');
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  
  console.log("Paraphrasing completed successfully");
  
  return {
    paraphrased_title: result.paraphrased_title || title,
    paraphrased_content: result.paraphrased_content || content,
    paraphrased_excerpt: result.paraphrased_excerpt || content.substring(0, 200) + '...'
  };
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
      title: draftData.original_title,
      source: draftData.source_name 
    });

    // Paraphrase content if not already provided
    let paraphrased_title = draftData.paraphrased_title;
    let paraphrased_content = draftData.paraphrased_content;
    let paraphrased_excerpt = draftData.paraphrased_excerpt;

    if (!paraphrased_title || !paraphrased_content) {
      console.log("Paraphrasing content automatically...");
      const paraphrased = await paraphraseContent(
        draftData.original_title,
        draftData.original_content,
        draftData.suggested_category
      );
      
      paraphrased_title = paraphrased.paraphrased_title;
      paraphrased_content = paraphrased.paraphrased_content;
      paraphrased_excerpt = paraphrased.paraphrased_excerpt;
    }

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
        paraphrased_title: paraphrased_title,
        paraphrased_content: paraphrased_content,
        paraphrased_excerpt: paraphrased_excerpt,
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