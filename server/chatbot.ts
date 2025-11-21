import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
- Direct users to relevant docs (ESG_GUIDE.md, VERIFICATION_GUIDE.md, DEMO_SCENARIO.md)
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
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured. Please add it to Replit Secrets.");
    }

    // Convert conversation history to OpenAI format
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: LITHITRUST_SYSTEM_PROMPT
      },
      ...conversationHistory.map(msg => ({
        role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: msg.content
      })),
      {
        role: "user",
        content: userMessage
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content from OpenAI");
    }

    return content;
  } catch (error) {
    console.error("Error in LithiBot chat:", error);
    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      throw new Error("LithiBot is not configured. Please add OPENAI_API_KEY to Replit Secrets.");
    }
    throw new Error("Failed to get response from LithiBot. Please try again later.");
  }
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
