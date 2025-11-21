# LithiTrust - Blockchain Traceability Platform for Zimbabwe's Lithium Supply Chain

## Project Overview

LithiTrust is a comprehensive blockchain-backed traceability platform designed to transform Zimbabwe's lithium value chain. The platform enables transparent tracking of lithium ore from mine to manufacturer, with integrated ESG (Environmental, Social, Governance) certification and QR code verification for international buyers.

## Key Features

### 1. Blockchain-Backed Traceability
- Every lithium batch receives a unique digital "birth certificate" with blockchain hash
- Immutable records track material through the entire supply chain
- Complete chain of custody from mine → processor → exporter → manufacturer

### 2. ESG Compliance Tracking
- Environmental, Social, and Governance scores (0-100 scale)
- Child labour checks and community agreement verification
- Water usage, carbon intensity, and safety practices documentation
- Rehabilitation plan tracking

### 3. QR Code Verification
- Unique QR codes generated for each batch
- International buyers can scan to verify authenticity and origin
- Complete traceability data accessible via QR code
- Downloadable certificates for regulatory compliance

### 4. Role-Based Access
- **Miners**: Register batches, track production, view ESG data
- **Processors**: Update batch stages, add processing events
- **Exporters**: Manage export logistics and compliance
- **Buyers**: Verify authenticity, view ESG scores, access certificates
- **Regulators**: Oversight dashboard with comprehensive reporting

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Tailwind CSS** with Shadcn UI components
- **React Query** for data fetching and state management
- **React Hook Form** with Zod validation
- **QR Code generation** with react-qr-code
- **Date formatting** with date-fns
- **Responsive design** with mobile-first approach

### Backend
- **Express.js** server with TypeScript
- **PostgreSQL** database (Neon-backed)
- **Drizzle ORM** for type-safe database operations
- **Replit Auth** (OpenID Connect) for authentication
- **Session-based authentication** with secure cookies
- **Zod** for runtime validation

### Design System
- **Typography**: Inter (body), Space Grotesk (headings), JetBrains Mono (technical data)
- **Color Scheme**: Green sustainability theme (Primary: HSL 142 76% 36%)
- **Components**: Professional, enterprise-grade UI with consistent spacing
- **Dark Mode**: Full support with automatic theme switching

## Database Schema

### Users Table
- Stores user profiles with role-based access
- Fields: id, email, firstName, lastName, profileImageUrl, role, organization

### Batches Table
- Core lithium batch records
- Fields: batchNumber, mineName, mineLocation, minerName, weight, grade, lithiumContent, currentStage, status, blockchainHash, qrCode

### Supply Chain Events Table
- Tracks batch movement through supply chain
- Fields: batchId, stage, stakeholder, location, timestamp, notes, verifiedBy

### ESG Records Table
- Environmental, social, governance compliance data
- Fields: batchId, environmentalScore, socialScore, governanceScore, childLabourCheck, waterUsage, communityAgreement, safetyPractices, rehabilitationPlan, carbonIntensity

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/login` - Initiate OAuth login flow
- `GET /api/logout` - Log out and clear session
- `GET /api/callback` - OAuth callback handler

### Batches
- `GET /api/batches` - List all batches
- `GET /api/batches/:id` - Get batch details
- `POST /api/batches` - Create new batch
- `PATCH /api/batches/:id` - Update batch

### Supply Chain Events
- `GET /api/batches/:id/events` - Get batch event history
- `POST /api/batches/:id/events` - Add new event

### ESG Records
- `GET /api/batches/:id/esg` - Get ESG data
- `POST /api/batches/esg` - Create ESG record
- `PATCH /api/batches/:id/esg` - Update ESG data

## User Workflows

### Register a Batch
1. Navigate to "Register Batch" page
2. **Step 1**: Enter batch details (mine name, location, miner info, weight, grade, lithium content)
3. **Step 2**: Record ESG compliance data (scores, water usage, carbon intensity, safety practices)
4. Submit to create batch with blockchain hash and initial supply chain event

### Track Supply Chain
1. View dashboard with batch statistics
2. Filter batches by stage (mining, processing, export, delivered)
3. Click batch to view detailed timeline
4. See complete chain of custody with stakeholder information

### Generate QR Code
1. Open batch details
2. Navigate to "QR Code" tab
3. View generated QR code (256x256px)
4. Download QR code for printing/sharing

### View ESG Compliance
1. Open batch details
2. Navigate to "ESG Data" tab
3. View overall ESG score and individual E/S/G scores
4. Review detailed compliance information

## Development

### Running Locally
The workflow "Start application" runs:
```bash
npm run dev
```

This starts:
- Express server on port 5000
- Vite dev server with HMR
- PostgreSQL database connection

### Database Migrations
To push schema changes:
```bash
npm run db:push
```

### Environment Variables
Required secrets (automatically managed by Replit):
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPL_ID` - Replit OAuth client ID
- `ISSUER_URL` - OAuth issuer URL

## Design Principles

1. **Transparency First**: Every data point is verifiable and traceable
2. **Professional Credibility**: Enterprise-grade polish for international buyers
3. **Accessibility**: Works for artisanal miners with basic smartphones AND corporate buyers
4. **Data Density Balance**: Dense information for regulators, spacious flows for miners
5. **Sustainability Visual Language**: Green accents represent eco-friendly practices

## Future Enhancements

### Phase 2 (Not in MVP)
- Real blockchain integration (Polygon/Base Layer 2)
- Smart contracts for automated royalty payments
- Document upload for ESG certificates
- Premium pricing calculator based on ESG scores
- Mobile app with offline support
- Multi-language support (Shona, Ndebele, English)
- Real-time lithium pricing feeds
- WhatsApp AI assistant (LithiBot)

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Shadcn UI primitives
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── batch-card.tsx
│   │   │   ├── batch-detail-modal.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/            # Utility functions
│   │   │   ├── queryClient.ts
│   │   │   ├── authUtils.ts
│   │   │   └── utils.ts
│   │   ├── pages/          # Page components
│   │   │   ├── landing.tsx
│   │   │   ├── home.tsx
│   │   │   ├── batches.tsx
│   │   │   ├── register.tsx
│   │   │   ├── reports.tsx
│   │   │   └── settings.tsx
│   │   ├── App.tsx         # Main app component
│   │   ├── index.css       # Global styles
│   │   └── main.tsx        # Entry point
├── server/                 # Express backend
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API routes
│   ├── replitAuth.ts      # Authentication setup
│   └── app.ts             # Express app configuration
├── shared/                # Shared code
│   └── schema.ts          # Database schema & types
├── design_guidelines.md   # UI/UX design specifications
└── replit.md             # This file
```

## Credits

**Team**: Task Force 404
**Hackathon**: Lithium Value Chain Hackathon 2025
**Date**: November 21, 2025

## License

Built for the Lithium Value Chain Hackathon 2025 to empower Zimbabwe's lithium industry through transparency, inclusion, and digital transformation.
