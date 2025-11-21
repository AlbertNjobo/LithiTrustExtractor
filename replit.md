# LithiTrust - Blockchain Traceability Platform for Zimbabwe's Lithium Supply Chain

## Overview
LithiTrust is a blockchain-backed traceability platform designed to bring transparency to Zimbabwe's lithium value chain, from mine to manufacturer. Its core purpose is to enable immutable tracking of lithium ore, integrate ESG (Environmental, Social, Governance) certification, and provide QR code verification for international buyers. The project aims to empower artisanal miners, ensure ethical sourcing, and unlock "green premium" pricing for compliant lithium, fostering sustainable economic growth and establishing Zimbabwe as a leader in responsible mineral supply.

## User Preferences
I prefer iterative development, so please ask before making major changes. I like detailed explanations and expect the agent to work by providing options for me to choose from when there are multiple ways to implement a feature. I also prefer simple language in explanations and documentation.

## System Architecture

### UI/UX Decisions
- **Typography**: Inter (body), Space Grotesk (headings), JetBrains Mono (technical data).
- **Color Scheme**: Green sustainability theme (Primary: HSL 142 76% 36%).
- **Components**: Professional, enterprise-grade UI with consistent spacing, utilizing Shadcn UI.
- **Dark Mode**: Full support with automatic theme switching.
- **Accessibility**: Designed for both artisanal miners with basic smartphones and corporate buyers, balancing data density for regulators with spacious flows for miners.
- **Sustainability Visual Language**: Green accents to represent eco-friendly practices.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, Tailwind CSS, React Query for data fetching, React Hook Form with Zod, react-qr-code for QR generation, date-fns.
- **Backend**: Express.js with TypeScript, PostgreSQL (Neon-backed), Drizzle ORM, Replit Auth (OpenID Connect) for session-based authentication, Zod for validation.
- **Blockchain Integration**: Utilizes Polygon Mumbai Testnet (Layer 2) for storing immutable batch hashes on-chain, with an easy upgrade path to Polygon Mainnet. Each batch receives a cryptographically generated 32-byte hash stored permanently on the blockchain.
- **AI Chatbot**: LithiBot, powered by Gemini AI, provides context-aware responses via web interface and WhatsApp, answering questions on ESG scoring, green premium, blockchain, and registration.

### Feature Specifications
- **Blockchain-Backed Traceability**: Unique digital "birth certificates" and immutable records for each lithium batch, tracking its journey from mine to manufacturer.
- **Guided ESG Score Calculator**: An integrated, simple 9-question multiple-choice questionnaire for instant ESG score calculation and live "Green Premium" display (0-30% price increase) for miners.
- **ESG Compliance Tracking**: Detailed E, S, G scores (0-100), child labor checks, community agreement verification, water usage, carbon intensity, safety practices, and document upload for verification.
- **QR Code Verification**: Unique QR codes for each batch allowing international buyers to verify authenticity, origin, and access traceability data.
- **LithiBot AI Chatbot**: Web and WhatsApp access for miners to get guidance on ESG, green premium, blockchain, and registration.
- **Role-Based Access**: Granular permissions for Miners, Processors, Exporters, Buyers, and Regulators.

### System Design Choices
- **Transparency First**: All data points are verifiable and traceable.
- **Professional Credibility**: Enterprise-grade polish for international buyers.
- **Development Workflow**: Uses `npm run dev` for local development, `npm run db:push` for database migrations.

## External Dependencies
- **PostgreSQL**: Database solution, specifically Neon-backed.
- **Replit Auth**: OpenID Connect for user authentication.
- **Twilio**: For WhatsApp integration (LithiBot).
- **Gemini AI**: Powers the LithiBot chatbot for context-aware responses.
- **Polygon Mumbai Testnet**: Layer 2 blockchain for immutable storage of batch hashes.