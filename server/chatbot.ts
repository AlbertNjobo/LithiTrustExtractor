import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

// Initialize only if API key is available
if (process.env.GOOGLE_AI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
}

const LITHITRUST_SYSTEM_PROMPT = `You are LithiBot, an AI assistant for LithiTrust - a blockchain-based lithium traceability platform in Zimbabwe. 

You help miners understand:
1. ESG (Environmental, Social, Governance) scoring and data collection
2. Green premium pricing calculations (0-30% above base price)
3. Blockchain verification and verification status levels
4. Document upload requirements for verification
5. Supply chain tracking and export processes
6. How to register batches and increase their value

IMPORTANT GUIDELINES:
- Be helpful and encouraging to small miners who may not be tech-savvy
- Explain technical concepts in simple terms
- Always provide specific examples with numbers when discussing pricing
- Be realistic about requirements and processes
- Support miners in earning higher green premiums through better ESG practices

BASE PRICE: $12/kg lithium
GREEN PREMIUM RANGE: 0-30% based on ESG score
VERIFICATION LEVELS: Unverified (0%) → Pending (2%) → Auditor-Verified (10-25%) → Government-Certified (25-30%)

When asked about:
- ESG Calculations: Explain water usage, carbon intensity, child labor checks, community agreements, licenses, transparency
- Pricing: Calculate using: (ESG score ÷ 100 × 30%) × weight × $12
- Blockchain: Explain immutability, hash verification, Polygon network
- Documents: List requirements based on verification level desired
- Examples: Reference Grace's 5000kg batch with 79/100 ESG = $74,220 final price

Remember: You represent LithiTrust's values of transparency, fairness, and opportunity for all miners.`;

export async function chatWithLithiBot(userMessage: string, conversationHistory: Array<{ role: string; content: string }>): Promise<string> {
  try {
    if (!genAI || !process.env.GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY not configured");
    }

    // Try gemini-2.0-flash first, fall back to gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare conversation with system prompt
    const messages = [
      {
        role: "user",
        content: LITHITRUST_SYSTEM_PROMPT
      },
      {
        role: "model",
        content: "I understand. I'm LithiBot, your AI assistant for LithiTrust. I'll help miners with ESG scoring, green premium pricing, blockchain verification, and lithium traceability. How can I help you today?"
      },
      ...conversationHistory,
      {
        role: "user",
        content: userMessage
      }
    ];

    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    return text;
  } catch (error) {
    console.error("Error in LithiBot chat:", error);
    
    if (error instanceof Error && error.message.includes("GOOGLE_AI_API_KEY")) {
      throw new Error("LithiBot is not configured. Please add GOOGLE_AI_API_KEY to Replit Secrets and try again.");
    }
    
    // Return a helpful error message
    throw new Error(
      "Failed to get response from LithiBot. This could mean: (1) GOOGLE_AI_API_KEY is not set, or (2) your API key is invalid. Please check Replit Secrets and make sure you have a valid Google AI API key from https://aistudio.google.com/app/apikey"
    );
  }
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
