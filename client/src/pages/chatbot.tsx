import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm LithiBot, your AI assistant for LithiTrust. I can help you with ESG scoring, green premium pricing, blockchain verification, document requirements, and everything about getting the best price for your lithium batches. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", {
        message: input,
        history: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Make sure GOOGLE_AI_API_KEY is configured.",
        variant: "destructive"
      });
      
      // Remove the user message if chat failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">LithiBot</h1>
        </div>
        <p className="text-muted-foreground">
          AI Assistant for ESG Scoring, Green Premium Pricing & Blockchain Verification
        </p>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
                data-testid={`message-${message.role}-${index}`}
              >
                <div
                  className={`max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-border"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground border border-border px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <p className="text-sm">LithiBot is thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              placeholder="Ask about ESG scoring, pricing, blockchain, verification..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              data-testid="input-chat-message"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-3 cursor-pointer hover-elevate" onClick={() => setInput("How do I calculate my ESG score?")} data-testid="quick-link-esg">
          <p className="text-sm font-semibold">ESG Scoring</p>
          <p className="text-xs text-muted-foreground">How to calculate scores</p>
        </Card>
        <Card className="p-3 cursor-pointer hover-elevate" onClick={() => setInput("What will my green premium be for a 5000kg batch with 79/100 ESG score?")} data-testid="quick-link-pricing">
          <p className="text-sm font-semibold">Green Premium</p>
          <p className="text-xs text-muted-foreground">Pricing calculations</p>
        </Card>
        <Card className="p-3 cursor-pointer hover-elevate" onClick={() => setInput("How does blockchain verification work?")} data-testid="quick-link-blockchain">
          <p className="text-sm font-semibold">Blockchain</p>
          <p className="text-xs text-muted-foreground">Verification & authenticity</p>
        </Card>
      </div>
    </div>
  );
}
