import { chatWithLithiBot } from "./chatbot";

interface ConversationSession {
  phoneNumber: string;
  history: Array<{ role: string; content: string }>;
  lastMessageTime: number;
}

const conversationSessions: Map<string, ConversationSession> = new Map();
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Clean up old sessions
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  conversationSessions.forEach((session, key) => {
    if (now - session.lastMessageTime > SESSION_TIMEOUT_MS) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => conversationSessions.delete(key));
}, 60000); // Check every minute

function getOrCreateSession(phoneNumber: string): ConversationSession {
  if (!conversationSessions.has(phoneNumber)) {
    conversationSessions.set(phoneNumber, {
      phoneNumber,
      history: [],
      lastMessageTime: Date.now(),
    });
  }
  const session = conversationSessions.get(phoneNumber)!;
  session.lastMessageTime = Date.now();
  return session;
}

export async function handleWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<string> {
  try {
    const session = getOrCreateSession(phoneNumber);

    // Get response from LithiBot
    const response = await chatWithLithiBot(message, session.history);

    // Update conversation history
    session.history.push({ role: "user", content: message });
    session.history.push({ role: "assistant", content: response });

    // Keep only last 20 messages to avoid too large history
    if (session.history.length > 40) {
      session.history = session.history.slice(-40);
    }

    return response;
  } catch (error) {
    console.error("Error handling WhatsApp message:", error);
    throw error;
  }
}

export function validateTwilioWebhook(
  requestBody: Record<string, string>,
  twilioAuthToken: string,
  url: string,
  signature: string
): boolean {
  // Simple validation - in production, use Twilio's official SDK
  // This is a placeholder for Twilio's request validation
  return signature ? true : false;
}

export function formatWhatsAppResponse(message: string): string {
  // WhatsApp has 4096 character limit for messages
  if (message.length > 4096) {
    return message.substring(0, 4093) + "...";
  }
  return message;
}
