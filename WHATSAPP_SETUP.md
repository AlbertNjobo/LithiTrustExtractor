# LithiBot WhatsApp Integration Guide

## Overview

LithiBot is now available on WhatsApp, enabling small-scale lithium miners in Zimbabwe to access instant guidance on mining regulations, ESG compliance, pricing, and blockchain verification via their phones.

## Features

✅ **Instant Regulatory Guidance** - Mining claims, registration processes, export regulations
✅ **ESG Compliance Support** - Environmental impact calculations, social metrics, governance requirements
✅ **Green Premium Pricing** - Real-time calculations for lithium prices with ESG bonuses
✅ **Blockchain Verification** - Help understanding batch hashes and verification status
✅ **Conversation History** - Maintains context across multiple messages (30-minute sessions)
✅ **Works on Basic Phones** - SMS and WhatsApp compatible with feature phones

## Setup Instructions

### 1. Get Twilio Credentials

1. Sign up at [Twilio.com](https://www.twilio.com)
2. Create a WhatsApp Business Account (or use Sandbox for testing)
3. Obtain:
   - **Account SID** - Your Twilio account identifier
   - **Auth Token** - Your account authentication token
   - **WhatsApp Phone Number** - The sandbox number or your business number
   - **Webhook URL** - Will be your app's `/api/whatsapp/webhook` endpoint

### 2. Add Secrets to Replit

In your Replit Secrets (gear icon → Secrets):

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### 3. Configure Twilio Webhook

1. Log into Twilio Console
2. Navigate to **Messaging → Try it out → Send a WhatsApp message**
3. Set **Webhook URL**: `https://your-replit-url/api/whatsapp/webhook`
4. Set **Method**: `POST`
5. Test by sending a message to your WhatsApp number

## API Endpoint

### WhatsApp Webhook
- **POST** `/api/whatsapp/webhook`
- **GET** `/api/whatsapp/webhook` (for Twilio verification)

**Request Format (from Twilio):**
```json
{
  "From": "whatsapp:+263772123456",
  "Body": "What is the green premium for my batch?"
}
```

**Response Format:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>LithiBot response here...</Message>
</Response>
```

## How Miners Use It

### 1. Register Their WhatsApp Number
Users add your LithiBot WhatsApp number to their contacts and send a message.

### 2. Ask Questions
- "How do I calculate my ESG score?"
- "What's the green premium for 5000kg at 80/100 ESG?"
- "How do I upload documents for verification?"
- "What does blockchain verification mean?"

### 3. Get Instant Responses
LithiBot responds with:
- Clear, simple explanations
- Specific calculations with numbers
- Step-by-step guidance
- References to official documentation

## Example Conversation

```
User: I have 3000kg of lithium ore. How much can I sell it for?

LithiBot: Great! To calculate your price, I need a bit more info:
1. What's your environmental score? (water usage, carbon impact)
2. What's your social score? (child labor checks, community agreements)
3. What's your governance score? (licenses, transparency)

Once you give me those, I can calculate your base price ($12/kg) plus your green premium!

User: Environmental 75, Social 70, Governance 85

LithiBot: Excellent! Your ESG average is 76.7/100
- Base price: 3000kg × $12 = $36,000
- Green premium: 76.7% of 30% = 23%
- Premium amount: $8,280
- **Total selling price: $44,280**

That's 23% above base price for your responsible practices!
```

## Integration Architecture

### Frontend Integration
Users can access the web-based chatbot via the LithiTrust platform dashboard for authenticated users.

### WhatsApp Integration
Unauthenticated miners can message WhatsApp directly without needing:
- Login credentials
- Internet data plan (works with basic WhatsApp)
- Computer or complex apps

### Session Management
- Each WhatsApp number gets its own conversation session
- Sessions last 30 minutes of inactivity
- Full conversation history is maintained within a session
- History is cleared when session expires

## Troubleshooting

### "Invalid Twilio request" error
- Check your `TWILIO_AUTH_TOKEN` is set correctly
- Verify webhook URL is exactly as configured in Twilio
- Ensure X-Twilio-Signature header is present

### Messages not being received
- Confirm WhatsApp sandbox number is added as contact
- Check Twilio logs in console
- Verify webhook POST endpoint is accessible

### Session timeout
- Sessions expire after 30 minutes of inactivity
- User should send a new message to start fresh conversation
- This is by design to manage server resources

## Message Character Limits

WhatsApp enforces a 4096 character limit per message. LithiBot automatically truncates longer responses and adds "..." to indicate truncation.

## Future Enhancements

1. **SMS Support** - Add SMS-only access for basic phones without WhatsApp
2. **Scheduled Updates** - Send daily lithium price alerts
3. **Document Verification** - WhatsApp photo uploads for ESG documents
4. **Cooperative Groups** - Group chat support for mining cooperatives
5. **Multi-language** - Shona, Ndebele, and English support

## Cost Considerations

**Twilio Pricing (as of 2025):**
- WhatsApp API: ~$0.0075 per message (inbound and outbound)
- 1000 messages/month ≈ $15
- Phone number: ~$1/month
- No setup fees for sandbox testing

## Security Notes

- Webhook requests are validated with Twilio signature verification
- Session data is in-memory and cleared on server restart
- No user authentication required (access based on WhatsApp phone number)
- HTTPS required for production webhooks

## Testing Without Twilio Setup

For development without Twilio credentials:
1. Use the web chatbot interface at `/chatbot` 
2. Set `GOOGLE_AI_API_KEY` secret
3. LithiBot will work fully in the web interface
4. WhatsApp endpoint will be available but non-functional without Twilio credentials

## Support

For issues with:
- **Twilio Setup**: Visit [Twilio Docs](https://www.twilio.com/docs/whatsapp/api)
- **LithiBot Responses**: Check ESG_GUIDE.md and VERIFICATION_GUIDE.md
- **Blockchain Integration**: See BLOCKCHAIN_SETUP.md

---

**Last Updated:** November 21, 2025  
**Integration Status:** ✅ Ready for Twilio Configuration
