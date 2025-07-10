/**
 * Test script for the Draft Submission API
 * This script demonstrates how to submit content to your news platform
 * Run with: node test-draft-submission.js
 */

const SUPABASE_URL = "https://xpmclamtmlogogcpogbq.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbWNsYW10bWxvZ29nY3BvZ2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzY3NDYsImV4cCI6MjA2Mzg1Mjc0Nn0.Q8Xob5r1aRxjz4W24J7XRCXqxswkBTMcLKXJSXwJCqA";

// Sample article to submit
const sampleArticle = {
  source_name: "Test News Source",
  source_url: "https://example-news.com",
  original_url: "https://example-news.com/article/sample-story",
  original_title: "Breaking: Sample News Story for Testing",
  original_content: `This is a sample news article for testing the automated content submission system. 
  
  The article contains multiple paragraphs to simulate real news content. In this test scenario, we're demonstrating how external automation tools can submit original news content to the platform.
  
  The system will automatically paraphrase this content using OpenAI's API, ensuring that the final published version is substantially different from the original while maintaining all key facts and information.
  
  This testing approach allows us to verify that the entire pipeline works correctly, from content submission through AI processing to final storage in the draft articles table.
  
  Additional details and context can be included to make the content more substantial and realistic for testing purposes.`,
  suggested_category: "Technology",
  image_url: "https://via.placeholder.com/400x200/0066cc/ffffff?text=Test+Article"
};

async function submitDraft(articleData) {
  try {
    console.log("Submitting article:", articleData.original_title);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/n8n-submit-draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(articleData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Success:", result);
      console.log(`Draft article created with ID: ${result.draft_id}`);
    } else {
      console.log("❌ Error:", result);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Network error:", error.message);
    return { error: error.message };
  }
}

async function testMultipleSubmissions() {
  console.log("🚀 Testing Draft Submission API\n");
  
  // Test 1: Original article (will be paraphrased)
  console.log("Test 1: Submitting original content for AI paraphrasing");
  await submitDraft(sampleArticle);
  
  console.log("\n" + "=".repeat(50) + "\n");
  
  // Test 2: Pre-paraphrased article
  console.log("Test 2: Submitting pre-paraphrased content");
  const preparaphrased = {
    ...sampleArticle,
    original_title: "Another Test Article with Pre-Paraphrased Content",
    paraphrased_title: "Test Story: Demonstrating Pre-Processed Content Submission",
    paraphrased_content: "This article demonstrates submitting content that has already been paraphrased externally. The system will accept this pre-processed content and store it directly without additional AI processing.",
    paraphrased_excerpt: "This test shows how pre-paraphrased content can be submitted directly to the platform."
  };
  
  await submitDraft(preparaphrased);
  
  console.log("\n🎉 Testing completed!");
  console.log("Check your admin dashboard to see the submitted drafts.");
}

// Run the tests
testMultipleSubmissions();